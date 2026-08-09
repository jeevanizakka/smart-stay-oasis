import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { siteContentQuery } from "@/lib/queries";
import { sendContactMessage } from "@/lib/content.functions";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteContentQuery);
  },
  head: () => ({
    meta: [
      { title: "Contact the hosts — Markoni AI Stay" },
      { name: "description", content: "Message Captain Bismi and Sudarshana about dates, longer stays, airport pickup or anything else." },
      { property: "og:title", content: "Contact the hosts — Markoni AI Stay" },
      { property: "og:description", content: "Message the hosts about dates, longer stays or airport pickup." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const send = useServerFn(sendContactMessage);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);
    try {
      await send({
        data: {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          message: String(form.get("message") ?? ""),
        },
      });
      setSent(true);
    } catch {
      toast.error("We couldn't send that. Please check your details and try again.");
    } finally {
      setSending(false);
    }
  }

  const field = "mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-ring";

  return (
    <div className="shell grid gap-14 pb-24 pt-36 lg:grid-cols-12">
      <Reveal className="lg:col-span-5">
        <p className="eyebrow">Say hello</p>
        <h1 className="mt-5 font-display text-5xl sm:text-6xl">Talk to the hosts.</h1>
        <p className="mt-5 text-muted-foreground">
          For dates, longer stays, airport pickup or anything the FAQ doesn't cover.
        </p>
        <dl className="mt-10 space-y-5 border-t border-border pt-8 text-sm">
          <div>
            <dt className="eyebrow">Phone</dt>
            <dd className="mt-1">{data.info["phone"]}</dd>
          </div>
          <div>
            <dt className="eyebrow">WhatsApp</dt>
            <dd className="mt-1">{data.info["whatsapp"]}</dd>
          </div>
          <div>
            <dt className="eyebrow">Email</dt>
            <dd className="mt-1">{data.info["email"]}</dd>
          </div>
          <div>
            <dt className="eyebrow">Hosts</dt>
            <dd className="mt-1">
              {data.info["host_name"]} and {data.info["cohost_name"]}
            </dd>
          </div>
        </dl>
      </Reveal>

      <div className="lg:col-span-6 lg:col-start-7">
        {sent ? (
          <div className="border border-border bg-card p-10">
            <h2 className="font-display text-3xl">Message sent</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Thank you — we'll come back to you shortly, usually within a few hours.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="border border-border bg-card p-8 sm:p-10">
            <label className="block text-sm">
              Your name
              <input name="name" required maxLength={100} className={field} />
            </label>
            <label className="mt-6 block text-sm">
              Email
              <input name="email" type="email" required maxLength={255} className={field} />
            </label>
            <label className="mt-6 block text-sm">
              Phone (optional)
              <input name="phone" maxLength={40} className={field} />
            </label>
            <label className="mt-6 block text-sm">
              Message
              <textarea name="message" required rows={5} maxLength={2000} className={field} />
            </label>
            <button
              type="submit"
              disabled={sending}
              className="mt-8 w-full rounded-full bg-clay px-6 py-3.5 text-sm font-medium text-clay-foreground disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
