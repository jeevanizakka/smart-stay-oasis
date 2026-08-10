import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { siteContentQuery } from "@/lib/queries";
import { Reveal } from "@/components/site/Reveal";
import { RoomCard } from "@/components/site/RoomCard";
import { StarRating } from "@/components/site/StarRating";
import { formatINR, groupBy } from "@/lib/format";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteContentQuery);
  },

  head: () => ({
    meta: [
      {
        title: "Markoni AI Stay — Private room & terrace near Bangalore Airport",
      },
      {
        name: "description",
        content:
          "A calm private stay in Tharabanahalli, minutes from Kempegowda International Airport. Self check-in, terrace, fast Wi-Fi, from ₹1,899 a night.",
      },
      {
        property: "og:title",
        content:
          "Markoni AI Stay — Private room & terrace near Bangalore Airport",
      },
      {
        property: "og:description",
        content:
          "A calm private stay minutes from Bangalore Airport. Self check-in, terrace, fast Wi-Fi.",
      },
      {
        property: "og:url",
        content: "/",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),

  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(siteContentQuery);

  const {
    rooms,
    highlights,
    reviews,
    faqs,
    nearby,
    info,
    amenities,
  } = data;

  /*
   * IMPORTANT:
   * These are browser paths, NOT Windows paths.
   *
   * We are deliberately NOT using:
   * 01428f9a-3737-4f10-b34c-a88141dbd27f.avif
   *
   * because that is the bathroom image that was appearing at the top.
   */

  const heroImage =
    "/images/39d19606-9ca1-43bb-a576-b6dfde9f1436.avif";

  const propertyImages = [
    "/images/39d19606-9ca1-43bb-a576-b6dfde9f1436.avif",
    "/images/0b0052d1-cc00-4c6c-a091-3bd553eff871.avif",
    "/images/8b27aca9-300c-428e-bf08-03427dca1629.avif",
    "/images/9ab930b9-375d-4a2c-a94f-acc09081c5b5.avif",
    "/images/9b33c36c-8226-413a-9088-6379172d2bf4.avif",
    "/images/c9384e1d-de27-4c9b-ab36-9ba7e039a328.avif",
    "/images/e11f5ef8-4f36-4ac6-8175-9f22e3c3663d.avif",
    "/images/ed322732-eb6b-4196-b1f4-006b4f61a707.avif",
  ];

  const bottomImage =
    "/images/0b0052d1-cc00-4c6c-a091-3bd553eff871.avif";

  const lowest = rooms.length
    ? Math.min(...rooms.map((room) => room.price_per_night))
    : 0;

  const amenityGroups = groupBy(
    amenities.filter((a) => a.is_available),
    (a) => a.category,
  );

  return (
    <>
      {/* =========================================================
          HERO
          ========================================================= */}

      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img
          src={heroImage}
          alt="Markoni AI Stay"
          className="absolute inset-0 size-full object-cover"
          loading="eager"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/45" />

        <div className="shell relative w-full pb-20 pt-36 text-ink-foreground">
          <p className="eyebrow text-ink-foreground/70">
            Tharabanahalli · Bangalore North
          </p>

          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Your private stay, close to where your journey begins.
          </h1>

          <p className="mt-7 max-w-xl text-base text-ink-foreground/80">
            A room of your own, a terrace under an open sky, and self
            check-in at any hour — a short drive from Kempegowda
            International Airport.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-full bg-clay px-8 py-4 text-sm font-medium text-clay-foreground transition-colors hover:bg-clay/90"
            >
              Check availability
              <ArrowRight className="size-4" />
            </Link>

            <Link
              to="/rooms"
              className="inline-flex items-center rounded-full border border-ink-foreground/30 px-8 py-4 text-sm font-medium text-ink-foreground transition-colors hover:bg-ink-foreground/10"
            >
              View the rooms
            </Link>

            <span className="text-sm text-ink-foreground/70">
              From {formatINR(lowest)} a night
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          WELCOME
          ========================================================= */}

      <section className="shell grid gap-14 py-28 lg:grid-cols-12 lg:py-36">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">The stay</p>

          <h2 className="mt-5 font-display text-4xl sm:text-5xl">
            A quiet house on the airport road, kept the way we'd want to
            arrive.
          </h2>
        </Reveal>

        <Reveal
          className="space-y-6 text-muted-foreground lg:col-span-6 lg:col-start-7"
          delay={120}
        >
          <p>
            Zoe is a family home set behind a planted wall, with a garden
            staircase leading to a private upper floor. Guests come for one
            night between flights, or stay for weeks while working. Either
            way the space is yours: your own entrance, your own bathroom,
            your own terrace.
          </p>

          <p>
            Everything is handled quietly. Arrival instructions reach you
            before you land, the door opens on your schedule, and Markoni AI
            answers whatever comes up during your stay — with{" "}
            {info["host_name"]} and {info["cohost_name"]} a message away when
            a human is the right answer.
          </p>

          <Link
            to="/amenities"
            className="inline-block border-b border-foreground/30 pb-1 text-sm text-foreground"
          >
            What's included in every stay
          </Link>
        </Reveal>
      </section>

      {/* =========================================================
          HIGHLIGHTS
          ========================================================= */}

      <section className="bg-secondary py-24">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Why guests choose it</p>
          </Reveal>

          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((highlight, i) => (
              <Reveal key={highlight.title} delay={i * 60}>
                <h3 className="font-display text-2xl">
                  {highlight.title}
                </h3>

                <p className="mt-3 text-sm text-muted-foreground">
                  {highlight.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          ROOMS
          ========================================================= */}

      <section className="shell py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Where you'll sleep</p>

            <h2 className="mt-5 max-w-xl font-display text-4xl sm:text-5xl">
              Three private rooms, each with its own character.
            </h2>
          </div>

          <Link
            to="/rooms"
            className="border-b border-foreground/30 pb-1 text-sm"
          >
            All rooms
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {rooms.map((room, i) => (
            <Reveal key={room.id} delay={i * 90}>
              <RoomCard room={room} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* =========================================================
          PROPERTY PHOTO STRIP
          ========================================================= */}

      <section className="py-4">
        <Reveal className="shell">
          <p className="eyebrow">The property</p>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-4">
          {propertyImages.map((src, i) => (
            <div
              key={src}
              className="img-zoom aspect-square overflow-hidden bg-muted"
            >
              <img
                src={src}
                alt={`Markoni AI Stay property photo ${i + 1}`}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="shell mt-8">
          <Link
            to="/gallery"
            className="border-b border-foreground/30 pb-1 text-sm"
          >
            Open the full gallery
          </Link>
        </div>
      </section>

      {/* =========================================================
          AMENITIES
          ========================================================= */}

      <section className="shell grid gap-14 py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow">Comfort</p>

          <h2 className="mt-5 font-display text-4xl sm:text-5xl">
            Everything you need, already here.
          </h2>

          <Link
            to="/amenities"
            className="mt-8 inline-block border-b border-foreground/30 pb-1 text-sm"
          >
            See the full list
          </Link>
        </Reveal>

        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {Object.entries(amenityGroups)
            .slice(0, 4)
            .map(([category, items], i) => (
              <Reveal key={category} delay={i * 70}>
                <p className="eyebrow">{category}</p>

                <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {items.slice(0, 5).map((item) => (
                    <li key={item.name}>{item.name}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
        </div>
      </section>

      {/* =========================================================
          LOCATION
          ========================================================= */}

      <section className="bg-ink py-28 text-ink-foreground">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-ink-foreground/60">
              Getting here
            </p>

            <h2 className="mt-5 font-display text-4xl sm:text-5xl">
              Minutes from the runway, far from the noise.
            </h2>

            <p className="mt-6 text-ink-foreground/70">
              {info["airport_transport"]}
            </p>

            <Link
              to="/location"
              className="mt-8 inline-block border-b border-ink-foreground/40 pb-1 text-sm text-ink-foreground"
            >
              Directions and what's nearby
            </Link>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="divide-y divide-ink-foreground/12">
              {nearby.slice(0, 6).map((place, i) => (
                <Reveal
                  as="li"
                  key={place.name}
                  delay={i * 50}
                  className="flex justify-between gap-6 py-4"
                >
                  <div>
                    <p className="text-ink-foreground">
                      {place.name}
                    </p>

                    <p className="text-xs text-ink-foreground/50">
                      {place.category}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-sm text-ink-foreground/65">
                    {place.distance} · {place.travel_time}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================
          REVIEWS
          ========================================================= */}

      <section className="shell py-28">
        <Reveal>
          <p className="eyebrow">Guests</p>

          <h2 className="mt-5 max-w-2xl font-display text-4xl sm:text-5xl">
            "It felt like a different Bangalore altogether."
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal
              key={review.guest_name}
              delay={i * 90}
              className="flex flex-col border-t border-border pt-6"
            >
              <StarRating rating={review.rating} />

              <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {review.body}
              </p>

              <p className="mt-6 text-sm">
                {review.guest_name}
                <span className="text-muted-foreground">
                  {" "}
                  · {review.reviewed_on}
                </span>
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <Link
            to="/reviews"
            className="border-b border-foreground/30 pb-1 text-sm"
          >
            Read all reviews
          </Link>
        </Reveal>
      </section>

      {/* =========================================================
          MARKONI AI
          ========================================================= */}

      <section className="bg-secondary py-28">
        <div className="shell grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Markoni AI</p>

            <h2 className="mt-5 font-display text-4xl sm:text-5xl">
              An assistant that answers instantly, and knows when to hand
              over.
            </h2>
          </Reveal>

          <Reveal
            delay={120}
            className="space-y-5 text-muted-foreground"
          >
            <p>
              From the moment you book, Markoni AI handles the practical
              things: arrival instructions, Wi-Fi details, late-night
              questions, directions to breakfast. Most guests never notice it
              isn't a person.
            </p>

            <p>
              When something needs judgement — a changed flight, an extended
              stay, a favour — it brings in your hosts straight away.
            </p>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          FAQ
          ========================================================= */}

      <section className="shell py-28">
        <Reveal>
          <p className="eyebrow">Good to know</p>
        </Reveal>

        <dl className="mt-10 divide-y divide-border border-y border-border">
          {faqs.slice(0, 6).map((faq, i) => (
            <Reveal
              key={faq.question}
              delay={i * 50}
              className="grid gap-3 py-7 md:grid-cols-12"
            >
              <dt className="font-display text-xl md:col-span-5">
                {faq.question}
              </dt>

              <dd className="text-sm text-muted-foreground md:col-span-7">
                {faq.answer}
              </dd>
            </Reveal>
          ))}
        </dl>

        <Reveal className="mt-10">
          <Link
            to="/faq"
            className="border-b border-foreground/30 pb-1 text-sm"
          >
            All questions
          </Link>
        </Reveal>
      </section>

      {/* =========================================================
          FINAL CTA / BOTTOM PHOTO
          ========================================================= */}

      <section className="relative min-h-[500px] overflow-hidden">
        <img
          src={bottomImage}
          alt="Terrace at Markoni AI Stay"
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />

        <div className="absolute inset-0 bg-ink/70" />

        <div className="shell relative py-32 text-center text-ink-foreground">
          <h2 className="mx-auto max-w-2xl font-display text-4xl sm:text-6xl">
            Pick your dates. Stay as long as you like.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-ink-foreground/75">
            No fixed packages — one night or one month, the rate follows your
            stay.
          </p>

          <Link
            to="/book"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-clay px-8 py-4 text-sm font-medium text-clay-foreground"
          >
            Check availability
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}