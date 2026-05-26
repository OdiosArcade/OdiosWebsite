import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/go-karts", label: "Go-Karts" },
  { to: "/laser-tag", label: "Laser Tag" },
  { to: "/skill-games", label: "Skill Games" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-14 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
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
        <Link
          to="/contact"
          className="font-tech text-[11px] uppercase tracking-[0.18em] bg-adrnln text-adrnln-foreground px-4 py-2 hover:opacity-90 transition-opacity shrink-0"
        >
          Get a Quote
        </Link>
      </div>
    </header>
  );
}
