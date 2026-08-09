import { nightsBetween } from "./format";

type QuoteInput = {
  roomId: string;
  checkIn: string;
  checkOut: string;
  addonIds: string[];
};

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function taxRate() {
  const db = await admin();
  const { data } = await db.from("property_information").select("value").eq("key", "tax_rate").maybeSingle();
  const parsed = Number(data?.value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function isRoomFree(roomId: string, checkIn: string, checkOut: string) {
  const db = await admin();
  const { data } = await db
    .from("bookings")
    .select("id")
    .eq("room_id", roomId)
    .neq("status", "cancelled")
    .lt("check_in", checkOut)
    .gt("check_out", checkIn)
    .limit(1);
  return (data ?? []).length === 0;
}

export async function buildQuote(input: QuoteInput) {
  const db = await admin();
  const nights = nightsBetween(input.checkIn, input.checkOut);
  if (nights < 1) throw new Error("Checkout must be at least one night after check-in.");

  const { data: room } = await db
    .from("rooms")
    .select("price_per_night")
    .eq("id", input.roomId)
    .eq("is_active", true)
    .maybeSingle();
  if (!room) throw new Error("That room is no longer available.");

  const pricePerNight = Number(room.price_per_night);
  const roomTotal = pricePerNight * nights;

  const { data: addonRows } = input.addonIds.length
    ? await db.from("addons").select("id,name,price,price_type").in("id", input.addonIds).eq("is_active", true)
    : { data: [] as { id: string; name: string; price: number; price_type: string }[] };

  const addons = (addonRows ?? []).map((addon) => {
    const price = Number(addon.price);
    const total = addon.price_type === "per_night" ? price * nights : price;
    return { id: addon.id, name: addon.name, price, priceType: addon.price_type, total };
  });

  const addonsTotal = addons.reduce((sum, addon) => sum + addon.total, 0);
  const rate = await taxRate();
  const taxes = Math.round(((roomTotal + addonsTotal) * rate) / 100);
  const available = await isRoomFree(input.roomId, input.checkIn, input.checkOut);

  return {
    nights,
    pricePerNight,
    roomTotal,
    addons,
    addonsTotal,
    taxRate: rate,
    taxes,
    total: roomTotal + addonsTotal + taxes,
    available,
  };
}

function makeReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `MK-${out}`;
}

type BookingInput = QuoteInput & {
  adults: number;
  children: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry?: string | undefined;
  arrivalTime?: string | undefined;
  specialRequests?: string | undefined;
};

export async function placeBooking(input: BookingInput) {
  const db = await admin();
  const quote = await buildQuote(input);
  if (!quote.available) throw new Error("Those dates were just taken. Please choose different dates.");

  const reference = makeReference();
  const { data: booking, error } = await db
    .from("bookings")
    .insert({
      reference,
      room_id: input.roomId,
      check_in: input.checkIn,
      check_out: input.checkOut,
      nights: quote.nights,
      adults: input.adults,
      children: input.children,
      guest_name: input.guestName,
      guest_email: input.guestEmail,
      guest_phone: input.guestPhone,
      guest_country: input.guestCountry || null,
      arrival_time: input.arrivalTime || null,
      special_requests: input.specialRequests || null,
      room_total: quote.roomTotal,
      addons_total: quote.addonsTotal,
      taxes: quote.taxes,
      total: quote.total,
      status: "pending",
      payment_status: "unpaid",
    })
    .select("id,reference")
    .single();

  if (error || !booking) {
    throw new Error("Those dates were just taken. Please choose different dates.");
  }

  if (quote.addons.length) {
    await db.from("booking_addons").insert(
      quote.addons.map((addon) => ({
        booking_id: booking.id,
        addon_id: addon.id,
        name: addon.name,
        price: addon.total,
        quantity: 1,
      })),
    );
  }

  return { reference: booking.reference, email: input.guestEmail };
}

const BOOKING_FIELDS =
  "reference,check_in,check_out,nights,adults,children,guest_name,guest_email,guest_phone,arrival_time,special_requests,room_total,addons_total,taxes,total,status,payment_status,created_at,rooms(name,slug,hero_image)";

export async function findBooking(reference: string, email: string) {
  const db = await admin();
  const { data } = await db
    .from("bookings")
    .select(BOOKING_FIELDS)
    .eq("reference", reference.trim().toUpperCase())
    .ilike("guest_email", email.trim())
    .maybeSingle();

  if (!data) return null;

  const { data: addons } = await db
    .from("booking_addons")
    .select("name,price,bookings!inner(reference)")
    .eq("bookings.reference", data.reference);

  return { ...data, addons: (addons ?? []).map((a) => ({ name: a.name, price: Number(a.price) })) };
}

export async function cancelGuestBooking(reference: string, email: string) {
  const db = await admin();
  const booking = await findBooking(reference, email);
  if (!booking) throw new Error("We couldn't find a booking with those details.");
  if (booking.status === "cancelled") return { ok: true };
  await db
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("reference", booking.reference)
    .ilike("guest_email", email.trim());
  return { ok: true };
}
