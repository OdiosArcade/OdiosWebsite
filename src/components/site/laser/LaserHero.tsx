import laserHero from "@/assets/laser-hero.jpg";

export function LaserHero() {
  return (
    <section className="relative min-h-[92vh] pt-28 overflow-hidden border-b border-border">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="absolute inset-0 scanlines pointer-events-none" aria-hidden />

      {/* status bar */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10 font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-adrnln">●</span>
          <span>SYS / ODIOS-TACTICAL</span>
          <span className="hidden md:inline">UNIT: T-001</span>
          <span className="hidden md:inline">SIGNAL: 2.4GHZ MESH</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span>ARENA / READY</span>
          <span className="text-adrnln">LIVE FIRE</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10 pt-12 lg:pt-16 grid grid-cols-12 gap-8 items-end">
        <div className="col-span-12 lg:col-span-7">
          <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-6 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-adrnln" />
            Sector / Tactical Hardware
          </div>
          <h1 className="font-dot text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.88] tracking-tight">
            ODIOS TACTICAL:
            <br />
            <span className="text-adrnln text-glow-adrnln">IMMERSION</span>
            <br />
            ENGINEERED<span className="blink text-adrnln">_</span>
          </h1>
          <p className="mt-8 max-w-xl text-base lg:text-lg text-muted-foreground leading-relaxed">
            Next-generation arena hardware designed to blur the line between gaming and reality.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/contact"
              className="group inline-flex items-center gap-3 border border-foreground/70 px-7 py-4 font-tech text-[11px] uppercase tracking-[0.3em] rounded-full bg-foreground/[0.02] hover:bg-adrnln hover:border-adrnln hover:text-adrnln-foreground transition-all"
            >
              [ Request Demo ]
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="#hardware"
              className="inline-flex items-center gap-3 border border-border px-7 py-4 font-tech text-[11px] uppercase tracking-[0.3em] rounded-full hover:border-foreground transition-colors"
            >
              View Tech-Stack
            </a>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:pb-4">
          <div className="grid grid-cols-3 gap-px bg-border">
            {[
              { l: "ZONES / VEST", v: "12" },
              { l: "LATENCY", v: "<20MS" },
              { l: "BATT. LIFE", v: "8H" },
            ].map((s) => (
              <div key={s.l} className="bg-background p-5">
                <div className="font-tech text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                  {s.l}
                </div>
                <div className="font-dot text-3xl lg:text-4xl mt-2">{s.v}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 font-tech text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="text-adrnln">▣</span> Mesh synced — last ping 00:00:02 ago
          </div>
        </div>
      </div>

      {/* hero image */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10 mt-12 lg:mt-16">
        <div className="relative border border-border bg-card">
          <div className="absolute -top-3 left-4 bg-background px-3 font-tech text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Fig. 01 — Vest + Phaser / Studio
          </div>
          <div className="absolute -top-3 right-4 bg-background px-3 font-tech text-[10px] uppercase tracking-[0.25em] text-adrnln">
            Classified · NDA
          </div>
          <img
            src={laserHero}
            alt="Engineered laser tag vest and phaser silhouette under edge lighting"
            width={1920}
            height={1080}
            className="w-full h-[44vh] md:h-[60vh] object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between font-tech text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>HAPTIC / ACTIVE-RECOIL</span>
            <span className="hidden md:inline">CHASSIS / 6061-T6 ALU</span>
            <span className="text-adrnln">REV 0.2</span>
          </div>
        </div>
      </div>
    </section>
  );
}
