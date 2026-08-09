import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQuery } from "@/lib/queries";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/location")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteContentQuery);
  },
  head: () => ({
    meta: [
      { title: "Location & airport — Markoni AI Stay, Tharabanahalli" },
      { name: "description", content: "How to reach Markoni AI Stay from Kempegowda International Airport, and what is nearby in Bangalore North." },
      { property: "og:title", content: "Location & airport — Markoni AI Stay" },
      { property: "og:description", content: "Directions from Bangalore Airport and what's nearby." },
      { property: "og:url", content: "/location" },
    ],
    links: [{ rel: "canonical", href: "/location" }],
  }),
  component: LocationPage,
});

function LocationPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const info = data.info;
  const mapQuery = encodeURIComponent(info["map_embed"] ?? "Tharabanahalli, Bengaluru");

  return (
    <div className="pb-24 pt-36">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Getting here</p>
          <h1 className="mt-5 max-w-2xl font-display text-5xl sm:text-6xl">
            Tharabanahalli, Bangalore North.
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground">{info["address"]}</p>
        </Reveal>

        <Reveal className="mt-14 grid gap-10 border-y border-border py-10 sm:grid-cols-3">
          <div>
            <p className="eyebrow">Nearest airport</p>
            <p className="mt-2 text-sm">{info["airport_name"]}</p>
          </div>
          <div>
            <p className="eyebrow">Distance</p>
            <p className="mt-2 text-sm">{info["airport_distance"]}</p>
          </div>
          <div>
            <p className="eyebrow">Driving time</p>
            <p className="mt-2 text-sm">{info["airport_drive_time"]}</p>
          </div>
        </Reveal>
      </div>

      <div className="shell mt-14">
        <div className="aspect-16/9 w-full overflow-hidden border border-border bg-muted">
          <iframe
            title="Map showing the location of Markoni AI Stay"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            loading="lazy"
            className="size-full"
          />
        </div>
      </div>

      <div className="shell mt-20 grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Travel</p>
          <h2 className="mt-4 font-display text-3xl">Arriving from the airport</h2>
          <p className="mt-4 text-sm text-muted-foreground">{info["airport_transport"]}</p>
          <p className="mt-4 text-sm text-muted-foreground">{info["late_arrival"]}</p>
        </Reveal>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow">Nearby</p>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {data.nearby.map((place) => (
              <li key={place.name} className="flex flex-wrap justify-between gap-4 py-5">
                <div className="max-w-sm">
                  <p className="text-sm">{place.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{place.description}</p>
                </div>
                <p className="whitespace-nowrap text-sm text-muted-foreground">
                  {place.distance} · {place.travel_time}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
