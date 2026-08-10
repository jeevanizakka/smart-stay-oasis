import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { siteContentQuery } from "@/lib/queries";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox } from "@/components/site/Lightbox";
import { formatINR, groupBy } from "@/lib/format";

const roomImages: Record<string, string[]> = {
  "The Terrace Suite": [
    "/images/01428f9a-3737-4f10-b34c-a88141dbd27f.avif",
    "/images/0b0052d1-cc00-4c6c-a091-3bd553eff871.avif",
    "/images/39d19606-9ca1-43bb-a576-b6dfde9f1436.avif",
  ],

  "The Garden Room": [
    "/images/8b27aca9-300c-428e-bf08-03427dca1629.avif",
    "/images/97ff6722-fa53-466c-b64d-435b5767571b.avif",
    "/images/9ab930b9-375d-4a2c-a94f-acc09081c5b5.avif",
  ],

  "The Woodline Room": [
    "/images/9b33c36c-8226-413a-9088-6379172d2bf4.avif",
    "/images/c9384e1d-de27-4c9b-ab36-9ba7e039a328.avif",
    "/images/e11f5ef8-4f36-4ac6-8175-9f22e3c3663d.avif",
  ],
};

export const Route = createFileRoute("/rooms/$slug")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteContentQuery);
  },

  head: ({ params }) => ({
    meta: [
      {
        title: `Room — ${params.slug.replace(/-/g, " ")} | Markoni AI Stay`,
      },
      {
        name: "description",
        content:
          "A private room with terrace access near Kempegowda International Airport, Bangalore.",
      },
      {
        property: "og:title",
        content: "A private room at Markoni AI Stay",
      },
      {
        property: "og:description",
        content:
          "A private room with terrace access near Bangalore Airport.",
      },
      {
        property: "og:url",
        content: `/rooms/${params.slug}`,
      },
    ],
    links: [{ rel: "canonical", href: `/rooms/${params.slug}` }],
  }),

  component: RoomDetail,

  notFoundComponent: () => (
    <div className="shell pb-24 pt-36">
      <h1 className="font-display text-4xl">That room doesn't exist</h1>
      <Link
        to="/rooms"
        className="mt-6 inline-block border-b border-foreground/30 pb-1"
      >
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
const images = roomImages[room.name] ?? [];

  return (
    <div className="pb-24 pt-36">
      <div className="shell">
        <Link
          to="/rooms"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← All rooms
        </Link>

        <div className="mt-8">
          <p className="eyebrow">Accommodation</p>

          <h1 className="mt-4 font-display text-5xl sm:text-6xl">
            {room.name}
          </h1>

          <p className="mt-4 max-w-xl text-muted-foreground">
            {room.tagline}
          </p>
        </div>
      </div>

      <div className="shell mt-12 grid grid-cols-2 gap-2 md:grid-cols-3">
        {images.map((image, i) => (
          <button
            key={image}
            type="button"
            onClick={() => setOpen(i)}
            className="img-zoom aspect-4/3 bg-muted"
            aria-label={`Open image ${i + 1}`}
          >
            <img
              src={image}
              alt={`${room.name} — image ${i + 1}`}
              loading="lazy"
              className="size-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="shell mt-16 grid gap-14 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-7">
          <Reveal>
            <p className="eyebrow">The room</p>

            <p className="mt-5 text-muted-foreground">
              {room.description}
            </p>
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
            <p className="font-display text-4xl">
              {formatINR(room.price_per_night)}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              per night, before taxes
            </p>

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

      <Lightbox
        images={images.map((url) => ({
          url,
          alt: room.name,
        }))}
        index={open}
        onClose={() => setOpen(null)}
        onIndexChange={setOpen}
      />
    </div>
  );
}