import arena from "@/assets/laser-arena.jpg";

export function LaserContentMagnet() {
  return (
    <section className="relative py-28 lg:py-40 border-t border-border bg-card overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-10 items-center">
          <div className="col-span-12 lg:col-span-5">
            <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
              ◆ 03 / Content Magnet
            </div>
            <h2 className="font-dot text-5xl md:text-7xl leading-[0.9]">
              Built for the
              <br />
              <span className="text-adrnln">camera.</span>
            </h2>
            <h3 className="mt-2 font-dot text-3xl md:text-4xl text-muted-foreground">
              Engineered for the experience.
            </h3>
            <p className="mt-6 max-w-md text-base text-muted-foreground leading-relaxed">
              UV-reactive surfaces, dynamic LED ground-effects, and sleek tactical aesthetics that
              compel players to record every session — turning your arena into an organic content
              engine.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-px bg-border max-w-sm">
              {[
                ["Reels / Session", "32"],
                ["Organic Reach", "+280%"],
                ["Repeat Visit", "2.6×"],
                ["UV Surfaces", "FULL"],
              ].map(([k, v]) => (
                <div key={k} className="bg-card p-4">
                  <div className="font-tech text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {k}
                  </div>
                  <div className="font-dot text-2xl mt-1 text-adrnln">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="relative border border-border overflow-hidden">
              <img
                src={arena}
                alt="Laser tag arena with UV-reactive walls and dynamic LED ground effects"
                loading="lazy"
                width={1920}
                height={1080}
                className="w-full h-[50vh] md:h-[64vh] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />
              <div className="absolute top-3 left-3 font-tech text-[10px] uppercase tracking-[0.25em] bg-background/70 border border-border px-2 py-1">
                ▶ LIVE — ARENA / DELTA
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between font-tech text-[10px] uppercase tracking-[0.25em]">
                <span className="text-adrnln">UV-REACTIVE / DMX-512</span>
                <span>03:42 / SESSION</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
