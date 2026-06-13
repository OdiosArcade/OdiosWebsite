import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer id="contact" className="relative pt-24 md:pt-28 lg:pt-36 pb-10 border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-10">
        {/* Senna quote */}
        <div className="grid grid-cols-12 gap-6 items-end mb-20">
          <div className="col-span-12 lg:col-span-2 font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
            ◆ / Origin
          </div>
          <blockquote className="col-span-12 lg:col-span-10">
            <p className="font-dot text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-[1.1]">
              “I started racing go-karts<span className="text-adrnln">.</span> It's the most
              breathtaking sport in the world.”
            </p>
            <footer className="mt-6 font-tech text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              — Ayrton Senna · 1960–1994
            </footer>
          </blockquote>
        </div>

        <div className="grid grid-cols-12 gap-10 border-t border-border pt-16">
          <div className="col-span-12 lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-adrnln rounded-full" />
              <span className="font-dot text-4xl">ODIOS</span>
              <span className="font-tech text-[10px] text-muted-foreground border border-border px-1.5 py-0.5">
                RACING
              </span>
            </div>
            <p className="mt-6 max-w-md text-muted-foreground">
              An entertainment engineering firm building the next generation of recreational
              hardware for India.
            </p>

            <div className="mt-10 inline-flex items-center gap-4 border border-border bg-card px-5 py-3">
              <span className="font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                IG / TT
              </span>
              <span className="font-dot text-2xl text-adrnln">@odiosofficial</span>
              <span className="blink text-adrnln">▮</span>
            </div>
          </div>

          <div className="col-span-6 lg:col-span-3">
            <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Sitemap
            </div>
            <ul className="space-y-2 font-tech text-xs uppercase tracking-[0.2em]">
              {[
                ["/", "Home"],
                ["/go-karts", "Go-Karts"],
                ["/laser-tag", "Laser Tag"],
                ["/skill-games", "Skill Games"],
                ["/about", "About"],
                ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 lg:col-span-4">
            <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Direct Line
            </div>
            <div className="font-dot text-2xl">Sabari Suresh</div>
            <a
              href="mailto:sabari@odios.in"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              sabari@odios.in
            </a>
            <div className="mt-4 font-dot text-2xl">Athul Krishna</div>
            <a
              href="mailto:athul@odios.in"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              athul@odios.in
            </a>
            <a
              href="mailto:sales@odios.in"
              className="block mt-4 font-tech text-xs uppercase tracking-[0.2em] text-adrnln"
            >
              sales@odios.in →
            </a>
          </div>
        </div>

        <div className="mt-20 pt-6 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>© {new Date().getFullYear()} ODIOS RACING / KOCHI · IND</span>
          <span>BUILD R-001 · LAST DEPLOY {new Date().toISOString().slice(0, 10)}</span>
          <span className="text-adrnln">ALL SYSTEMS NOMINAL ●</span>
        </div>
      </div>
    </footer>
  );
}
