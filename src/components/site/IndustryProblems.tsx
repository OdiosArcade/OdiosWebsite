export function IndustryProblems() {
  const problems = [
    ["AMUSEMENT-ONLY", "Just amusement, with little customer retention."],
    ["MANUAL UPKEEP", "Tiring and manual fleet maintenance cycles."],
    ["OUTDATED TECH", "Track technology stuck a decade in the past."],
  ];
  return (
    <section className="relative py-20 lg:py-28 border-t border-border bg-card">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
          ◆ 01 / The Status Quo
        </div>
        <h2 className="font-dot text-4xl md:text-6xl leading-[0.95] max-w-3xl">
          The industry has been <span className="text-muted-foreground">coasting.</span>{" "}
          <span className="text-adrnln">We're done with that.</span>
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-px bg-border border border-border">
          {problems.map(([k, v]) => (
            <div key={k} className="bg-card p-6">
              <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
                {k}
              </div>
              <div className="mt-3 font-dot text-2xl leading-tight">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
