export function TheGrid() {
  return (
    <section className="relative bg-white text-black">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-8 mb-0">
          <div>
            <div className="font-tech text-[11px] uppercase tracking-[0.4em] text-black/40 mb-4">
              [ SYSTEM // LOCK-IN ECOSYSTEM ]
            </div>
            <h2 className="font-sans text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
              THE GRID
            </h2>
          </div>
          <div className="font-tech text-[11px] uppercase tracking-[0.3em] flex items-center gap-2.5 text-[#FF0055]">
            <span className="inline-block w-2 h-2 bg-[#FF0055]" />
            COMING SOON
          </div>
        </div>

        {/* 3-Column Technical Data Grid */}
        <div className="grid md:grid-cols-3 border-b border-black/10">
          {/* Column 01 */}
          <article className="p-8 md:p-12 md:border-r border-black/10 border-b md:border-b-0 last:border-r-0">
            <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-black/40 mb-10">
              01 // XP POINTS
            </div>
            <h3 className="font-sans text-2xl md:text-[2rem] font-bold tracking-tight mb-6 leading-tight">
              LEVELING SYSTEM
            </h3>
            <p className="text-sm text-black/55 leading-[1.7]">
              Every lap earns drivers XP points based on their lap time. The more they drive, the more XP they earn, and the higher they level up to unlock exclusive features, performance specs, or new karts.
            </p>
          </article>

          {/* Column 02 */}
          <article className="p-8 md:p-12 md:border-r border-black/10 border-b md:border-b-0 last:border-r-0">
            <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-black/40 mb-10">
              02 // REAL-TIME LAP TIME
            </div>
            <h3 className="font-sans text-2xl md:text-[2rem] font-bold tracking-tight mb-6 leading-tight">
              RANKING SYSTEM
            </h3>
            <p className="text-sm text-black/55 leading-[1.7]">
              A synchronized leaderboard based on lap times updates in real time right after each session. The ranking system is localized per track, ensuring every circuit maintains its own digital competitive hierarchy.
            </p>
          </article>

          {/* Column 03 */}
          <article className="p-8 md:p-12">
            <div className="font-tech text-[10px] uppercase tracking-[0.3em] text-black/40 mb-10">
              03 // THE ELITE BOARD
            </div>
            <h3 className="font-sans text-2xl md:text-[2rem] font-bold tracking-tight mb-6 leading-tight">
              THE BLACKLIST
            </h3>
            <p className="text-sm text-black/55 leading-[1.7]">
              The top 15 fastest drivers on each track form the elite Blacklist. Any ranked player can challenge anyone positioned above them. Win the challenge, and you seize their rank while they drop down.
            </p>
          </article>
        </div>

        {/* Footer Blockquote */}
        <blockquote className="mt-20 max-w-4xl">
          <p className="font-sans text-lg md:text-xl font-medium text-black/70 leading-[1.7]">
            "The Grid is a league system designed to shift regional gokarting from a simple, one-time amusement ride into a ranked, competitive, high-retention ecosystem that drives repeat customer loyalty."
          </p>
        </blockquote>
      </div>
    </section>
  );
}
