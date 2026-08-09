import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Room = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price_per_night: number;
  max_guests: number;
  bed_type: string | null;
  room_size: string | null;
  bathroom: string | null;
  view_note: string | null;
  hero_image: string | null;
  images: { url: string; alt: string | null }[];
};

export type SiteContent = {
  rooms: Room[];
  amenities: { category: string; name: string; icon: string | null; is_available: boolean }[];
  addons: { id: string; name: string; description: string | null; price: number; price_type: string }[];
  highlights: { title: string; description: string | null; icon: string | null }[];
  inclusions: { category: string; item: string }[];
  gallery: { url: string; alt: string | null; category: string }[];
  houseRules: { label: string; value: string }[];
  nearby: {
    name: string;
    category: string;
    distance: string | null;
    travel_time: string | null;
    description: string | null;
  }[];
  faqs: { question: string; answer: string }[];
  reviews: {
    guest_name: string;
    rating: number;
    body: string;
    stay_type: string | null;
    reviewed_on: string | null;
    source: string | null;
  }[];
  info: Record<string, string>;
};

export const getSiteContent = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  const { getPublicServerClient } = await import("./supabase-public.server");
  const db = getPublicServerClient();

  const [
    rooms,
    roomImages,
    amenities,
    addons,
    highlights,
    inclusions,
    gallery,
    houseRules,
    nearby,
    faqs,
    reviews,
    info,
  ] = await Promise.all([
    db.from("rooms").select("*").eq("is_active", true).order("sort_order"),
    db.from("room_images").select("room_id,url,alt,sort_order").order("sort_order"),
    db.from("amenities").select("category,name,icon,is_available,sort_order").order("sort_order"),
    db.from("addons").select("id,name,description,price,price_type").eq("is_active", true).order("sort_order"),
    db.from("highlights").select("title,description,icon").order("sort_order"),
    db.from("inclusions").select("category,item").order("sort_order"),
    db.from("gallery_images").select("url,alt,category").order("sort_order"),
    db.from("house_rules").select("label,value").order("sort_order"),
    db.from("nearby_places").select("name,category,distance,travel_time,description").order("sort_order"),
    db.from("faqs").select("question,answer").eq("is_published", true).order("sort_order"),
    db
      .from("reviews")
      .select("guest_name,rating,body,stay_type,reviewed_on,source")
      .eq("is_published", true)
      .order("sort_order"),
    db.from("property_information").select("key,value"),
  ]);

  const imagesByRoom = (roomImages.data ?? []).reduce<Record<string, { url: string; alt: string | null }[]>>(
    (acc, image) => {
      (acc[image.room_id] ??= []).push({ url: image.url, alt: image.alt });
      return acc;
    },
    {},
  );

  return {
    rooms: (rooms.data ?? []).map((room) => ({
      id: room.id,
      slug: room.slug,
      name: room.name,
      tagline: room.tagline,
      description: room.description,
      price_per_night: Number(room.price_per_night),
      max_guests: room.max_guests,
      bed_type: room.bed_type,
      room_size: room.room_size,
      bathroom: room.bathroom,
      view_note: room.view_note,
      hero_image: room.hero_image,
      images: imagesByRoom[room.id] ?? [],
    })),
    amenities: amenities.data ?? [],
    addons: (addons.data ?? []).map((addon) => ({ ...addon, price: Number(addon.price) })),
    highlights: highlights.data ?? [],
    inclusions: inclusions.data ?? [],
    gallery: gallery.data ?? [],
    houseRules: houseRules.data ?? [],
    nearby: nearby.data ?? [],
    faqs: faqs.data ?? [],
    reviews: reviews.data ?? [],
    info: Object.fromEntries((info.data ?? []).map((row) => [row.key, row.value ?? ""])),
  };
});

export const getBookedDates = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ roomId: z.string().uuid().optional() }).parse(input))
  .handler(async ({ data }) => {
    // Availability is derived server-side and only date columns are returned.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin.from("bookings").select("room_id,check_in,check_out").neq("status", "cancelled");
    if (data.roomId) query = query.eq("room_id", data.roomId);
    const { data: rows } = await query;
    return rows ?? [];
  });

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        name: z.string().trim().min(1).max(100),
        email: z.string().trim().email().max(255),
        phone: z.string().trim().max(40).optional().or(z.literal("")),
        message: z.string().trim().min(1).max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
    });
    if (error) throw new Error("We couldn't send your message. Please try again.");
    return { ok: true };

  });
