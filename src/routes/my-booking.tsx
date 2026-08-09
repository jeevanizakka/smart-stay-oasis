import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { lookupBooking, cancelBooking } from "@/lib/booking.functions";
import { Reveal } from "@/components/site/Reveal";
import { formatINR, formatDateLong } from "@/lib/format";

export const Route = createFileRoute("/my-booking")({
  head: () => ({
    meta: [
      { title: "Manage your booking — Markoni AI Stay" },
      { name: "description", content: "Look up your stay at Markoni AI Stay with your reference and email, and cancel if your plans change." },
      { property: "og:title", content: "Manage your booking — Markoni AI Stay" },
      { property: "og:description", content: "Look up or cancel your stay with your booking reference." },
      { property: "og:url", content: "/my-booking" },
    ],
    links: [{ rel: "canonical", href: "/my-booking" }],
  }),
  component: MyBookingPage,
});

type Booking = Awaited<ReturnType<typeof lookupBooking>>;

function MyBookingPage() {
  const find = useServerFn(lookupBooking);
  const cancel = useServerFn(cancelBooking);
  const [booking, setBooking] = useState<Booking>(null);
  const [creds, setCreds] = useState({ reference: "", email: "" });
  const [busy, setBusy] = useState(false);

  const field = "mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-ring";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await find({ data: creds });
      if (!result) toast.error("No booking found with those details.");
      setBooking(result);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onCancel() {
    setBusy(true);
    try {
      await cancel({ data: creds });
      const result = await find({ data: creds });
      setBooking(result);
      toast.success("Your booking has been cancelled.");
    } catch {
      toast.error("We couldn't cancel that booking. Please message us.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shell max-w-3xl pb-24 pt-36">
      <Reveal>
        <p className="eyebrow">Your stay</p>
        <h1 className="mt-5 font-display text-5xl sm:text-6xl">Manage your booking.</h1>
      </Reveal>

      <form onSubmit={onSubmit} className="mt-12 border border-border bg-card p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm">
            Booking reference
            <input
              required
              value={creds.reference}
              onChange={(e) => setCreds((c) => ({ ...c, reference: e.target.value.toUpperCase() }))}
              placeholder="MK-XXXXXX"
              className={field}
            />
          </label>
          <label className="block text-sm">
            Email used to book
            <input
              required
              type="email"
              value={creds.email}
              onChange={(e) => setCreds((c) => ({ ...c, email: e.target.value }))}
              className={field}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-7 rounded-full bg-clay px-7 py-3 text-sm font-medium text-clay-foreground disabled:opacity-60"
        >
          {busy ? "Checking…" : "Find my booking"}
        </button>
      </form>

      {booking ? (
        <div className="mt-10 border border-border bg-card p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl">{booking.rooms?.name}</h2>
            <span className="eyebrow">{booking.status}</span>
          </div>
          <dl className="mt-8 grid gap-6 border-y border-border py-8 text-sm sm:grid-cols-2">
            <div>
              <dt className="eyebrow">Reference</dt>
              <dd className="mt-1">{booking.reference}</dd>
            </div>
            <div>
              <dt className="eyebrow">Guests</dt>
              <dd className="mt-1">
                {booking.adults} adults{booking.children ? `, ${booking.children} children` : ""}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Check-in</dt>
              <dd className="mt-1">{formatDateLong(booking.check_in)} · after 1:00 pm</dd>
            </div>
            <div>
              <dt className="eyebrow">Checkout</dt>
              <dd className="mt-1">{formatDateLong(booking.check_out)} · before 10:00 am</dd>
            </div>
            <div>
              <dt className="eyebrow">Nights</dt>
              <dd className="mt-1">{booking.nights}</dd>
            </div>
            <div>
              <dt className="eyebrow">Total</dt>
              <dd className="mt-1">{formatINR(Number(booking.total))}</dd>
            </div>
          </dl>
          {booking.status !== "cancelled" ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="mt-7 rounded-full border border-input px-7 py-3 text-sm disabled:opacity-60"
            >
              Cancel this booking
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
