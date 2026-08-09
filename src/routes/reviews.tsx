import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQuery } from "@/lib/queries";
import { Reveal } from "@/components/site/Reveal";
import { StarRating } from "@/components/site/StarRating";

export const Route = createFileRoute("/reviews")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteContentQuery);
  },
  head: () => ({
    meta: [
      { title: "Guest reviews — Markoni AI Stay, Bangalore" },
      { name: "description", content: "What guests say about staying at Markoni AI Stay near Bangalore Airport." },
      { property: "og:title", content: "Guest reviews — Markoni AI Stay" },
      { property: "og:description", content: "Reviews from guests who stayed near Bangalore Airport." },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const average =
    data.reviews.length
      ? (data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length).toFixed(1)
      : "—";

  return (
    <div className="shell pb-24 pt-36">
      <Reveal>
        <p className="eyebrow">Guests</p>
        <h1 className="mt-5 font-display text-5xl sm:text-6xl">Reviews</h1>
        <p className="mt-5 text-muted-foreground">
          {average} average across {data.reviews.length} reviews.
        </p>
      </Reveal>

      <div className="mt-16 space-y-0 divide-y divide-border border-y border-border">
        {data.reviews.map((review, i) => (
          <Reveal key={review.guest_name} delay={i * 60} className="grid gap-6 py-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="font-display text-2xl">{review.guest_name}</p>
              <StarRating rating={review.rating} className="mt-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {review.stay_type} · {review.reviewed_on}
              </p>
            </div>
            <p className="text-muted-foreground md:col-span-8 md:col-start-5">{review.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
