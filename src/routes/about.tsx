import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Odios Racing" },
      {
        name: "description",
        content:
          "An end-to-end entertainment engineering firm founded by NIT Calicut alumni. We build high-performance recreational hardware.",
      },
      { property: "og:title", content: "About — Odios Racing" },
      {
        property: "og:description",
        content:
          "Engineering-led entertainment company building the next generation of recreational hardware in India.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <PageHeader eyebrow="Page / About" title="WE DO REINVENT" accent="THE GAME." />

      <section className="relative py-24 lg:py-32 border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-3 font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
            ◆ 01 / Brief
          </div>
          <div className="col-span-12 lg:col-span-9 space-y-6 text-base lg:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            <p>
              Odios is an end-to-end entertainment engineering firm founded by{" "}
              <span className="text-foreground">NIT Calicut alumni</span>, specializing in
              high-performance recreational hardware built to accelerate future-tech across the
              Indian entertainment industry.
            </p>
            <p>
              We design, manufacture, integrate and operate. Karts, laser tag ecosystems, and skill
              cabinets — every line is engineered in our Kochi workshop, instrumented with our own
              telemetry, and shipped with a service contract that doesn't disappear after delivery.
            </p>
            <p>
              The brief is simple.{" "}
              <span className="text-foreground">Whatever the need, we build it.</span>
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-24 lg:py-32 border-t border-border bg-card">
        <div className="absolute inset-0 dot-grid opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
            ◆ 02 / Capability Stack
          </div>
          <h2 className="font-dot text-4xl md:text-6xl leading-[0.95] mb-12">
            End-to-end. <span className="text-muted-foreground">Literally.</span>
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-px bg-border border border-border">
            {[
              ["MECHANICAL", "Chassis, recoil mechanisms, cabinet fabrication."],
              ["ELECTRONICS", "Custom PCBs, sensor stacks, mesh networking."],
              ["SOFTWARE", "Telemetry, leaderboards, venue dashboards."],
              ["OPERATIONS", "Service contracts, fleet rotation, training."],
            ].map(([k, v]) => (
              <div key={k} className="bg-card p-6">
                <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
                  {k}
                </div>
                <div className="mt-3 font-dot text-xl leading-tight">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
