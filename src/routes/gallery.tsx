import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox } from "@/components/site/Lightbox";

const galleryImages = [
  {
    url: "/images/01428f9a-3737-4f10-b34c-a88141dbd27f.avif",
    alt: "The Terrace Suite",
    category: "Rooms",
  },
  {
    url: "/images/0b0052d1-cc00-4c6c-a091-3bd553eff871.avif",
    alt: "The Terrace Suite",
    category: "Rooms",
  },
  {
    url: "/images/39d19606-9ca1-43bb-a576-b6dfde9f1436.avif",
    alt: "The Woodline Room",
    category: "Rooms",
  },
  {
    url: "/images/4208612c-7f1a-4eaa-8480-224966b6d790.avif",
    alt: "The property",
    category: "Property",
  },
  {
    url: "/images/8b27aca9-300c-428e-bf08-03427dca1629.avif",
    alt: "The Garden Room",
    category: "Rooms",
  },
  {
    url: "/images/97ff6722-fa53-466c-b64d-435b5767571b.avif",
    alt: "The Garden Room",
    category: "Rooms",
  },
  {
    url: "/images/9ab930b9-375d-4a2c-a94f-acc09081c5b5.avif",
    alt: "The Garden Room",
    category: "Rooms",
  },
  {
    url: "/images/9b33c36c-8226-413a-9088-6379172d2bf4.avif",
    alt: "The Woodline Room",
    category: "Rooms",
  },
  {
    url: "/images/c9384e1d-de27-4c9b-ab36-9ba7e039a328.avif",
    alt: "The Woodline Room",
    category: "Rooms",
  },
  {
    url: "/images/e11f5ef8-4f36-4ac6-8175-9f22e3c3663d.avif",
    alt: "The Woodline Room",
    category: "Rooms",
  },
  {
    url: "/images/ed322732-eb6b-4196-b1f4-006b4f61a707.avif",
    alt: "The property",
    category: "Property",
  },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Markoni AI Stay, Bangalore" },
      {
        name: "description",
        content:
          "Photographs of the rooms, terrace, garden and kitchen at Markoni AI Stay.",
      },
      {
        property: "og:title",
        content: "Gallery — Markoni AI Stay",
      },
      {
        property: "og:description",
        content:
          "Rooms, terrace, garden and kitchen, photographed as they are.",
      },
      {
        property: "og:url",
        content: "/gallery",
      },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<number | null>(null);

  const categories = [
    "All",
    ...Array.from(new Set(galleryImages.map((image) => image.category))),
  ];

  const images =
    filter === "All"
      ? galleryImages
      : galleryImages.filter((image) => image.category === filter);

  return (
    <div className="pb-24 pt-36">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">The property</p>

          <h1 className="mt-5 font-display text-5xl sm:text-6xl">
            Gallery
          </h1>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setFilter(category);
                setOpen(null);
              }}
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
            aria-label={image.alt}
          >
            <img
              src={image.url}
              alt={image.alt}
              loading="lazy"
              className="size-full object-cover"
            />
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        index={open}
        onClose={() => setOpen(null)}
        onIndexChange={setOpen}
      />
    </div>
  );
}