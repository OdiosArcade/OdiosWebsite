export function PageHeader({
  eyebrow,
  title,
  accent,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative pt-28 lg:pt-36 pb-12 border-b border-border overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
      <div className="absolute inset-0 scanlines pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-6 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-adrnln" />
          {eyebrow}
        </div>
        <h1 className="font-dot text-[clamp(2.5rem,8vw,7.5rem)] leading-[0.9] tracking-tight">
          {title}
          {accent && (
            <>
              {" "}
              <span className="text-adrnln text-glow-adrnln">{accent}</span>
            </>
          )}
        </h1>
        {subtitle && (
          <p className="mt-8 max-w-2xl text-base lg:text-lg text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
