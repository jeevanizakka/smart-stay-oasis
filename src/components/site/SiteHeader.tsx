import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/rooms", label: "Rooms" },
  { to: "/gallery", label: "Gallery" },
  { to: "/amenities", label: "Amenities" },
  { to: "/location", label: "Location" },
  { to: "/reviews", label: "Reviews" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-background/92 backdrop-blur-md shadow-soft" : "bg-transparent",
      )}
    >
      <div className="shell flex h-20 items-center justify-between gap-6">
        <Link to="/" className="group flex flex-col leading-none">
          <span className="font-display text-2xl tracking-tight text-foreground">Markoni</span>
          <span className="eyebrow mt-1 text-[0.6rem]">AI Stay · Bangalore</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative py-1 text-sm text-foreground/75 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/book"
            className="hidden rounded-full bg-clay px-6 py-2.5 text-sm font-medium text-clay-foreground transition-colors hover:bg-clay/90 sm:inline-flex"
          >
            Check availability
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="shell flex flex-col py-4">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="border-b border-border/60 py-3.5 text-base">
                {link.label}
              </Link>
            ))}
            <Link
              to="/book"
              className="mt-5 rounded-full bg-clay px-6 py-3 text-center text-sm font-medium text-clay-foreground"
            >
              Check availability
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
