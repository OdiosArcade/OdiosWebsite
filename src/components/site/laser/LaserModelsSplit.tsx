const columns = [
  {
    code: "M/01",
    title: "Sales & Support",
    body: "Total hardware asset control with dedicated technical assistance and genuine parts pipeline.",
    bullets: [
      ["TOTAL OWNERSHIP", "Outright purchase. Custom branded vests & phasers."],
      ["DEDICATED SUPPORT", "Named engineer. SLA-backed response."],
      ["GENUINE PARTS", "Direct factory pipeline. No third-party markups."],
    ],
  },
  {
    code: "M/02",
    title: "Turn-key Partnerships",
    tag: "Opening Offer",
    body: "Upfront-friendly structures, automatic upgrades, and integrated operations to maximize ticket sales.",
    bullets: [
      ["LOW UPFRONT", "Revenue-share model. ₹0 franchise fee for inaugural cohort."],
      ["AUTO-UPGRADES", "Hardware & firmware refreshed across the term."],
      ["MARKETING OPS", "Co-branded launch, bookings & event playbook."],
    ],
  },
];

export function LaserModelsSplit() {
  return (
    <section className="relative py-28 lg:py-40 border-t border-border bg-card">
      <div className="absolute inset-0 dot-grid opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
          ◆ 05 / Engagement Models
        </div>
        <h2 className="font-dot text-5xl md:text-7xl leading-[0.9] mb-16">
          Two ways to deploy
          <br />
          a tactical arena.
        </h2>

        <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
          {columns.map((c) => (
            <article key={c.code} className="bg-card p-8 md:p-12 relative">
              {c.tag && (
                <div className="absolute top-6 right-6 border border-adrnln px-3 py-1 font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
                  {c.tag}
                </div>
              )}
              <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {c.code}
              </div>
              <h3 className="mt-4 font-dot text-4xl md:text-5xl">{c.title}</h3>
              <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
                {c.body}
              </p>
              <ul className="mt-10 space-y-5">
                {c.bullets.map(([k, v]) => (
                  <li
                    key={k}
                    className="grid grid-cols-[180px_1fr] gap-4 border-t border-border pt-4"
                  >
                    <span className="font-tech text-[10px] uppercase tracking-[0.25em] text-adrnln pt-0.5">
                      {k}
                    </span>
                    <span className="text-sm text-muted-foreground">{v}</span>
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
