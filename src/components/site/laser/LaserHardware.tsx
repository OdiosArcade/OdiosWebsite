import phaser from "@/assets/laser-phaser.jpg";
import vest from "@/assets/laser-vest.jpg";
import hub from "@/assets/laser-hub.jpg";

const stack = [
  {
    code: "H/01",
    title: "Phaser Unit",
    img: phaser,
    body: "Precision optics, aluminum-reinforced chassis, and millisecond haptic feedback response.",
    specs: [
      ["OPTICS", "PRECISION"],
      ["CHASSIS", "6061 ALU"],
      ["HAPTIC", "<5MS"],
    ],
  },
  {
    code: "H/02",
    title: "Tactical Vest & Sensors",
    img: vest,
    body: "Advanced multi-zone hit detection with real-time vibrational telemetry per sensor.",
    specs: [
      ["ZONES", "12 / VEST"],
      ["TELEMETRY", "REALTIME"],
      ["WEIGHT", "1.4 KG"],
    ],
  },
  {
    code: "H/03",
    title: "Master Control Hub",
    img: hub,
    body: "Seamless wireless arena synchronization for automated game management and player tracking.",
    specs: [
      ["MESH", "2.4 GHZ"],
      ["CAP.", "64 PLAYERS"],
      ["SYNC", "AUTOMATED"],
    ],
  },
];

export function LaserHardware() {
  return (
    <section id="hardware" className="relative py-28 lg:py-40 border-t border-border">
      <div className="absolute inset-0 dot-grid opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
          ◆ 02 / Hardware Spotlight
        </div>
        <h2 className="font-dot text-5xl md:text-7xl leading-[0.9] mb-4">
          The tech-stack,
          <br />
          <span className="text-muted-foreground">stripped to the metal.</span>
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground mb-16">
          Three engineered components. One synchronized arena.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {stack.map((c) => (
            <article key={c.code} className="group relative glass p-6 hover-lift transition-all">
              {/* HUD corner brackets */}
              <span className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t border-l border-adrnln opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t border-r border-adrnln opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b border-l border-adrnln opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b border-r border-adrnln opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="text-adrnln">{c.code}</span>
                <span>UNIT / ACTIVE</span>
              </div>

              <div className="relative mt-4 aspect-square overflow-hidden bg-black">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>

              <h3 className="mt-6 font-dot text-3xl">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.body}</p>

              <dl className="mt-6 grid grid-cols-3 gap-px bg-border border border-border">
                {c.specs.map(([k, v]) => (
                  <div key={k} className="bg-background p-3">
                    <dt className="font-tech text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="font-dot text-lg mt-1">{v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
