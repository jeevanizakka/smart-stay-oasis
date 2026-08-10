import { Link } from "@tanstack/react-router";
import { formatINR } from "@/lib/format";
import type { Room } from "@/lib/content.functions";

const roomImages: Record<string, string> = {
  "The Terrace Suite":
    "/images/01428f9a-3737-4f10-b34c-a88141dbd27f.avif",

  "The Garden Room":
    "/images/0b0052d1-cc00-4c6c-a091-3bd553eff871.avif",

  "The Woodline Room":
    "/images/39d19606-9ca1-43bb-a576-b6dfde9f1436.avif",
};

export function RoomCard({ room }: { room: Room }) {
  const imageUrl =
    roomImages[room.name] ??
    room.hero_image ??
    room.images[0]?.url ??
    "";

  return (
    <article>
      <Link
        to="/rooms/$slug"
        params={{ slug: room.slug }}
        className="img-zoom block aspect-4/5 w-full bg-muted"
        aria-label={room.name}
      >
        <img
          src={imageUrl}
          alt={room.name}
          loading="lazy"
          className="size-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl">{room.name}</h3>

          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatINR(room.price_per_night)}{" "}
            <span className="text-xs">/ night</span>
          </span>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {room.tagline}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
          <div>
            <dt className="eyebrow text-[0.6rem]">Sleeps</dt>
            <dd className="mt-1 text-foreground">
              {room.max_guests} guests
            </dd>
          </div>

          <div>
            <dt className="eyebrow text-[0.6rem]">Bed</dt>
            <dd className="mt-1 text-foreground">
              {room.bed_type}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center gap-5 pt-1">
          <Link
            to="/rooms/$slug"
            params={{ slug: room.slug }}
            className="border-b border-foreground/30 pb-1 text-sm transition-colors hover:border-foreground"
          >
            View room
          </Link>

          <Link
            to="/book"
            search={{ room: room.slug }}
            className="border-b border-clay/40 pb-1 text-sm text-clay transition-colors hover:border-clay"
          >
            Book this room
          </Link>
        </div>
      </div>
    </article>
  );
}
