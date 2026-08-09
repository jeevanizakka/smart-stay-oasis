import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { siteContentQuery } from "@/lib/queries";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox } from "@/components/site/Lightbox";
import { formatINR, groupBy } from "@/lib/format";

export const Route = createFileRoute("/rooms/$slug")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteContentQuery);
  },
  head: ({ params }) => ({
    meta: [
      { title: `Room — ${params.slug.replace(/-/g, " ")} | Markoni AI Stay` },
      {
        name: "description",
        content: "A private room with terrace access near Kempegowda International Airport, Bangalore.",
      },
      { property: "og:title", content: "A private room at Markoni AI Stay" },
      {
        property: "og:description",
        content: "A private room with terrace access near Bangalore Airport.",
      },
      { property: "og:url", content: `/rooms/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/rooms/${params.slug}` }],
  }),
  component: RoomDetail,
  notFoundComponent: () => (
    <div className="shell py-40 text-center">
      <h1 className="font-display text-4xl">That room doesn't exist</h1>
      <Link to="/rooms" className="mt-6 inline-block border-b border-foreground/30 pb-1 text-sm">
        See all rooms
      </Link>
    </div>
  ),
});

function RoomDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(siteContentQuery);
  const room = data.rooms.find((r) => r.slug === slug);
  const [open, setOpen] = useState<number | null>(null);

  if (!room) throw notFound();

  const amenityGroups = groupBy(
    data.amenities.filter((a) => a.is_available),
    (a) => a.category,
  );

  return (
    <div className="pb-24 pt-32">
      <div className="shell">
        <Reveal>
          <Link to="/rooms" className="eyebrow">
            ← All rooms
          </Link>
          <h1 className="mt-6 max-w-3xl font-display text-5xl sm:text-6xl">{room.name}</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">{room.tagline}</p>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-3">
        {room.images.map((image, i) => (
          <button
            key={image.url}
            type="button"
            onClick={() => setOpen(i)}
            className="img-zoom aspect-4/3 bg-muted"
            aria-label={`Open image ${i + 1}`}
          >
            <img src={image.url} alt={image.alt ?? room.name} loading="lazy" className="size-full object-cover" />
          </button>
        ))}
      </div>

      <div className="shell mt-16 grid gap-14 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-7">
          <Reveal>
            <p className="eyebrow">The room</p>
            <p className="mt-5 text-muted-foreground">{room.description}</p>
          </Reveal>

          <Reveal>
            <dl className="grid grid-cols-2 gap-6 border-y border-border py-8 text-sm">
              <div>
                <dt className="eyebrow">Sleeps</dt>
                <dd className="mt-2">{room.max_guests} guests</dd>
              </div>
              <div>
                <dt className="eyebrow">Bed</dt>
                <dd className="mt-2">{room.bed_type}</dd>
              </div>
              <div>
                <dt className="eyebrow">Size</dt>
                <dd className="mt-2">{room.room_size}</dd>
              </div>
              <div>
                <dt className="eyebrow">Bathroom</dt>
                <dd className="mt-2">{room.bathroom}</dd>
              </div>
              <div className="col-span-2">
                <dt className="eyebrow">Outlook</dt>
                <dd className="mt-2">{room.view_note}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal>
            <p className="eyebrow">In this room</p>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {Object.entries(amenityGroups).map(([category, items]) => (
                <div key={category}>
                  <p className="text-sm">{category}</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {items.map((item) => (
                      <li key={item.name}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="sticky top-28 border border-border bg-card p-8 shadow-soft">
            <p className="font-display text-4xl">{formatINR(room.price_per_night)}</p>
            <p className="mt-1 text-sm text-muted-foreground">per night, before taxes</p>
            <Link
              to="/book"
              search={{ room: room.slug }}
              className="mt-7 block rounded-full bg-clay px-6 py-3.5 text-center text-sm font-medium text-clay-foreground"
            >
              Check availability
            </Link>
            <ul className="mt-7 space-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
              <li>Check-in after 1:00 pm, self check-in</li>
              <li>Checkout before 10:00 am</li>
              <li>Free cancellation until 24 hours before</li>
              <li>No payment needed to request a stay</li>
            </ul>
          </div>
        </aside>
      </div>

      <Lightbox images={room.images} index={open} onClose={() => setOpen(null)} onIndexChange={setOpen} />
    </div>
  );
}
