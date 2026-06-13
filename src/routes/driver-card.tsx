import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/driver-card')({
  component: DriverGamificationHub,
});

interface DriverStats {
  id: string;
  username: string;
  total_xp: number;
  current_level: number;
  streak_tier: number;
  wallet_balance_laps: number;
}

// 🎖️ System Configuration: Ranks Tier Matrix
const RANK_MILESTONES = [
  { level: 1, title: 'ROOKIE RECRUIT', color: 'text-neutral-400 border-neutral-700 bg-neutral-900/50' },
  { level: 3, title: 'ASPHALT STRIKER', color: 'text-cyan-400 border-cyan-800 bg-cyan-950/20' },
  { level: 5, title: 'TRACK INTERCEPTOR', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/20' },
  { level: 8, title: 'APEX APPARITION', color: 'text-purple-400 border-purple-800 bg-purple-950/20' },
  { level: 12, title: 'BLACK_LIST MASTER', color: 'text-red-500 border-red-900 bg-red-950/30 font-bold text-glow-adrnln animate-pulse' },
];

// 🏅 System Configuration: Automated Badge Unlocks Matrix
const BADGE_RULES = [
  { id: 'b1', name: 'FIRST IGNITION', desc: 'Registered account and cleared telemetry check.', req: (s: DriverStats) => true },
  { id: 'b2', name: 'APEX HUNTER', desc: 'Reach Level 5+ on track loops.', req: (s: DriverStats) => s.current_level >= 5 },
  { id: 'b3', name: 'XP OVERLOAD', desc: 'Accumulate over 10,000 total tracking XP.', req: (s: DriverStats) => s.total_xp >= 10000 },
  { id: 'b4', name: 'STREAK LEVEL_I', desc: 'Unlock Streak Tier 1 status.', req: (s: DriverStats) => s.streak_tier >= 1 },
  { id: 'b5', name: 'STREAK MAXED', desc: 'Reach maximum Streak Tier 3 tier rating.', req: (s: DriverStats) => s.streak_tier >= 3 },
  { id: 'b6', name: 'ENDURANCE PILOT', desc: 'Possess a wallet balance of 30+ reserve laps.', req: (s: DriverStats) => s.wallet_balance_laps >= 30 },
];

function DriverGamificationHub() {
  const [profiles, setProfiles] = useState<DriverStats[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [activeDriver, setActiveDriver] = useState<DriverStats | null>(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, total_xp, current_level, streak_tier, wallet_balance_laps')
      .order('username', { ascending: true });
    if (data) setProfiles(data as unknown as DriverStats[]);
  };

  const handleDriverChange = (id: string) => {
    setSelectedProfileId(id);
    const driver = profiles.find(p => p.id === id);
    setActiveDriver(driver || null);
  };

  // Gamification Mathematics
  const nextLevelXpThreshold = activeDriver ? activeDriver.current_level * 5000 : 5000;
  const currentLevelBaseXp = activeDriver ? (activeDriver.current_level - 1) * 5000 : 0;
  const xpEarnedInCurrentLevel = activeDriver ? activeDriver.total_xp - currentLevelBaseXp : 0;
  const xpNeededForNextLevel = 5000;
  const xpProgressPercentage = activeDriver ? Math.min((xpEarnedInCurrentLevel / xpNeededForNextLevel) * 100, 100) : 0;

  // Find highest unlocked tactical rank title
  const currentRank = activeDriver 
    ? [...RANK_MILESTONES].reverse().find(r => activeDriver.current_level >= r.level) || RANK_MILESTONES[0]
    : RANK_MILESTONES[0];

  return (
    <div className="min-h-screen bg-black text-white p-6 grid-bg scanlines">
      
      {/* HUD BANNER */}
      <header className="border-b border-neutral-800 pb-4 mb-8 flex justify-between items-center">
        <div>
          <span className="bg-emerald-500 text-black font-mono px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
            REWARDS ENGINE CORE
          </span>
          <h1 className="text-2xl font-bold tracking-wider font-tech text-white mt-1">
            DRIVER STATS & UNLOCK MILIEU
          </h1>
        </div>
        
        {/* PROFILE LOOKUP DROP-DOWN */}
        <div className="w-64">
          <select
            value={selectedProfileId}
            onChange={(e) => handleDriverChange(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
          >
            <option value="">-- INSPECT DRIVER IDENTITY --</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.username}</option>
            ))}
          </select>
        </div>
      </header>

      {activeDriver ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto animate-fade-in">
          
          {/* LEFT PANELS: MILITARY RANK CARD & LEVEL TRAJECTORY */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* DRIVER TACTICAL IDENTIFICATION CARD */}
            <div className="glass p-6 border-2 border-neutral-800 bg-gradient-to-b from-neutral-950 to-neutral-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-2 text-[80px] font-black font-tech text-neutral-900/30 select-none">
                LVL{activeDriver.current_level}
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs uppercase font-mono tracking-widest text-neutral-500">PILOT UNLOCK CALLSIGN</div>
                  <h2 className="text-2xl font-black tracking-wide text-white font-sans mt-0.5">{activeDriver.username}</h2>
                </div>
                <div className={`border px-3 py-1 text-[10px] font-mono tracking-wider uppercase font-bold ${currentRank.color}`}>
                  {currentRank.title}
                </div>
              </div>

              {/* STREAK STAGE ENGINE MONITOR */}
              <div className="border-t border-b border-neutral-800/60 py-4 my-4 grid grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px] tracking-wider uppercase">STREAK MULTIPLIER</span>
                  <span className={`text-lg font-bold font-tech block mt-0.5 ${activeDriver.streak_tier > 0 ? 'text-orange-400 text-glow-adrnln' : 'text-neutral-400'}`}>
                    {activeDriver.streak_tier > 0 ? `🔥 TIER ${activeDriver.streak_tier} ACTIVE` : '✖ NO MULTIPLIER'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] tracking-wider uppercase">RESERVE TRACK WALLET</span>
                  <span className="text-lg font-bold font-tech text-white block mt-0.5">{activeDriver.wallet_balance_laps} LAPS</span>
                </div>
              </div>

              {/* XP ACCOUNTABILITY LEDGER */}
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-neutral-400">
                  <span>ACCUMULATED ENGINE SCORE:</span>
                  <span className="text-white font-bold">{activeDriver.total_xp} XP</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>LEVEL UP THRESHOLD:</span>
                  <span>{xpEarnedInCurrentLevel} / {xpNeededForNextLevel} XP</span>
                </div>
              </div>
            </div>

            {/* PROGRESS BAR BAROMETER */}
            <div className="glass p-4 border border-neutral-800 bg-neutral-950/60 font-mono text-xs">
              <div className="flex justify-between text-neutral-400 mb-2 text-[10px]">
                <span>LEVEL {activeDriver.current_level} OVERVIEW</span>
                <span>LEVEL {activeDriver.current_level + 1} NEXT</span>
              </div>
              <div className="w-full bg-neutral-900 h-3 border border-neutral-800 p-0.5 rounded-none">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${xpProgressPercentage}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-neutral-500 mt-2 uppercase text-right tracking-tight">
                {xpProgressPercentage.toFixed(1)}% DISTANCE COMMITTED
              </p>
            </div>

          </div>

          {/* RIGHT PANELS: DEPLOYED VISUAL BADGES UNLOCK ENGINE */}
          <div className="xl:col-span-2 glass p-6 border border-neutral-800 rounded-none bg-neutral-950/20">
            <div className="border-l-2 border-emerald-500 pl-3 mb-6">
              <h3 className="text-lg font-bold font-tech uppercase tracking-wide">03 // ODIOS PERIPHERAL REWARD INSIGNIAS</h3>
              <p className="text-xs text-neutral-400">Hardware and logic accomplishments calculated instantaneously from cloud states.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BADGE_RULES.map((badge) => {
                const isUnlocked = badge.req(activeDriver);

                return (
                  <div 
                    key={badge.id}
                    className={`border p-4 flex items-center space-x-4 transition-all duration-300 ${
                      isUnlocked 
                        ? 'border-emerald-500/40 bg-emerald-950/5 shadow-[0_0_15px_rgba(16,185,129,0.03)]' 
                        : 'border-neutral-900 bg-neutral-950/40 opacity-40 select-none'
                    }`}
                  >
                    {/* ACCREDITED VERIFIED METRIC ICON BADGE */}
                    <div className={`w-12 h-12 flex items-center justify-center font-tech font-black text-lg border-2 ${
                      isUnlocked 
                        ? 'bg-emerald-500 text-black border-emerald-400' 
                        : 'bg-neutral-900 text-neutral-600 border-neutral-800'
                    }`}>
                      {isUnlocked ? '✓' : '🔒'}
                    </div>

                    {/* BADGE TEXT DATA CONTENT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className={`text-sm font-bold font-tech tracking-wide ${isUnlocked ? 'text-white' : 'text-neutral-500'}`}>
                          {badge.name}
                        </h4>
                        <span className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 font-bold ${
                          isUnlocked ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-neutral-900 text-neutral-600'
                        }`}>
                          {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-sans mt-0.5 truncate">{badge.desc}</p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      ) : (
        <div className="max-w-md mx-auto border border-dashed border-neutral-800 p-16 text-center text-xs font-mono text-neutral-500 uppercase tracking-widest mt-12 bg-neutral-950/50">
          [ Awaiting driver console identity validation select query stream ]
        </div>
      )}

    </div>
  );
}