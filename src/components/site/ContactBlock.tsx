export function ContactBlock() {
  return (
    <section id="contact-section" className="relative py-24 md:py-28 lg:py-36 border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 lg:px-10">
        <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
          ◆ 03 / Contact
        </div>
        <h2 className="font-dot text-4xl sm:text-5xl md:text-7xl leading-[0.9]">
          Open a line.
          <br />
          <span className="text-muted-foreground">Build a venue.</span>
        </h2>

        <div className="mt-14 grid grid-cols-12 gap-px bg-border border border-border">
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-background p-8">
            <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Co-Founder / Engineering
            </div>
            <div className="font-dot text-3xl">Sabari Suresh</div>
            <a
              href="mailto:sabari@odios.in"
              className="block mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              sabari@odios.in
            </a>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-background p-8">
            <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Co-Founder / Operations
            </div>
            <div className="font-dot text-3xl">Athul Krishna</div>
            <a
              href="mailto:athul@odios.in"
              className="block mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              athul@odios.in
            </a>
          </div>
          <div className="col-span-12 lg:col-span-4 bg-background p-8">
            <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Corporate / Sales
            </div>
            <div className="font-dot text-3xl">sales@odios.in</div>
            <a
              href="mailto:sales@odios.in"
              className="block mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Request an engineering brief →
            </a>
          </div>
        </div>

        <div className="mt-10 inline-flex items-center gap-4 border border-border bg-card px-5 py-3">
          <span className="font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            IG / TT
          </span>
          <span className="font-dot text-2xl text-adrnln">@odiosofficial</span>
          <span className="blink text-adrnln">▮</span>
        </div>
      </div>
    </section>
  );
}
