export type Model = { code: string; title: string; tag?: string; body: string; bullets: [string, string][] };

const defaultModels: Model[] = [
  {
    code: "M/01",
    title: "Rentals",
    body: "Flexible per-day or monthly leasing. We keep the fleet at peak — you keep the revenue.",
    bullets: [
      ["ZERO-STRESS UPKEEP", "100% maintenance, repairs & technical tuning."],
      ["CONTINUOUS UPGRADES", "Hardware and software refreshed across the lease term."],
      ["FLEET TELEMETRY", "Live dashboard, leaderboard & utilization analytics."],
    ],
  },
  {
    code: "M/02",
    title: "Sales",
    body: "Total asset ownership and full fleet control with dedicated after-sales engineering support.",
    bullets: [
      ["TOTAL OWNERSHIP", "Outright purchase, custom venue branding."],
      ["FACTORY ACCESS", "Direct parts pipeline, no third-party markups."],
      ["MFG. SUPPORT", "Dedicated after-sales manufacturing engineer."],
    ],
  },
  {
    code: "M/03",
    title: "Franchising",
    tag: "Opening Offer",
    body: "Inaugural Offer: ₹0 Franchise Fee. Pay-as-you-earn royalty with a complete turnkey playbook.",
    bullets: [
      ["₹0 FRANCHISE FEE", "Waived for the first cohort. Ends Q3 2026."],
      ["TURNKEY SOLUTION", "Marketing, fleet ops & site layout design included."],
      ["REV-SHARE", "Transparent royalty, no hidden lock-ins."],
    ],
  },
  {
    code: "M/04",
    title: "Partnerships",
    body: "Shared investment layout with revenue sharing based on space contribution.",
    bullets: [
      ["SHARED INVESTMENT", "Revenue share tied to space contribution."],
      ["TECH INTEGRATION", "Full hardware + software stack deployed by us."],
      ["FOOT-TRAFFIC ENGINE", "Direct promotional support to drive volume."],
    ],
  },
];

export function BusinessModels({ models = defaultModels, sectionNumber = "05" }: { models?: Model[]; sectionNumber?: string }) {
  return (
    <section id="business" className="relative py-24 md:py-28 lg:py-40 border-t border-border bg-card">
      <div className="absolute inset-0 dot-grid opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-8 lg:px-10">
        <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
          ◆ {sectionNumber} / Engagement Models
        </div>
        <h2 className="font-dot text-4xl sm:text-5xl md:text-7xl leading-[0.9] mb-12 md:mb-16">
          Four ways to put
          <br />
          us on track.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-border border border-border">
          {models.map((m) => (
            <article key={m.code} className="bg-card p-8 md:p-10 relative flex flex-col">
              {m.tag && (
                <div className="absolute top-6 right-6 border border-adrnln px-3 py-1 font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
                  {m.tag}
                </div>
              )}
              <div className="flex items-center justify-between font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span>{m.code}</span>
              </div>
              <h3 className="mt-6 font-dot text-4xl">{m.title}</h3>
              <p className="mt-4 text-sm text-muted-foreground">{m.body}</p>
              <ul className="mt-8 space-y-4">
                {m.bullets.map(([k, v]) => (
                  <li key={k} className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
                    <span className="font-tech text-[10px] uppercase tracking-[0.25em] text-adrnln pt-0.5">{k}</span>
                    <span className="text-xs text-muted-foreground">{v}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
