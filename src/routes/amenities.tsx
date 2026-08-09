import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQuery } from "@/lib/queries";
import { Reveal } from "@/components/site/Reveal";
import { groupBy, formatINR } from "@/lib/format";

export const Route = createFileRoute("/amenities")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteContentQuery);
  },
  head: () => ({
    meta: [
      { title: "Amenities & inclusions — Markoni AI Stay" },
      { name: "description", content: "Wi-Fi, air conditioning, hot water, kitchenette, terrace, free parking and self check-in — everything included in a stay." },
      { property: "og:title", content: "Amenities & inclusions — Markoni AI Stay" },
      { property: "og:description", content: "Everything included in a stay, plus optional services." },
      { property: "og:url", content: "/amenities" },
    ],
    links: [{ rel: "canonical", href: "/amenities" }],
  }),
  component: AmenitiesPage,
});

function AmenitiesPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const available = groupBy(data.amenities.filter((a) => a.is_available), (a) => a.category);
  const unavailable = data.amenities.filter((a) => !a.is_available);
  const inclusions = groupBy(data.inclusions, (i) => i.category);

  return (
    <div className="shell pb-24 pt-36">
      <Reveal>
        <p className="eyebrow">Comfort</p>
        <h1 className="mt-5 max-w-2xl font-display text-5xl sm:text-6xl">Amenities and inclusions.</h1>
      </Reveal>

      <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(available).map(([category, items], i) => (
          <Reveal key={category} delay={i * 60}>
            <p className="eyebrow">{category}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              {items.map((item) => (
                <li key={item.name}>{item.name}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      {unavailable.length ? (
        <Reveal className="mt-16 border-t border-border pt-8">
          <p className="eyebrow">Not available</p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
            {unavailable.map((item) => (
              <li key={item.name}>{item.name}</li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      <Reveal className="mt-24">
        <p className="eyebrow">Included in every stay</p>
        <div className="mt-8 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(inclusions).map(([category, items]) => (
            <div key={category}>
              <p className="font-display text-2xl">{category}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                {items.map((item) => (
                  <li key={item.item}>{item.item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-24">
        <p className="eyebrow">Optional services</p>
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {data.addons.map((addon) => (
            <li key={addon.id} className="flex flex-wrap justify-between gap-4 py-6">
              <div className="max-w-lg">
                <p className="font-display text-xl">{addon.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{addon.description}</p>
              </div>
              <p className="text-sm">{formatINR(addon.price)}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-24">
        <p className="eyebrow">House rules</p>
        <dl className="mt-8 divide-y divide-border border-y border-border">
          {data.houseRules.map((rule) => (
            <div key={rule.label} className="grid gap-2 py-5 md:grid-cols-12">
              <dt className="text-sm md:col-span-4">{rule.label}</dt>
              <dd className="text-sm text-muted-foreground md:col-span-8">{rule.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
