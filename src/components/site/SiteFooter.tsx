import { Link } from "@tanstack/react-router";

export function SiteFooter({ info }: { info: Record<string, string> }) {
  return (
    <footer className="mt-32 bg-ink text-ink-foreground">
      <div className="shell grid gap-12 py-20 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl">Markoni AI Stay</p>
          <p className="mt-4 max-w-sm text-sm text-ink-foreground/65">
            {info["property_tagline"] ?? "Your private stay, close to where your journey begins."}
          </p>
          <p className="mt-6 text-sm text-ink-foreground/65">{info["address"]}</p>
        </div>

        <div>
          <p className="eyebrow text-ink-foreground/50">Explore</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link to="/rooms" className="text-ink-foreground/75 hover:text-ink-foreground">
                Rooms
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="text-ink-foreground/75 hover:text-ink-foreground">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/amenities" className="text-ink-foreground/75 hover:text-ink-foreground">
                Amenities
              </Link>
            </li>
            <li>
              <Link to="/location" className="text-ink-foreground/75 hover:text-ink-foreground">
                Location
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-ink-foreground/75 hover:text-ink-foreground">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink-foreground/50">Stay in touch</p>
          <ul className="mt-5 space-y-2.5 text-sm text-ink-foreground/75">
            <li>{info["phone"]}</li>
            <li>{info["email"]}</li>
            <li>Host: {info["host_name"]}</li>
          </ul>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            <Link to="/book" className="text-clay hover:text-clay/80">
              Check availability
            </Link>
            <Link to="/my-booking" className="text-ink-foreground/75 hover:text-ink-foreground">
              Manage your booking
            </Link>
            <Link to="/contact" className="text-ink-foreground/75 hover:text-ink-foreground">
              Contact the hosts
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="shell flex flex-col justify-between gap-3 py-6 text-xs text-ink-foreground/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Markoni AI Stay, Tharabanahalli, Bangalore.</p>
          <p>Check-in after 1:00 pm · Checkout before 10:00 am</p>
        </div>
      </div>
    </footer>
  );
}
