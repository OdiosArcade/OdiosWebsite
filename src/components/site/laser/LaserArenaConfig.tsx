import { useState } from "react";

const formats = [
  { key: "TACTICAL", blurb: "Mil-sim objectives. Cover-based gunplay. Team comms." },
  { key: "SCI-FI", blurb: "Themed IP, atmospheric lighting, narrative game-modes." },
  { key: "E-SPORTS", blurb: "Competitive leagues. Leaderboards. Spectator overlays." },
];

const tiers = [
  { key: "CORE", blurb: "Standard phaser, 8-zone vest, smart obstacles." },
  { key: "PRO", blurb: "Active recoil, 12-zone vest, dynamic LED props." },
  { key: "ELITE", blurb: "Full haptic, 16-zone vest, DMX-512 arena sync." },
];

export function LaserArenaConfig() {
  const [format, setFormat] = useState("TACTICAL");
  const [tier, setTier] = useState("PRO");

  return (
    <section className="relative py-28 lg:py-40 border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
          ◆ 04 / Arena Customization
        </div>
        <h2 className="font-dot text-5xl md:text-7xl leading-[0.9]">
          Forget standard setups.
          <br />
          <span className="text-muted-foreground">We build to your operation.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          Configure the format, choose the hardware tier — we deliver a turn-key tactical arena
          straight to your circuit.
        </p>

        <div className="mt-12 border border-border">
          {/* STEP 01 */}
          <div className="grid md:grid-cols-12 border-b border-border">
            <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-border bg-card">
              <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
                Step 01
              </div>
              <div className="font-dot text-3xl mt-1">Platform</div>
              <p className="mt-3 text-xs text-muted-foreground font-tech uppercase tracking-[0.18em]">
                Pick the game format. Defines mission logic, scoring & arena layout.
              </p>
            </div>
            <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-3">
              {formats.map((f, i) => {
                const active = format === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFormat(f.key)}
                    className={`relative p-6 text-left border-r last:border-r-0 border-b md:border-b-0 border-border transition-colors ${
                      active ? "bg-adrnln text-adrnln-foreground" : "hover:bg-card"
                    }`}
                  >
                    <div className="font-tech text-[10px] uppercase tracking-[0.25em] opacity-70">
                      F-{String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="font-dot text-2xl mt-2">{f.key}</div>
                    <p className="mt-2 text-[11px] font-tech uppercase tracking-[0.15em] leading-relaxed opacity-80">
                      {f.blurb}
                    </p>
                    {active && <div className="absolute top-3 right-3 text-xs">●</div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 02 */}
          <div className="grid md:grid-cols-12 border-b border-border">
            <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-border bg-card">
              <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
                Step 02
              </div>
              <div className="font-dot text-3xl mt-1">Tech Tier</div>
              <p className="mt-3 text-xs text-muted-foreground font-tech uppercase tracking-[0.18em]">
                Phaser specs, vest sensor density, smart arena obstacles.
              </p>
            </div>
            <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-3">
              {tiers.map((t, i) => {
                const active = tier === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTier(t.key)}
                    className={`relative p-6 text-left border-r last:border-r-0 border-b md:border-b-0 border-border transition-colors ${
                      active ? "bg-adrnln text-adrnln-foreground" : "hover:bg-card"
                    }`}
                  >
                    <div className="font-tech text-[10px] uppercase tracking-[0.25em] opacity-70">
                      T-{String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="font-dot text-2xl mt-2">{t.key}</div>
                    <p className="mt-2 text-[11px] font-tech uppercase tracking-[0.15em] leading-relaxed opacity-80">
                      {t.blurb}
                    </p>
                    {active && <div className="absolute top-3 right-3 text-xs">●</div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 03 */}
          <div className="grid md:grid-cols-12">
            <div className="md:col-span-3 p-6 border-b md:border-b-0 md:border-r border-border bg-card">
              <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
                Step 03
              </div>
              <div className="font-dot text-3xl mt-1">We Build</div>
              <p className="mt-3 text-xs text-muted-foreground font-tech uppercase tracking-[0.18em]">
                Custom turn-key tactical hardware delivered to your circuit.
              </p>
            </div>
            <div className="md:col-span-9 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="font-tech text-xs uppercase tracking-[0.2em] text-muted-foreground space-y-2">
                <div>
                  FORMAT <span className="text-foreground">/ {format}</span>
                </div>
                <div>
                  TIER <span className="text-foreground">/ {tier}</span>
                </div>
                <div>
                  CONFIG ID{" "}
                  <span className="text-foreground">
                    ODS-LT-{tier.slice(0, 2)}-{format.slice(0, 2)}-
                    {(format.length * tier.length * 211).toString(16).toUpperCase()}
                  </span>
                </div>
              </div>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 bg-adrnln text-adrnln-foreground px-6 py-4 font-tech text-xs uppercase tracking-[0.2em] hover:opacity-90 transition self-start md:self-auto"
              >
                Send Arena Brief →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
