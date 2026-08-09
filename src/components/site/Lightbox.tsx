import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type LightboxImage = { url: string; alt: string | null };

export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onIndexChange]);

  if (!mounted || index === null) return null;
  const image = images[index];
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-100 flex flex-col bg-ink/97" role="dialog" aria-modal="true">
      <div className="flex items-center justify-between px-6 py-5 text-ink-foreground">
        <span className="eyebrow text-ink-foreground/60">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          aria-label="Close gallery"
          onClick={onClose}
          className="inline-flex size-11 items-center justify-center rounded-full border border-ink-foreground/20"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-10">
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
          className="mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-ink-foreground/20 text-ink-foreground"
        >
          <ChevronLeft className="size-5" />
        </button>
        <img
          src={image.url}
          alt={image.alt ?? ""}
          className="max-h-[78vh] w-auto max-w-[86vw] object-contain"
        />
        <button
          type="button"
          aria-label="Next image"
          onClick={() => onIndexChange((index + 1) % images.length)}
          className="ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-ink-foreground/20 text-ink-foreground"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {image.alt ? (
        <p className="px-6 pb-8 text-center text-sm text-ink-foreground/60">{image.alt}</p>
      ) : null}
    </div>
  );
}
