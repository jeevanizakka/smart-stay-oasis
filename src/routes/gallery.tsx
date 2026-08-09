import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { siteContentQuery } from "@/lib/queries";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox } from "@/components/site/Lightbox";

export const Route = createFileRoute("/gallery")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteContentQuery);
  },
  head: () => ({
    meta: [
      { title: "Gallery — Markoni AI Stay, Bangalore" },
      { name: "description", content: "Photographs of the rooms, terrace, garden and kitchen at Markoni AI Stay." },
      { property: "og:title", content: "Gallery — Markoni AI Stay" },
      { property: "og:description", content: "Rooms, terrace, garden and kitchen, photographed as they are." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<number | null>(null);
  const categories = ["All", ...Array.from(new Set(data.gallery.map((image) => image.category)))];
  const images = filter === "All" ? data.gallery : data.gallery.filter((image) => image.category === filter);

  return (
    <div className="pb-24 pt-36">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">The property</p>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl">Gallery</h1>
        </Reveal>
        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={
                category === filter
                  ? "rounded-full bg-ink px-5 py-2 text-xs text-ink-foreground"
                  : "rounded-full border border-border px-5 py-2 text-xs text-muted-foreground hover:text-foreground"
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-3">
        {images.map((image, i) => (
          <button
            key={image.url}
            type="button"
            onClick={() => setOpen(i)}
            className="img-zoom aspect-4/3 bg-muted"
            aria-label={image.alt ?? "Open image"}
          >
            <img src={image.url} alt={image.alt ?? ""} loading="lazy" className="size-full object-cover" />
          </button>
        ))}
      </div>
      <Lightbox images={images} index={open} onClose={() => setOpen(null)} onIndexChange={setOpen} />
    </div>
  );
}
