import { Link } from "@tanstack/react-router";

export function AboutSummary() {
  return (
    <section id="about" className="relative py-28 lg:py-40 border-t border-border bg-card">
      <div className="absolute inset-0 dot-grid opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-10 items-end">
          <div className="col-span-12 lg:col-span-2 font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
            ◆ 02 / About
          </div>
          <div className="col-span-12 lg:col-span-10">
            <h2 className="font-dot text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
              We do reinvent
              <br />
              <span className="text-adrnln">the game.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-base lg:text-lg text-muted-foreground leading-relaxed">
              An end-to-end entertainment engineering firm founded by NIT Calicut alumni — specializing
              in high-performance recreational hardware built to accelerate future-tech across the Indian
              entertainment industry.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-3 border border-border px-5 py-3 font-tech text-[11px] uppercase tracking-[0.2em] hover:border-foreground transition"
            >
              Read the full brief →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
