import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/go-karts", label: "Go-Karts" },
  { to: "/laser-tag", label: "Laser Tag" },
  { to: "/skill-games", label: "Skill Games" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-14 flex items-center justify-between gap-6">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="inline-block w-2 h-2 bg-adrnln rounded-full" />
          <span className="font-dot text-2xl leading-none">ODIOS</span>
          <span className="font-tech text-[10px] text-muted-foreground border border-border px-1 ml-1 hidden sm:inline">
            RACING
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 font-tech text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-foreground" }}
              className="hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center font-tech text-[11px] uppercase tracking-[0.18em] bg-adrnln text-adrnln-foreground px-4 py-2 hover:opacity-90 transition-opacity min-h-[40px]"
          >
            Get a Quote
          </Link>

          {/* Hamburger — visible below lg */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-12 h-12 -mr-3 text-foreground"
          >
            <span className="relative block w-5 h-4">
              <span
                className={`absolute left-0 right-0 h-px bg-current transition-transform duration-300 ${
                  open ? "top-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 right-0 top-1/2 h-px bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 right-0 h-px bg-current transition-transform duration-300 ${
                  open ? "top-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Fullscreen mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 top-14 bg-white text-black transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full flex flex-col px-6 sm:px-8 py-8 overflow-y-auto">
          <div className="font-tech text-[10px] uppercase tracking-[0.4em] text-black/40 mb-6">
            // NAVIGATION
          </div>
          <nav className="flex flex-col divide-y divide-black/10 border-y border-black/10">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-black" }}
                className="font-sans font-bold text-3xl tracking-tight py-5 min-h-[56px] text-black flex items-center justify-between"
              >
                <span>{l.label}</span>
                <span className="font-tech text-[10px] text-black/40">→</span>
              </Link>
            ))}
          </nav>

          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex items-center justify-center font-tech text-xs uppercase tracking-[0.2em] bg-black text-white px-6 py-4 min-h-[52px]"
          >
            Get a Quote →
          </Link>

          <div className="mt-auto pt-10 font-tech text-[10px] uppercase tracking-[0.3em] text-black/40">
            ODIOS RACING · KOCHI / IND
          </div>
        </div>
      </div>
    </header>
  );
}
