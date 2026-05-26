import { useEffect, useState } from "react";

const powertrains = ["IC ENGINE", "ELECTRIC MOTOR"] as const;
type Powertrain = typeof powertrains[number];

const platformInfo: { key: string; blurb: string }[] = [
  { key: "RENTAL", blurb: "High reliability & safety. Built for repeat sessions." },
  { key: "DRIFT", blurb: "Custom tire sleeves & handbrakes for controlled sliding." },
  { key: "RACE", blurb: "Pure motorsport telemetry, low weight, high grip." },
  { key: "SHIFTER", blurb: "Sequential gearbox. Pro-tier pace. IC only." },
];

const stacks = ["SAFETY", "TIMING", "COCKPIT", "TELEMETRY", "GROUND-FX"] as const;

export function Configurator() {
  const [power, setPower] = useState<Powertrain>("IC ENGINE");
  const [platform, setPlatform] = useState<string>("RACE");
  const [picked, setPicked] = useState<Set<string>>(new Set(["SAFETY", "COCKPIT"]));

  // Disable SHIFTER when Electric is selected
  useEffect(() => {
    if (power === "ELECTRIC MOTOR" && platform === "SHIFTER") {
      setPlatform("RACE");
    }
  }, [power, platform]);

  const toggle = (s: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  return (
    <section id="configure" className="relative py-28 lg:py-40 border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-end justify-between gap-8 mb-12">
          <div>
            <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
              ◆ 04 / Configurator
            </div>
            <h2 className="font-dot text-5xl md:text-7xl leading-[0.9]">
              Choose the <span className="text-adrnln">soul</span>
              <br />
              of the machine.
            </h2>
            <p className="mt-6 max-w-2xl text-muted-foreground">
              Start with the powertrain. Pick a platform — <span className="text-foreground">Rental</span> for reliability,{" "}
              <span className="text-foreground">Drift</span> for sideways theatrics,{" "}
              <span className="text-foreground">Race</span> for pure pace, or{" "}
              <span className="text-foreground">Shifter</span> for sequential-gearbox motorsport. Stack the tech. We build.
            </p>
          </div>
        </div>

        <div className="border border-border">
          {/* STEP 1 — POWERTRAIN */}
          <div className="grid md:grid-cols-12 border-b border-border">
            <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-border bg-card">
              <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">Step 01</div>
              <div className="font-dot text-3xl mt-1">Powertrain</div>
              <p className="mt-3 text-xs text-muted-foreground font-tech uppercase tracking-[0.18em]">
                IC for raw character & shift-work. Electric for silent, instant torque.
              </p>
            </div>
            <div className="md:col-span-9 grid grid-cols-2">
              {powertrains.map((p) => {
                const active = power === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPower(p)}
                    className={`relative p-6 text-left border-r last:border-r-0 border-border transition-colors ${active ? "bg-adrnln text-adrnln-foreground" : "hover:bg-card"}`}
                  >
                    <div className="font-tech text-[10px] uppercase tracking-[0.25em] opacity-70">
                      P-{String(powertrains.indexOf(p) + 1).padStart(2, "0")}
                    </div>
                    <div className="font-dot text-3xl mt-2">{p}</div>
                    {active && <div className="absolute top-3 right-3 text-xs">●</div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2 — PLATFORM */}
          <div className="grid md:grid-cols-12 border-b border-border">
            <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-border bg-card">
              <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">Step 02</div>
              <div className="font-dot text-3xl mt-1">Platform</div>
              <p className="mt-3 text-xs text-muted-foreground font-tech uppercase tracking-[0.18em]">
                Chassis archetype. Determines geometry, drivetrain & class certification.
              </p>
            </div>
            <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-4">
              {platformInfo.map((p) => {
                const disabled = power === "ELECTRIC MOTOR" && p.key === "SHIFTER";
                const active = platform === p.key && !disabled;
                return (
                  <button
                    key={p.key}
                    onClick={() => !disabled && setPlatform(p.key)}
                    disabled={disabled}
                    className={`relative p-6 text-left border-r last:border-r-0 border-b md:border-b-0 border-border transition-colors ${
                      disabled
                        ? "opacity-30 cursor-not-allowed bg-card"
                        : active
                          ? "bg-adrnln text-adrnln-foreground"
                          : "hover:bg-card"
                    }`}
                  >
                    <div className="font-tech text-[10px] uppercase tracking-[0.25em] opacity-70">
                      {String(platformInfo.indexOf(p) + 1).padStart(2, "0")}
                      {disabled && <span className="ml-2">— IC ONLY</span>}
                    </div>
                    <div className="font-dot text-2xl mt-2">{p.key}</div>
                    <p className="mt-2 text-[11px] text-muted-foreground font-tech uppercase tracking-[0.15em] leading-relaxed">
                      {disabled ? "Disabled — sequential gearbox not applicable to electric." : p.blurb}
                    </p>
                    {active && <div className="absolute top-3 right-3 text-xs">●</div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3 — TECH STACK */}
          <div className="grid md:grid-cols-12 border-b border-border">
            <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-border bg-card">
              <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">Step 03</div>
              <div className="font-dot text-3xl mt-1">Tech-stack</div>
              <p className="mt-3 text-xs text-muted-foreground font-tech uppercase tracking-[0.18em]">
                Modular subsystems. Add or remove without touching the chassis.
              </p>
            </div>
            <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-5">
              {stacks.map((s) => {
                const active = picked.has(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggle(s)}
                    className={`relative p-6 text-left border-r last:border-r-0 border-b md:border-b-0 border-border transition-colors ${active ? "bg-foreground text-background" : "hover:bg-card"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-tech text-[10px] uppercase tracking-[0.25em] opacity-70">
                        T-{String(stacks.indexOf(s) + 1).padStart(2, "0")}
                      </div>
                      <div className={`w-3 h-3 border ${active ? "bg-adrnln border-adrnln" : "border-border"}`} />
                    </div>
                    <div className="font-dot text-2xl mt-2">{s}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4 — BUILD */}
          <div className="grid md:grid-cols-12">
            <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-border bg-card">
              <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">Step 04</div>
              <div className="font-dot text-3xl mt-1">We Build</div>
              <p className="mt-3 text-xs text-muted-foreground font-tech uppercase tracking-[0.18em]">
                Hand-assembled in our Kochi workshop. Lead time 12–16 weeks.
              </p>
            </div>
            <div className="md:col-span-9 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="font-tech text-xs uppercase tracking-[0.2em] text-muted-foreground space-y-2">
                <div>
                  POWERTRAIN <span className="text-foreground">/ {power}</span>
                </div>
                <div>
                  PLATFORM <span className="text-foreground">/ {platform}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  STACK /
                  {[...picked].length === 0 && <span className="text-muted-foreground">—</span>}
                  {[...picked].map((s) => (
                    <span key={s} className="text-adrnln border border-adrnln px-2 py-0.5">
                      {s}
                    </span>
                  ))}
                </div>
                <div>
                  CONFIG ID{" "}
                  <span className="text-foreground">
                    ODS-{power === "IC ENGINE" ? "IC" : "EV"}-{platform.slice(0, 2)}-
                    {((platform.length + power.length) * (picked.size + 1) * 137).toString(16).toUpperCase()}
                  </span>
                </div>
              </div>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 bg-adrnln text-adrnln-foreground px-6 py-4 font-tech text-xs uppercase tracking-[0.2em] hover:opacity-90 transition self-start md:self-auto"
              >
                Send Build Brief →
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-dot text-2xl md:text-3xl text-muted-foreground">
          “Forget standard models. <span className="text-foreground">You choose the soul of the machine.</span>”
        </p>
      </div>
    </section>
  );
}
