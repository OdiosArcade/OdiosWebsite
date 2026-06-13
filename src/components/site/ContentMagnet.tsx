import c1 from "@/assets/content-1.jpg";
import c2 from "@/assets/content-2.jpg";
import c3 from "@/assets/content-3.jpg";
import c4 from "@/assets/content-4.jpg";

const reels = [
  { img: c1, tag: "GLOW LAP", views: "2.4M" },
  { img: c2, tag: "DRIFT / NIGHT", views: "1.1M" },
  { img: c3, tag: "GROUND-FX", views: "3.8M" },
  { img: c4, tag: "VISOR POV", views: "986K" },
];

export function ContentMagnet() {
  return (
    <section id="content" className="relative py-28 lg:py-40 border-t border-border bg-card">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-10 items-center">
          <div className="col-span-12 lg:col-span-5">
            <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
              ◆ 03 / Doctrine
            </div>
            <h2 className="font-dot text-5xl md:text-7xl leading-[0.9]">
              Engineered
              <br />
              to <span className="text-adrnln">market.</span>
            </h2>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-md">
              Our karts are built to be <span className="text-foreground">content magnets</span> —
              machines so visually loud they drive organic word-of-mouth on every lap.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-px bg-border max-w-sm">
              {[
                ["Avg. Reels / Session", "47"],
                ["Organic CTR Lift", "+312%"],
                ["Repeat Visit Rate", "2.8×"],
                ["UGC Hours / Mo.", "180+"],
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {reels.map((r, i) => (
                <div
                  key={r.tag}
                  className={`group relative aspect-[9/16] overflow-hidden border border-border ${i % 2 === 1 ? "md:translate-y-8" : ""}`}
                >
                  <img
                    src={r.img}
                    alt={r.tag}
                    loading="lazy"
                    width={576}
                    height={1024}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                  <div className="absolute top-2 left-2 font-tech text-[9px] uppercase tracking-[0.2em] bg-background/70 px-1.5 py-0.5 border border-border">
                    {r.tag}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-tech text-[10px] uppercase tracking-[0.2em]">
                    <span className="text-adrnln">▶ LIVE</span>
                    <span className="text-foreground">{r.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
