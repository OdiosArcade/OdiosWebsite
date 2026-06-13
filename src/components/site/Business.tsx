export function Business() {
  return (
    <section id="business" className="relative py-28 lg:py-40 border-t border-border bg-card">
      <div className="absolute inset-0 dot-grid opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
          ◆ 05 / Engagement Models
        </div>
        <h2 className="font-dot text-5xl md:text-7xl leading-[0.9] mb-16">
          Two ways to put
          <br />
          us on track.
        </h2>

        <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
          <article className="bg-card p-8 md:p-12">
            <div className="flex items-center justify-between font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span>MODEL A</span>
              <span className="text-adrnln">● ACTIVE</span>
            </div>
            <h3 className="mt-6 font-dot text-4xl md:text-5xl">Sales &amp; Rentals</h3>
            <p className="mt-4 text-muted-foreground max-w-md">
              For operators that want machines on their own track — backed by an engineering team
              that doesn't disappear after delivery.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                [
                  "ZERO-STRESS UPKEEP",
                  "Annual service contracts, on-site spares, telemetry-driven maintenance.",
                ],
                [
                  "TOTAL OWNERSHIP",
                  "Outright purchase or 36-mo lease. Your asset, your branding, your revenue.",
                ],
                ["FLEET TELEMETRY", "Web dashboard, lap analytics, driver leaderboard included."],
              ].map(([k, v]) => (
                <li key={k} className="grid grid-cols-[auto_1fr] gap-4 border-t border-border pt-4">
                  <span className="font-tech text-[10px] uppercase tracking-[0.25em] text-adrnln pt-1">
                    {k}
                  </span>
                  <span className="text-sm text-muted-foreground">{v}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="bg-card p-8 md:p-12 relative">
            <div className="absolute top-6 right-6 border border-adrnln px-3 py-1 font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
              Opening Offer
            </div>
            <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              MODEL B
            </div>
            <h3 className="mt-6 font-dot text-4xl md:text-5xl">Franchising</h3>
            <p className="mt-4 text-muted-foreground max-w-md">
              Launch an Odios-branded venue in your city. Turnkey hardware, brand, and operations
              playbook.
            </p>

            <div className="mt-8 border border-adrnln p-6">
              <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
                Founding Partners — Cohort 01
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="font-dot text-7xl text-adrnln leading-none">₹0</div>
                <div className="font-tech text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Franchise fee
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Waived for the first 5 launch partners. Ends Q3 2026.
              </p>
            </div>

            <ul className="mt-8 space-y-4">
              {[
                ["TURNKEY DEPLOY", "Track design, hardware install, staff training in 90 days."],
                ["BRAND LICENSE", "Full Odios brand kit, marketing playbook, content engine."],
                ["REV-SHARE", "Transparent royalty model. No hidden lock-ins."],
              ].map(([k, v]) => (
                <li key={k} className="grid grid-cols-[auto_1fr] gap-4 border-t border-border pt-4">
                  <span className="font-tech text-[10px] uppercase tracking-[0.25em] text-adrnln pt-1">
                    {k}
                  </span>
                  <span className="text-sm text-muted-foreground">{v}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
