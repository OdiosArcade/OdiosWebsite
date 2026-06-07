import { useEffect, useRef, useState } from "react";
import leveling from "@/assets/grid-leveling.jpg";
import ranking from "@/assets/grid-ranking.jpg";
import blacklist from "@/assets/grid-blacklist.jpg";

const modules = [
  {
    code: "01",
    tag: "XP POINTS",
    title: "LEVELING SYSTEM",
    img: leveling,
    body:
      "Every lap earns drivers XP based on lap time. The more they drive, the more XP they earn — unlocking exclusive features, performance specs, and new karts.",
    specs: [
      ["INPUT", "LAP TIME"],
      ["OUTPUT", "XP / LVL"],
      ["UNLOCKS", "TIERED"],
    ],
  },
  {
    code: "02",
    tag: "REAL-TIME LAP TIME",
    title: "RANKING SYSTEM",
    img: ranking,
    body:
      "A synchronized leaderboard based on lap times updates in real time after each session. Localized per track, every circuit maintains its own digital competitive hierarchy.",
    specs: [
      ["SYNC", "REAL-TIME"],
      ["SCOPE", "PER TRACK"],
      ["LATENCY", "<200MS"],
    ],
  },
  {
    code: "03",
    tag: "THE ELITE BOARD",
    title: "THE BLACKLIST",
    img: blacklist,
    body:
      "The top 15 fastest drivers on each track form the elite Blacklist. Any ranked player can challenge anyone above them. Win and you seize their rank — they drop down.",
    specs: [
      ["ELITES", "TOP 15"],
      ["MODE", "CHALLENGE"],
      ["STAKES", "RANK SWAP"],
    ],
  },
];

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const start = performance.now();
            const dur = 1400;
            const step = (t: number) => {
              const p = Math.min((t - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(Math.round(to * eased));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

export function TheGrid() {
  return (
    <section className="relative bg-white text-black overflow-hidden">
      {/* faint background grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-8 lg:px-10 py-20 md:py-24 lg:py-32">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-8">
          <div>
            <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-black/40 mb-4 flex items-center gap-3">
              <span className="inline-block w-6 h-px bg-black/40" />
              SYSTEM // LOCK-IN ECOSYSTEM
            </div>
            <h2 className="font-sans text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.9]">
              THE GRID
            </h2>
          </div>
          <div className="font-tech text-[11px] uppercase tracking-[0.3em] flex items-center gap-2.5 text-[#FF0055]">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inset-0 bg-[#FF0055] animate-ping opacity-60" />
              <span className="relative inline-block w-2 h-2 bg-[#FF0055]" />
            </span>
            COMING SOON
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-3 border-b border-black/10">
          {[
            { v: 15, s: "", label: "ELITE SLOTS / TRACK" },
            { v: 200, s: "MS", label: "LEADERBOARD SYNC" },
            { v: 100, s: "%", label: "RETENTION ENGINE" },
          ].map((s) => (
            <div key={s.label} className="py-6 md:py-8 px-2 first:pl-0 border-r border-black/10 last:border-r-0">
              <div className="font-sans text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight tabular-nums">
                <Counter to={s.v} suffix={s.s} />
              </div>
              <div className="font-tech text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-black/40 mt-2 leading-tight">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* 3-Column Modules */}
        <div className="grid md:grid-cols-3 border-b border-black/10">
          {modules.map((m, i) => (
            <article
              key={m.code}
              className="group relative p-6 md:p-8 border-b md:border-b-0 md:border-r border-black/10 last:border-r-0 last:border-b-0 transition-colors duration-500 hover:bg-black hover:text-white"
            >
              {/* HUD corner brackets */}
              <span className="pointer-events-none absolute top-3 left-3 w-3 h-3 border-t border-l border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="pointer-events-none absolute top-3 right-3 w-3 h-3 border-t border-r border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="pointer-events-none absolute bottom-3 left-3 w-3 h-3 border-b border-l border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="pointer-events-none absolute bottom-3 right-3 w-3 h-3 border-b border-r border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center justify-between font-tech text-[10px] uppercase tracking-[0.3em] opacity-60">
                <span>MODULE / {m.code}</span>
                <span>{m.tag}</span>
              </div>

              {/* Image plate */}
              <div className="relative mt-6 aspect-[4/3] overflow-hidden bg-white">
                <div className="absolute inset-0 border border-black/10 group-hover:border-white/20 transition-colors duration-500" />
                <img
                  src={m.img}
                  alt={m.title}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 grayscale contrast-125 transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
                />
                {/* scan sweep */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-x-4 top-0 h-px bg-[#FF0055] opacity-0 group-hover:opacity-100 group-hover:translate-y-[1000%] transition-all duration-[1400ms] ease-out" />
                </div>
                {/* index */}
                <div className="absolute bottom-2 right-2 font-tech text-[10px] uppercase tracking-[0.3em] opacity-60 bg-white/80 group-hover:bg-black/60 group-hover:text-white px-1.5 py-0.5 transition-colors">
                  IDX.{String(i + 1).padStart(3, "0")}
                </div>
              </div>

              <h3 className="font-sans text-2xl md:text-[1.75rem] font-bold tracking-tight mt-7 leading-tight">
                {m.title}
              </h3>
              <p className="text-sm opacity-60 leading-[1.7] mt-3">{m.body}</p>

              {/* Specs */}
              <dl className="mt-7 grid grid-cols-3 border-t border-current/10">
                {m.specs.map(([k, v]) => (
                  <div
                    key={k}
                    className="py-3 pr-3 border-r border-current/10 last:border-r-0"
                  >
                    <dt className="font-tech text-[9px] uppercase tracking-[0.25em] opacity-50">
                      {k}
                    </dt>
                    <dd className="font-tech text-xs uppercase tracking-[0.15em] mt-1">{v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        {/* Footer Blockquote */}
        <div className="mt-20 grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
          <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-black/40 whitespace-nowrap">
            // THESIS
          </div>
          <blockquote className="max-w-4xl border-l-2 border-black pl-6">
            <p className="font-sans text-lg md:text-2xl font-medium text-black leading-[1.5]">
              "The Grid is a league system designed to shift regional gokarting
              from a simple, one-time amusement ride into a{" "}
              <span className="bg-black text-white px-1.5">ranked, competitive, professional ecosystem.</span>"

            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
