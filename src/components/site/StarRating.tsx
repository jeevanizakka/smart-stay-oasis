import { Star } from "lucide-react";

export function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={className} aria-label={`${rating} out of 5`}>
      <div className="flex gap-0.5 text-clay">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-3.5" fill={i < rating ? "currentColor" : "none"} strokeWidth={1.5} />
        ))}
      </div>
    </div>
  );
}
