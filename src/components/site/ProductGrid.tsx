import { Link } from "@tanstack/react-router";
import heroKart from "@/assets/hero-kart.jpg";
import laser from "@/assets/tech-safety.jpg";
import skill from "@/assets/tech-cockpit.jpg";

const products = [
  {
    to: "/go-karts" as const,
    code: "P/01",
    title: "Go-Karts",
    blurb: "Advanced track telemetry, custom chassis manufacturing, fleet-grade reliability.",
    img: heroKart,
  },
  {
    to: "/laser-tag" as const,
    code: "P/02",
    title: "Laser Tag",
    blurb: "Tactical weapon ecosystems with recoil, smart hit-detection, and themed arena builds.",
    img: laser,
  },
  {
    to: "/skill-games" as const,
    code: "P/03",
    title: "Skill Games",
    blurb: "High-engagement interactive arcade modules built for retail-floor monetization.",
    img: skill,
  },
];

export function ProductGrid() {
  return (
    <section className="relative py-24 lg:py-32 border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-end justify-between gap-8 mb-12">
          <div>
            <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
              ◆ 01 / Product Sectors
            </div>
            <h2 className="font-dot text-5xl md:text-7xl leading-[0.9]">
              Three lines.
              <br />
              <span className="text-muted-foreground">One workshop.</span>
            </h2>
          </div>
          <p className="hidden lg:block max-w-sm text-sm text-muted-foreground leading-relaxed">
            Select a sector to step inside the engineering. Every line is built end-to-end in Kochi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
          {products.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="group relative bg-background hover-lift overflow-hidden block"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-card">
                {p.code === "P/02" ? (
                  <LaserBlueprint />
                ) : (
                  <>
                    <div className="absolute inset-0 dot-grid opacity-30" />
                    <img
                      src={p.img}
                      alt={p.title}
                      loading="lazy"
                      width={1024}
                      height={768}
                      className="absolute inset-0 w-full h-full object-cover mix-blend-screen group-hover:scale-105 transition-transform duration-700"
                    />
                  </>
                )}
                <div className="absolute top-3 left-3 font-tech text-[10px] uppercase tracking-[0.25em] text-adrnln z-10">
                  {p.code}
                </div>
                <div className="absolute top-3 right-3 font-tech text-[10px] uppercase tracking-[0.25em] text-muted-foreground z-10">
                  EXPLORE →
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-dot text-3xl">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.blurb}</p>
                <div className="mt-6 font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln group-hover:translate-x-1 transition-transform">
                  Enter Sector →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function LaserBlueprint() {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-white/40" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-white/40" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-white/40" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-white/40" />

      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 w-full h-full"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      >
        <line x1="200" y1="20" x2="200" y2="280" strokeDasharray="2 4" strokeOpacity="0.18" />
        <line x1="40" y1="150" x2="360" y2="150" strokeDasharray="2 4" strokeOpacity="0.18" />

        {/* VEST */}
        <g transform="translate(60,60)">
          <path d="M20 10 L60 0 L80 0 L120 10 L130 30 L120 35 L100 25 L80 28 L60 28 L40 25 L20 35 L10 30 Z" />
          <path d="M10 30 L10 150 L25 170 L115 170 L130 150 L130 30" />
          <line x1="70" y1="35" x2="70" y2="170" strokeOpacity="0.25" />
          <rect x="25" y="55" width="30" height="30" strokeOpacity="0.4" />
          <rect x="85" y="55" width="30" height="30" strokeOpacity="0.4" />
          <rect x="25" y="100" width="30" height="30" strokeOpacity="0.4" />
          <rect x="85" y="100" width="30" height="30" strokeOpacity="0.4" />
          <circle cx="70" cy="92" r="10" />
          <circle cx="70" cy="92" r="3" />
          <circle cx="70" cy="92" r="2.2" fill="#FF0055" stroke="none" />
          <line x1="130" y1="92" x2="160" y2="92" strokeOpacity="0.35" />
        </g>

        {/* PHASER */}
        <g transform="translate(225,95)">
          <rect x="0" y="20" width="110" height="18" />
          <rect x="110" y="24" width="14" height="10" />
          <rect x="20" y="12" width="60" height="8" strokeOpacity="0.4" />
          <path d="M30 38 L95 38 L100 70 L70 70 L60 95 L40 95 L35 70 L25 70 Z" />
          <line x1="45" y1="75" x2="55" y2="75" strokeOpacity="0.35" />
          <line x1="45" y1="82" x2="55" y2="82" strokeOpacity="0.35" />
          <path d="M55 60 q10 12 20 0" strokeOpacity="0.4" />
          <line x1="124" y1="29" x2="170" y2="29" stroke="#FF0055" strokeWidth="1.25" strokeOpacity="0.95" />
          <circle cx="124" cy="29" r="2" fill="#FF0055" stroke="none" />
        </g>

        <g stroke="#ffffff" strokeOpacity="0.3">
          <line x1="60" y1="245" x2="190" y2="245" />
          <line x1="60" y1="241" x2="60" y2="249" />
          <line x1="190" y1="241" x2="190" y2="249" />
        </g>
      </svg>

      <div className="absolute bottom-3 left-3 font-tech text-[9px] uppercase tracking-[0.25em] text-white/55">
        VEST-12Z · PHASER-R2
      </div>
      <div className="absolute bottom-3 right-3 font-tech text-[9px] uppercase tracking-[0.25em] text-white/55 flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 bg-[#FF0055]" />
        ARMED
      </div>
    </div>
  );
}
