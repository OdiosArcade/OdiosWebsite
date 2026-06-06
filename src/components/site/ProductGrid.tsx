import { Link } from "@tanstack/react-router";
import heroKart from "@/assets/hero-kart.jpg";
import laser from "@/assets/laser-phaser-render.jpg";
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
                  <LaserRender src={p.img} alt={p.title} />
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
                <div className="absolute top-3 left-3 font-tech text-[10px] uppercase tracking-[0.25em] text-[#FF0055] z-20">
                  {p.code}
                </div>
                <div className="absolute top-3 right-3 font-tech text-[10px] uppercase tracking-[0.25em] text-neutral-400 opacity-80 hover:opacity-100 transition-opacity z-20">
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

function LaserRender({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* micro-dot matrix */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      {/* overhead spotlight wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.10), transparent 70%)",
        }}
      />

      {/* product render */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={1024}
        height={1024}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
      />

      {/* red ground underglow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[6%] w-[55%] h-6 pointer-events-none"
        style={{
          background: "#FF0055",
          filter: "blur(28px)",
          opacity: 0.85,
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[4%] w-[35%] h-2 pointer-events-none"
        style={{
          background: "#FF0055",
          filter: "blur(10px)",
        }}
      />

      {/* corner ticks */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-white/30" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-white/30" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-white/30" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-white/30" />
    </div>
  );
}
