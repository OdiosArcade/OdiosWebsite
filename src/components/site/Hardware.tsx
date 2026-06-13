import safety from "@/assets/tech-safety.jpg";
import timing from "@/assets/tech-timing.jpg";
import cockpit from "@/assets/tech-cockpit.jpg";

const items = [
  {
    code: "H/01",
    name: "Wireless Safety Switch",
    feature: "Instant engine deactivation",
    desc: "A single command kills the powertrain in under 40ms. Sub-GHz mesh, redundant receivers, fail-secure logic.",
    img: safety,
    specs: [
      ["Latency", "<40 MS"],
      ["Range", "1.2 KM"],
      ["Channels", "16"],
    ],
  },
  {
    code: "H/02",
    name: "Lap Timing System",
    feature: "Millisecond-accurate tracking",
    desc: "Active transponders synchronised to a 1 kHz beacon. Sector splits, predictive lap, broadcast feed — out of the box.",
    img: timing,
    specs: [
      ["Resolution", "1 MS"],
      ["Drift", "±0.3 ppm"],
      ["Output", "RTSP / API"],
    ],
  },
  {
    code: "H/03",
    name: "Precision Digital Cockpit",
    feature: "Real-time performance metrics",
    desc: "Sunlight-readable display, dot-matrix HUD, configurable telemetry channels. Built for drivers, not dashboards.",
    img: cockpit,
    specs: [
      ["Refresh", "120 HZ"],
      ["Channels", "32"],
      ["IP", "RATED 67"],
    ],
  },
];

export function Hardware() {
  return (
    <section id="hardware" className="relative py-28 lg:py-40 border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-end justify-between gap-8 mb-16">
          <div>
            <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
              ◆ 02 / Hardware Atlas
            </div>
            <h2 className="font-dot text-5xl md:text-7xl leading-[0.9]">
              The Internals,
              <br />
              <span className="text-muted-foreground">on display.</span>
            </h2>
          </div>
          <p className="hidden lg:block max-w-sm text-sm text-muted-foreground leading-relaxed">
            Three engineered subsystems, each designed to outperform the imported standard. Hover
            any unit to expose its anatomy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-border">
          {items.map((it) => (
            <article
              key={it.code}
              className="group relative bg-background hover-lift border-0 overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-card">
                <div className="absolute inset-0 dot-grid opacity-30" />
                <img
                  src={it.img}
                  alt={`${it.name} x-ray view`}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-screen group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 font-tech text-[10px] uppercase tracking-[0.25em] text-adrnln">
                  {it.code}
                </div>
                <div className="absolute top-3 right-3 font-tech text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  X-RAY
                </div>
              </div>
              <div className="p-6">
                <div className="font-tech text-[10px] uppercase tracking-[0.25em] text-adrnln">
                  {it.feature}
                </div>
                <h3 className="mt-2 font-dot text-3xl">{it.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                <dl className="mt-6 grid grid-cols-3 gap-px bg-border border border-border">
                  {it.specs.map(([k, v]) => (
                    <div key={k} className="bg-background p-3">
                      <dt className="font-tech text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                        {k}
                      </dt>
                      <dd className="font-dot text-xl mt-1">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
