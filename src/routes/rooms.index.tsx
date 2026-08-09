import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQuery } from "@/lib/queries";
import { RoomCard } from "@/components/site/RoomCard";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/rooms/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteContentQuery);
  },
  head: () => ({
    meta: [
      { title: "Rooms — Markoni AI Stay, Bangalore" },
      {
        name: "description",
        content: "Three private rooms with terrace access near Bangalore Airport, from ₹1,899 a night.",
      },
      { property: "og:title", content: "Rooms — Markoni AI Stay" },
      { property: "og:description", content: "Private rooms with terrace access near Bangalore Airport." },
      { property: "og:url", content: "/rooms" },
    ],
    links: [{ rel: "canonical", href: "/rooms" }],
  }),
  component: RoomsPage,
});

function RoomsPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  return (
    <div className="shell pb-24 pt-36">
      <Reveal>
        <p className="eyebrow">Accommodation</p>
        <h1 className="mt-5 max-w-2xl font-display text-5xl sm:text-6xl">Choose your room.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Every room is private, air-conditioned and has its own bathroom, with shared access to the terrace and
          garden.
        </p>
      </Reveal>
      <div className="mt-16 grid gap-14 md:grid-cols-2 lg:grid-cols-3">
        {data.rooms.map((room, i) => (
          <Reveal key={room.id} delay={i * 80}>
            <RoomCard room={room} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
