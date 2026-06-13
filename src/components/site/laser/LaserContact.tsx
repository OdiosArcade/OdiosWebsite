import { useState } from "react";

export function LaserContact() {
  const [form, setForm] = useState({ name: "", email: "", location: "" });

  return (
    <section className="relative py-28 lg:py-40 border-t border-border overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
      <div className="absolute inset-0 scanlines pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-adrnln mb-4">
          ◆ 06 / Tactical Call
        </div>
        <h2 className="font-dot text-5xl md:text-7xl leading-[0.9] max-w-4xl">
          “The future of live-action gaming isn't{" "}
          <span className="text-muted-foreground">simulated.</span> It's{" "}
          <span className="text-adrnln text-glow-adrnln">engineered.</span>”
        </h2>

        <div className="mt-16 grid grid-cols-12 gap-10">
          {/* Contact boxes */}
          <div className="col-span-12 lg:col-span-5 space-y-px bg-border border border-border">
            {[
              ["DIRECT", "tactical@odios.in"],
              ["BUILD-OPS", "Sabari Suresh / Athul Krishna"],
              ["WORKSHOP", "Kochi · Kerala · IN"],
              ["SOCIAL", "@odiosofficial"],
            ].map(([k, v]) => (
              <div key={k} className="bg-background p-5 grid grid-cols-[120px_1fr] items-center">
                <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
                  {k}
                </div>
                <div className="font-dot text-xl md:text-2xl">{v}</div>
              </div>
            ))}
          </div>

          {/* Inline form */}
          <form
            className="col-span-12 lg:col-span-7 border border-border p-6 md:p-8 space-y-px bg-card"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
              ▶ Initiate Demo Request
            </div>
            {[
              { k: "name", l: "Name" },
              { k: "email", l: "Email" },
              { k: "location", l: "Location" },
            ].map(({ k, l }) => (
              <div
                key={k}
                className="grid grid-cols-[110px_1fr] items-center border-b border-border py-3"
              >
                <label className="font-tech text-[10px] uppercase tracking-[0.3em] text-adrnln">
                  / {l}
                </label>
                <input
                  type={k === "email" ? "email" : "text"}
                  value={form[k as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                  className="bg-transparent outline-none font-dot text-2xl placeholder:text-muted-foreground/50 focus:placeholder:text-muted-foreground"
                  placeholder={`Enter ${l.toLowerCase()}…`}
                />
              </div>
            ))}
            <div className="pt-6">
              <button
                type="submit"
                className="group inline-flex items-center gap-3 bg-foreground text-background px-7 py-4 font-tech text-[11px] uppercase tracking-[0.3em] hover:bg-adrnln hover:text-adrnln-foreground transition-colors"
              >
                Transmit Brief
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
