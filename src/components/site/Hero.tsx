import { Link } from "@tanstack/react-router";
import heroKart from "@/assets/hero-kart.jpg";

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen pt-14 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" aria-hidden />
      <div className="absolute inset-0 scanlines pointer-events-none" aria-hidden />

      <div className="relative z-10 border-b border-border/60">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-10 h-9 flex items-center justify-between font-tech text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="text-adrnln">●</span>
            <span>SYS / ODIOS-RACING</span>
            <span className="hidden md:inline">UNIT: R-001</span>
            <span className="hidden md:inline">STATUS: ONLINE</span>
          </div>
          <div className="flex items-center gap-4">
            <span>LAT 9.9312° N</span>
            <span className="hidden md:inline">LON 76.2673° E</span>
            <span>KOCHI / IND</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-8 lg:px-10 pt-12 md:pt-16 lg:pt-24">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-8">
            <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-6 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-adrnln" />
              Entertainment Engineering / 2026
            </div>
            <h1 className="font-dot text-[clamp(2.75rem,8.5vw,8.5rem)] leading-[0.88] tracking-tight">
              WE BUILD CUSTOM
              <br />
              <span className="text-adrnln text-glow-adrnln">ENTERTAINMENT</span>
              <br />
              &amp; SPORTING GEAR<span className="blink text-adrnln">_</span>
            </h1>
            <p className="mt-8 max-w-xl font-dot text-2xl lg:text-3xl text-muted-foreground leading-snug">
              Whatever the need, <span className="text-foreground">we build it.</span>
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to="/go-karts"
                className="group inline-flex items-center gap-3 bg-adrnln text-adrnln-foreground px-6 py-4 min-h-[52px] font-tech text-xs uppercase tracking-[0.2em] hover:opacity-90 transition"
              >
                Enter The Pit Lane
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 border border-border px-6 py-4 min-h-[52px] font-tech text-xs uppercase tracking-[0.2em] hover:border-foreground transition"
              >
                Get a Quote
              </Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:pb-2">
            <div className="grid grid-cols-3 gap-px bg-border">
              {[
                { l: "SECTORS", v: "03" },
                { l: "TELEMETRY", v: "1KHz" },
                { l: "FRANCHISE", v: "₹0" },
              ].map((s) => (
                <div key={s.l} className="bg-background p-3 sm:p-4 md:p-5">
                  <div className="font-tech text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-muted-foreground">
                    {s.l}
                  </div>
                  <div className="font-dot text-2xl sm:text-3xl md:text-4xl mt-2">{s.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 font-tech text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span className="text-adrnln">▣</span> Live spec — last sync 00:00:14 ago
            </div>
          </div>
        </div>

        <div className="relative mt-14 lg:mt-20 border border-border bg-card">
          <div className="absolute -top-3 left-4 bg-background px-3 font-tech text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Fig. 01 — Chassis R-001 / Top View
          </div>
          <div className="absolute -top-3 right-4 bg-background px-3 font-tech text-[10px] uppercase tracking-[0.25em] text-adrnln">
            Classified · NDA
          </div>
          <img
            src={heroKart}
            alt="Custom-engineered Odios kart photographed top-down in a foggy studio"
            width={1920}
            height={1280}
            className="w-full h-[42vh] md:h-[58vh] object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between font-tech text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>WHEELBASE 1080MM · TRACK 1240MM</span>
            <span className="hidden md:inline">CHASSIS / 4130 CHROMOLY</span>
            <span className="text-adrnln">REV 0.3</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-16 border-y border-border overflow-hidden bg-background">
        <div className="flex marquee-track whitespace-nowrap py-4 font-dot text-xl md:text-3xl">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 pr-10 shrink-0">
              {[
                "PRECISION",
                "VELOCITY",
                "SAFETY",
                "TELEMETRY",
                "SPECTACLE",
                "CRAFT",
                "INDIA / 2026",
              ].map((w) => (
                <span key={w} className="flex items-center gap-10">
                  {w}
                  <span className="text-adrnln">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
