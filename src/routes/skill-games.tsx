import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PageHeader } from "@/components/site/PageHeader";
import { BusinessModels, type Model } from "@/components/site/BusinessModels";

const profiles = [
  {
    code: "S/01",
    title: "Knife Drop",
    body: "Precision reaction-time drop game. Player times their release to land the blade on target.",
    specs: [
      ["MODE", "REACTION"],
      ["FOOTPRINT", "1.2 × 0.8 M"],
      ["TICKETS", "YES"],
    ],
  },
  {
    code: "S/02",
    title: "Punching Striker",
    body: "High-impact carnival power module. Force sensor + LED tower + leaderboard mode.",
    specs: [
      ["SENSOR", "PIEZO"],
      ["RANGE", "0–1200 KGF"],
      ["MODES", "3"],
    ],
  },
  {
    code: "S/03",
    title: "Hammer Striker",
    body: "Classic strength entertainment reimagined with modern sensors and live broadcast scoring.",
    specs: [
      ["SENSOR", "LOAD-CELL"],
      ["HEIGHT", "2.4 M"],
      ["MODES", "2"],
    ],
  },
];

const skillModels: Model[] = [
  {
    code: "M/01",
    title: "Rentals",
    body: "Lease cabinets by the month. Rotated, serviced, and re-themed quarterly.",
    bullets: [
      ["ZERO-STRESS UPKEEP", "All servicing & restocking handled."],
      ["ROTATION", "New profiles swapped in each quarter."],
      ["REPORTING", "Daily revenue + uptime reports."],
    ],
  },
  {
    code: "M/02",
    title: "Sales",
    body: "Own the cabinets outright. Custom paint, custom IP, direct parts.",
    bullets: [
      ["TOTAL OWNERSHIP", "Your branding, your venue."],
      ["FACTORY ACCESS", "Direct spares, low downtime."],
      ["MFG. SUPPORT", "Dedicated after-sales engineer."],
    ],
  },
  {
    code: "M/03",
    title: "Franchising",
    tag: "Opening Offer",
    body: "₹0 Franchise Fee inaugural offer. Turnkey skill-arcade with playbook and ops.",
    bullets: [
      ["₹0 FRANCHISE FEE", "First cohort only — ends Q3 2026."],
      ["TURNKEY ARCADE", "Layout, install, staff training."],
      ["REV-SHARE", "Transparent monthly royalty."],
    ],
  },
  {
    code: "M/04",
    title: "Partnerships",
    body: "Drop a curated set into your mall or FEC. We split revenue based on floor space.",
    bullets: [
      ["SHARED INVESTMENT", "Revenue split tied to space."],
      ["TECH INTEGRATION", "Payments, tickets, leaderboard."],
      ["FOOT-TRAFFIC ENGINE", "Co-marketed launch events."],
    ],
  },
];

export const Route = createFileRoute("/skill-games")({
  component: SkillGamesPage,
  head: () => ({
    meta: [
      { title: "Skill-Based Games — Odios Racing" },
      {
        name: "description",
        content:
          "Interactive skill games built for high-traffic monetization. Knife Drop, Punching & Hammer Strikers.",
      },
      { property: "og:title", content: "Skill Games — Built for High-Traffic Monetization" },
      {
        property: "og:description",
        content: "Arcade-grade hardware engineered for malls, FECs and retail entertainment centers.",
      },
    ],
  }),
});

function SkillGamesPage() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <PageHeader
        eyebrow="Sector / Skill Games"
        title="BUILT FOR HIGH-TRAFFIC"
        accent="MONETIZATION."
        subtitle="Cabinets engineered for the floor. High-engagement skill mechanics, modern sensors, ticketing-ready."
      />

      <section className="relative py-28 lg:py-36 border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
            ◆ 02 / Product Fleet
          </div>
          <h2 className="font-dot text-5xl md:text-7xl leading-[0.9] mb-16">
            Current
            <br />
            <span className="text-muted-foreground">engineering profiles.</span>
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-px bg-border border border-border">
            {profiles.map((p) => (
              <article key={p.code} className="bg-background p-8">
                <div className="font-tech text-[10px] uppercase tracking-[0.25em] text-adrnln">{p.code}</div>
                <h3 className="mt-2 font-dot text-3xl">{p.title}</h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                <dl className="mt-6 grid grid-cols-3 gap-px bg-border border border-border">
                  {p.specs.map(([k, v]) => (
                    <div key={k} className="bg-background p-3">
                      <dt className="font-tech text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{k}</dt>
                      <dd className="font-dot text-lg mt-1">{v}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
            <article className="bg-card p-8 flex flex-col justify-center items-start border-dashed">
              <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln blink">● IN DEV</div>
              <div className="mt-4 font-dot text-2xl text-muted-foreground leading-tight">
                More engineering profiles coming soon.
              </div>
              <div className="mt-6 font-tech text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Have a custom brief?{" "}
                <a href="/contact" className="text-adrnln">
                  Open a channel →
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <BusinessModels models={skillModels} sectionNumber="03" />
      <Footer />
    </main>
  );
}
