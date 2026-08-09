import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { siteContentQuery } from "@/lib/queries";
import { getBookedDates } from "@/lib/content.functions";
import { getQuote, createBooking } from "@/lib/booking.functions";
import type { Quote } from "@/lib/booking.functions";
import { Reveal } from "@/components/site/Reveal";
import { formatINR, formatDateLong, nightsBetween, toISODate } from "@/lib/format";

const searchSchema = z.object({ room: z.string().optional() });

export const Route = createFileRoute("/book")({
  validateSearch: searchSchema,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteContentQuery);
  },
  head: () => ({
    meta: [
      { title: "Check availability & book — Markoni AI Stay" },
      {
        name: "description",
        content:
          "Pick your dates, choose a room and send a booking request. No payment needed — we confirm by message.",
      },
      { property: "og:title", content: "Check availability & book — Markoni AI Stay" },
      { property: "og:description", content: "Pick your dates and request your stay. No payment needed." },
      { property: "og:url", content: "/book" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

const field = "mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-ring";

function BookPage() {
  const search = Route.useSearch();
  const { data } = useSuspenseQuery(siteContentQuery);
  const quoteFn = useServerFn(getQuote);
  const bookFn = useServerFn(createBooking);
  const bookedFn = useServerFn(getBookedDates);

  const today = toISODate(new Date());
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomId, setRoomId] = useState(
    data.rooms.find((room) => room.slug === search.room)?.id ?? data.rooms[0]?.id ?? "",
  );
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [details, setDetails] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestCountry: "",
    arrivalTime: "",
    specialRequests: "",
  });
  const [quote, setQuote] = useState<Quote | null>(null);
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [booked, setBooked] = useState<{ room_id: string; check_in: string; check_out: string }[]>([]);

  useEffect(() => {
    bookedFn({ data: {} })
      .then(setBooked)
      .catch(() => setBooked([]));
  }, [bookedFn]);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  const unavailableRooms = useMemo(() => {
    if (!checkIn || !checkOut) return new Set<string>();
    return new Set(
      booked.filter((b) => b.check_in < checkOut && b.check_out > checkIn).map((b) => b.room_id),
    );
  }, [booked, checkIn, checkOut]);

  const room = data.rooms.find((r) => r.id === roomId);

  async function refreshQuote() {
    if (!roomId || nights < 1) return null;
    const result = await quoteFn({ data: { roomId, checkIn, checkOut, addonIds } });
    setQuote(result);
    return result;
  }

  async function goToStep(next: number) {
    if (next === 2 && nights < 1) {
      toast.error("Choose a check-in and checkout date.");
      return;
    }
    if (next >= 2) {
      setBusy(true);
      const result = await refreshQuote().catch(() => null);
      setBusy(false);
      if (!result) {
        toast.error("We couldn't price those dates. Please try again.");
        return;
      }
      if (!result.available) {
        toast.error("That room is taken for those dates. Try different dates or another room.");
        return;
      }
    }
    setStep(next);
  }

  async function submit() {
    setBusy(true);
    try {
      const result = await bookFn({
        data: {
          roomId,
          checkIn,
          checkOut,
          addonIds,
          adults: guests.adults,
          children: guests.children,
          ...details,
        },
      });
      setReference(result.reference);
      setStep(5);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't complete that booking.");
    } finally {
      setBusy(false);
    }
  }

  if (step === 5 && reference) {
    return (
      <div className="shell max-w-2xl pb-24 pt-40 text-center">
        <p className="eyebrow">Request received</p>
        <h1 className="mt-5 font-display text-5xl">Thank you, {details.guestName.split(" ")[0]}.</h1>
        <p className="mt-5 text-muted-foreground">
          Your booking reference is <span className="text-foreground">{reference}</span>. We'll confirm by
          message shortly, and payment is arranged directly with us — nothing to pay now.
        </p>
        <dl className="mt-10 grid gap-6 border-y border-border py-8 text-left text-sm sm:grid-cols-2">
          <div>
            <dt className="eyebrow">Room</dt>
            <dd className="mt-1">{room?.name}</dd>
          </div>
          <div>
            <dt className="eyebrow">Nights</dt>
            <dd className="mt-1">{nights}</dd>
          </div>
          <div>
            <dt className="eyebrow">Check-in</dt>
            <dd className="mt-1">{formatDateLong(checkIn)}</dd>
          </div>
          <div>
            <dt className="eyebrow">Checkout</dt>
            <dd className="mt-1">{formatDateLong(checkOut)}</dd>
          </div>
          <div>
            <dt className="eyebrow">Total</dt>
            <dd className="mt-1">{quote ? formatINR(quote.total) : "—"}</dd>
          </div>
        </dl>
        <Link to="/my-booking" className="mt-10 inline-block border-b border-foreground/30 pb-1 text-sm">
          Manage your booking
        </Link>
      </div>
    );
  }

  return (
    <div className="shell grid gap-14 pb-24 pt-36 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Reveal>
          <p className="eyebrow">Step {step} of 4</p>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl">
            {step === 1 ? "Your dates." : step === 2 ? "Add services." : step === 3 ? "Your details." : "Review."}
          </h1>
        </Reveal>

        {step === 1 ? (
          <div className="mt-12 space-y-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm">
                Check-in
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className={field}
                />
              </label>
              <label className="block text-sm">
                Checkout
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className={field}
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm">
                Adults
                <select
                  value={guests.adults}
                  onChange={(e) => setGuests((g) => ({ ...g, adults: Number(e.target.value) }))}
                  className={field}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </label>
              <label className="block text-sm">
                Children
                <select
                  value={guests.children}
                  onChange={(e) => setGuests((g) => ({ ...g, children: Number(e.target.value) }))}
                  className={field}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                </select>
              </label>
            </div>

            <div>
              <p className="eyebrow">Choose a room</p>
              <ul className="mt-5 space-y-3">
                {data.rooms.map((option) => {
                  const taken = unavailableRooms.has(option.id);
                  return (
                    <li key={option.id}>
                      <button
                        type="button"
                        disabled={taken}
                        onClick={() => setRoomId(option.id)}
                        className={`flex w-full items-center gap-5 border p-4 text-left transition-colors ${
                          option.id === roomId ? "border-clay bg-secondary" : "border-border"
                        } ${taken ? "opacity-40" : "hover:border-foreground/40"}`}
                      >
                        <img
                          src={option.hero_image ?? ""}
                          alt=""
                          className="size-20 shrink-0 object-cover"
                          loading="lazy"
                        />
                        <span className="flex-1">
                          <span className="block font-display text-xl">{option.name}</span>
                          <span className="block text-xs text-muted-foreground">
                            {taken ? "Not available for these dates" : option.tagline}
                          </span>
                        </span>
                        <span className="text-sm">{formatINR(option.price_per_night)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {data.addons.map((addon) => {
              const checked = addonIds.includes(addon.id);
              return (
                <li key={addon.id} className="flex items-start gap-4 py-5">
                  <input
                    id={`addon-${addon.id}`}
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setAddonIds((ids) =>
                        checked ? ids.filter((id) => id !== addon.id) : [...ids, addon.id],
                      )
                    }
                    className="mt-1.5 size-4 accent-clay"
                  />
                  <label htmlFor={`addon-${addon.id}`} className="flex-1 cursor-pointer">
                    <span className="block font-display text-xl">{addon.name}</span>
                    <span className="block text-sm text-muted-foreground">{addon.description}</span>
                  </label>
                  <span className="text-sm">{formatINR(addon.price)}</span>
                </li>
              );
            })}
          </ul>
        ) : null}

        {step === 3 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              Full name
              <input
                value={details.guestName}
                onChange={(e) => setDetails((d) => ({ ...d, guestName: e.target.value }))}
                maxLength={100}
                className={field}
              />
            </label>
            <label className="block text-sm">
              Email
              <input
                type="email"
                value={details.guestEmail}
                onChange={(e) => setDetails((d) => ({ ...d, guestEmail: e.target.value }))}
                maxLength={255}
                className={field}
              />
            </label>
            <label className="block text-sm">
              Phone
              <input
                value={details.guestPhone}
                onChange={(e) => setDetails((d) => ({ ...d, guestPhone: e.target.value }))}
                maxLength={40}
                className={field}
              />
            </label>
            <label className="block text-sm">
              Country
              <input
                value={details.guestCountry}
                onChange={(e) => setDetails((d) => ({ ...d, guestCountry: e.target.value }))}
                maxLength={80}
                className={field}
              />
            </label>
            <label className="block text-sm">
              Estimated arrival time
              <input
                value={details.arrivalTime}
                onChange={(e) => setDetails((d) => ({ ...d, arrivalTime: e.target.value }))}
                placeholder="e.g. 11:30 pm"
                maxLength={40}
                className={field}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              Anything we should know
              <textarea
                rows={4}
                value={details.specialRequests}
                onChange={(e) => setDetails((d) => ({ ...d, specialRequests: e.target.value }))}
                maxLength={1000}
                className={field}
              />
            </label>
          </div>
        ) : null}

        {step === 4 ? (
          <dl className="mt-12 divide-y divide-border border-y border-border text-sm">
            {[
              ["Room", room?.name ?? ""],
              ["Check-in", `${formatDateLong(checkIn)} · after 1:00 pm`],
              ["Checkout", `${formatDateLong(checkOut)} · before 10:00 am`],
              ["Nights", String(nights)],
              ["Guests", `${guests.adults} adults${guests.children ? `, ${guests.children} children` : ""}`],
              ["Name", details.guestName],
              ["Email", details.guestEmail],
              ["Phone", details.guestPhone],
              ["Requests", details.specialRequests || "—"],
            ].map(([label, value]) => (
              <div key={label} className="grid gap-1 py-4 sm:grid-cols-3">
                <dt className="eyebrow">{label}</dt>
                <dd className="sm:col-span-2">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-12 flex items-center gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded-full border border-input px-7 py-3 text-sm"
            >
              Back
            </button>
          ) : null}
          {step < 4 ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => goToStep(step + 1)}
              className="rounded-full bg-clay px-8 py-3 text-sm font-medium text-clay-foreground disabled:opacity-60"
            >
              {busy ? "Checking…" : "Continue"}
            </button>
          ) : (
            <button
              type="button"
              disabled={busy || !details.guestName || !details.guestEmail || !details.guestPhone}
              onClick={submit}
              className="rounded-full bg-clay px-8 py-3 text-sm font-medium text-clay-foreground disabled:opacity-60"
            >
              {busy ? "Sending…" : "Request this stay"}
            </button>
          )}
        </div>
      </div>

      <aside className="lg:col-span-4 lg:col-start-9">
        <div className="sticky top-28 border border-border bg-card p-8">
          <p className="eyebrow">Your stay</p>
          <p className="mt-4 font-display text-3xl">{room?.name}</p>
          {nights > 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDateLong(checkIn)} → {formatDateLong(checkOut)} · {nights} nights
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Choose your dates to see the price.</p>
          )}

          {quote ? (
            <dl className="mt-7 space-y-2.5 border-t border-border pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  {formatINR(quote.pricePerNight)} × {quote.nights} nights
                </dt>
                <dd>{formatINR(quote.roomTotal)}</dd>
              </div>
              {quote.addons.map((addon) => (
                <div key={addon.id} className="flex justify-between">
                  <dt className="text-muted-foreground">{addon.name}</dt>
                  <dd>{formatINR(addon.total)}</dd>
                </div>
              ))}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Taxes ({quote.taxRate}%)</dt>
                <dd>{formatINR(quote.taxes)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <dt>Total</dt>
                <dd>{formatINR(quote.total)}</dd>
              </div>
            </dl>
          ) : null}

          <p className="mt-7 border-t border-border pt-6 text-xs text-muted-foreground">
            No payment is taken here. We confirm your dates by message and arrange payment directly. Free
            cancellation until 24 hours before check-in.
          </p>
        </div>
      </aside>
    </div>
  );
}
