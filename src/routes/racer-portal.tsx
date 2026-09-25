import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/racer-portal')({
  component: RacerPortalHub,
});

interface DriverStats {
  id: string;
  username: string;
  total_xp: number;
  current_level: number;
  streak_tier: number;
  wallet_balance_laps: number;
}

interface TopRank {
  rank_position: number;
  profiles: { username: string; current_level: number; total_xp: number } | null;
  tracks: { name: string } | null;
}

interface LapRecord {
  id: number;
  lap_time_seconds: number;
  xp_earned: number;
  created_at: string;
  karts: { kart_number: number } | null;
}

const RANK_MILESTONES = [
  { level: 1, title: 'ROOKIE RECRUIT', color: 'text-neutral-400 border-neutral-700 bg-neutral-900/50' },
  { level: 3, title: 'ASPHALT STRIKER', color: 'text-cyan-400 border-cyan-800 bg-cyan-950/20' },
  { level: 5, title: 'TRACK INTERCEPTOR', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/20' },
  { level: 8, title: 'APEX APPARITION', color: 'text-purple-400 border-purple-800 bg-purple-950/20' },
  { level: 12, title: 'BLACK_LIST MASTER', color: 'text-red-500 border-red-900 bg-red-950/30' },
];

const BADGE_RULES = [
  { id: 'b1', name: 'FIRST IGNITION', desc: 'Cleared telemetry check.', req: (s: DriverStats) => true },
  { id: 'b2', name: 'APEX HUNTER', desc: 'Reach Level 5+ on track loops.', req: (s: DriverStats) => s.current_level >= 5 },
  { id: 'b3', name: 'XP OVERLOAD', desc: 'Accumulate over 10,000 total tracking XP.', req: (s: DriverStats) => s.total_xp >= 10000 },
  { id: 'b4', name: 'ENDURANCE PILOT', desc: 'Possess 30+ reserve laps.', req: (s: DriverStats) => s.wallet_balance_laps >= 30 },
];

function RacerPortalHub() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [driverStats, setDriverStats] = useState<DriverStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<TopRank[]>([]);
  const [personalLaps, setPersonalLaps] = useState<LapRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [shareStatus, setShareStatus] = useState<string>('⚡ BROADCAST LIVE STATS');

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSessionUser(session.user);
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });
    fetchLeaderboard();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, total_xp, current_level, streak_tier, wallet_balance_laps')
        .eq('id', userId)
        .single();
      
      if (profile) setDriverStats(profile as unknown as DriverStats);

      const { data: laps } = await supabase
        .from('lap_records')
        .select('id, lap_time_seconds, xp_earned, created_at, karts ( kart_number )')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (laps) setPersonalLaps(laps as unknown as LapRecord[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('blacklist_ranks')
      .select('rank_position, profiles ( username, current_level, total_xp ), tracks ( name )')
      .order('rank_position', { ascending: true })
      .limit(10);
    if (data) setLeaderboard(data as unknown as TopRank[]);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let resolvedEmail = loginIdentifier.trim();

    if (!resolvedEmail.includes('@')) {
      try {
        const { data: profileLookup, error: lookupError } = await supabase
          .from('profiles')
          .select('username')
          .or(`username.eq.${resolvedEmail},mobile_number.eq.${resolvedEmail}`)
          .maybeSingle();

        if (lookupError || !profileLookup) {
          alert('⚠️ System Failure: Driver username or mobile credential match not found.');
          setLoading(false);
          return;
        }

        if (profileLookup.username === 'test_racer_01') {
          resolvedEmail = 'test01@gmail.com';
        } else if (profileLookup.username === 'raneen_user1') {
          resolvedEmail = 'roguehacker00@gmail.com';
        } else {
          resolvedEmail = `${profileLookup.username.toLowerCase()}@gmail.com`;
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
        return;
      }
    }

    const { data, error = null } = await supabase.auth.signInWithPassword({ email: resolvedEmail, password });
    if (error) {
      alert(`⚠️ Authentication Failed: ${error.message}`);
      setLoading(false);
    } else if (data?.user) {
      setSessionUser(data.user);
      await fetchUserData(data.user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSessionUser(null);
    setDriverStats(null);
    setPersonalLaps([]);
  };

  const handleNativeShare = async () => {
    const latestLap = personalLaps[0];
    const currentRankTitle = driverStats ? ([...RANK_MILESTONES].reverse().find(r => driverStats.current_level >= r.level) || RANK_MILESTONES[0]).title : 'ROOKIE';

    const shareText = latestLap 
      ? `🏁 ODIOS TELEMETRY DECK REFRESHED! 🏁\n\nPilot: ${driverStats?.username}\n⏱  Lap Record: ${latestLap.lap_time_seconds.toFixed(3)}s\n⚡ Class: ${currentRankTitle}\n🔋 Rank Stage: LVL ${driverStats?.current_level}\n\nTracked live on high-end engineered hardware loops at Odios Racing. Who is touching my record? 🏎💨`
      : `🏎 Staging in the pitbox at Odios Racing. Ready to set standard sector timings.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Odios Telemetry Core',
          text: shareText,
          url: window.location.origin + '/racer-portal',
        });
        setShareStatus('✓ TRANSMITTED SUCCESSFULLY');
        setTimeout(() => setShareStatus('⚡ BROADCAST LIVE STATS'), 2000);
      } catch (err) {
        console.log('Share canceled or dismissed:', err);
      }
    } else {
      const encodedMessage = encodeURIComponent(shareText);
      window.open(`https://api.whatsapp.com/send?text=${encodedMessage}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-dot text-sm tracking-widest text-adrnln animate-pulse">
        [ DECRYPTING MULTI-IDENTIFIER RACER GATEWAY NETWORK... ]
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-background text-white p-6 grid-bg scanlines flex items-center justify-center">
        <form onSubmit={handleLoginSubmit} className="glass p-8 w-full max-w-md border border-border/40 bg-card/40 backdrop-blur-md shadow-2xl">
          <div className="border-l-4 border-adrnln pl-4 mb-8">
            <h1 className="text-2xl font-bold font-sans tracking-widest uppercase text-white">ODIOS RACER AUTH</h1>
            <p className="text-[11px] font-dot text-neutral-400 mt-1 uppercase tracking-wider">Telemetry Node Validation Required.</p>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-dot tracking-widest text-neutral-400 uppercase mb-2">USER ID / PHONE / EMAIL</label>
              <input type="text" value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} placeholder="Enter Ident..." className="w-full bg-background/80 border border-border/40 px-4 py-3 font-dot text-sm text-white focus:outline-none focus:border-adrnln focus:ring-1 focus:ring-adrnln placeholder:text-neutral-600 transition-all" required />
            </div>
            <div>
              <label className="block text-[10px] font-dot tracking-widest text-neutral-400 uppercase mb-2">SECURITY KEY</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-background/80 border border-border/40 px-4 py-3 font-dot text-sm text-white focus:outline-none focus:border-adrnln focus:ring-1 focus:ring-adrnln transition-all" required />
            </div>
            <button type="submit" className="w-full bg-adrnln text-background py-3.5 text-xs uppercase font-dot font-bold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(var(--color-adrnln),0.3)] mt-2">
              ⚡ INITIALIZE CONNECT STREAM
            </button>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================
  // 📈 UNIFIED EXPONENTIAL LEVEL PROGRESSION MATHEMATICS
  // =========================================================
  const totalXp = driverStats ? driverStats.total_xp : 0;
  const currentLevel = driverStats ? driverStats.current_level : 1;

  // Compute exact point thresholds using our baseline configuration curve
  const currentLevelMinXp = Math.floor(1500 * Math.pow(currentLevel - 1, 1.8));
  const nextLevelMaxXp = Math.floor(1500 * Math.pow(currentLevel, 1.8));

  const xpInCurrentTier = totalXp - currentLevelMinXp;
  const tierTotalRange = nextLevelMaxXp - currentLevelMinXp;
  const xpProgress = Math.min(Math.max((xpInCurrentTier / tierTotalRange) * 100, 0), 100);

  // Select milestone rank layout based on current system tier
  const currentRank = [...RANK_MILESTONES].reverse().find(r => currentLevel >= r.level) || RANK_MILESTONES[0];
  const latestLap = personalLaps[0];

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8 grid-bg scanlines">
      {/* HEADER SECTION */}
      <header className="border-b border-border/40 pb-6 mb-8 flex justify-between items-end">
        <div>
          <span className="bg-adrnln text-background font-dot px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest">SECURED INTEGRATION VIA MULTI-PATH</span>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-white mt-3">PILOT TERMINAL MAIN</h1>
        </div>
        <button onClick={handleLogout} className="border border-border/40 bg-card/40 px-5 py-2 font-dot text-xs text-neutral-400 hover:text-adrnln hover:border-adrnln hover:bg-adrnln/10 active:scale-95 transition-all">
          ► TERMINATE UPLINK
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: RACER METRICS */}
        <div className="lg:col-span-4 space-y-6">
          {driverStats && (
            <>
              {/* PRIMARY STATS CARD */}
              <div className="glass p-6 border border-border/40 bg-card/40 relative overflow-hidden shadow-lg">
                <div className="flex justify-between items-start mb-6 border-b border-border/20 pb-4">
                  <div>
                    <span className="text-[10px] font-dot text-neutral-500 uppercase tracking-widest">CALLSIGN</span>
                    <h2 className="text-2xl font-bold text-white tracking-wide font-sans mt-1">{driverStats.username}</h2>
                  </div>
                  <span className={`border px-3 py-1 font-dot text-[9px] uppercase font-bold tracking-wider ${currentRank.color}`}>
                    {currentRank.title}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-background/60 border border-border/20 p-3">
                    <span className="text-[10px] font-dot text-neutral-500 uppercase">CHASSIS LEVEL</span>
                    <span className="text-white block font-bold text-2xl font-dot mt-1">#{driverStats.current_level}</span>
                  </div>
                  <div className="bg-background/60 border border-border/20 p-3">
                    <span className="text-[10px] font-dot text-neutral-500 uppercase">RESERVE LAPS</span>
                    <span className="text-adrnln block font-bold text-2xl font-dot mt-1">{driverStats.wallet_balance_laps}</span>
                  </div>
                </div>

                <div className="font-dot text-xs">
                  <div className="flex justify-between text-neutral-400 text-[10px] mb-2 uppercase tracking-widest">
                    <span>XP PROGRESS TRACK</span>
                    <span>{totalXp} / {nextLevelMaxXp} XP</span>
                  </div>
                  <div className="w-full bg-background border border-border/40 h-2.5 p-[1px]">
                    <div className="bg-adrnln h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(var(--color-adrnln),0.6)]" style={{ width: `${xpProgress}%` }}></div>
                  </div>
                </div>
              </div>

              {/* SOCIAL SHARE / STORY GENERATOR */}
              <div className="glass p-6 border border-adrnln/40 bg-gradient-to-b from-card/60 to-background shadow-[0_4px_30px_rgba(var(--color-adrnln),0.05)]">
                <div className="border-l-2 border-adrnln pl-3 mb-5">
                  <h3 className="text-[11px] font-dot text-adrnln uppercase tracking-widest font-bold">💥 STORY GENERATOR PLATFORM</h3>
                  <p className="text-[10px] font-sans text-neutral-400 mt-1">Export exact telemetry vectors directly to your feed.</p>
                </div>

                {/* THE VISUAL PLACARD CONTAINER */}
                <div className="w-full aspect-[9/16] max-w-[280px] mx-auto bg-background border border-adrnln/50 p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_0_40px_rgba(var(--color-adrnln),0.1)] scanlines mb-5">
                  <div className="flex justify-between items-start border-b border-border/20 pb-4">
                    <div>
                      <h4 className="text-sm font-black tracking-tight font-sans text-white leading-none uppercase">ODIOS TELEMETRY</h4>
                      <span className="text-[8px] font-dot tracking-widest text-adrnln uppercase mt-1 block">Live Circuit Data</span>
                    </div>
                    <span className="text-[8px] font-dot text-neutral-500 bg-card/80 px-2 py-1 border border-border/20">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-6 my-auto relative z-10">
                    <div>
                      <span className="text-[9px] font-dot text-neutral-500 block uppercase tracking-widest mb-1">PILOT CALLSIGN</span>
                      <div className="text-xl font-black font-sans tracking-tight text-white truncate">
                        {driverStats.username}
                      </div>
                      <span className={`inline-block border text-[8px] px-2 py-0.5 uppercase tracking-widest mt-2 font-dot font-bold ${currentRank.color}`}>
                        {currentRank.title}
                      </span>
                    </div>

                    <div className="bg-card/40 border border-border/20 p-4 shadow-inner">
                      <span className="text-[9px] font-dot text-neutral-400 block uppercase tracking-widest mb-1">LAP TIME SUMMARY</span>
                      <div className="text-4xl font-black font-dot text-adrnln tracking-tighter text-glow-adrnln">
                        {latestLap ? `${latestLap.lap_time_seconds.toFixed(3)}s` : 'STAGE_READY'}
                      </div>
                      <div className="flex justify-between text-[9px] font-dot text-neutral-500 mt-2">
                        <span>CHASSIS #{latestLap?.karts?.kart_number || '??'}</span>
                        <span className="text-emerald-400">+{latestLap?.xp_earned || 0} XP</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-dot">
                      <div className="border border-border/20 bg-background/60 p-3 text-center">
                        <span className="text-[8px] text-neutral-500 block uppercase tracking-widest mb-1">RANK STAGE</span>
                        <span className="text-sm font-bold text-white font-dot tracking-widest">LVL {driverStats.current_level}</span>
                      </div>
                      <div className="border border-border/20 bg-background/60 p-3 text-center">
                        <span className="text-[8px] text-neutral-500 block uppercase tracking-widest mb-1">STREAK TIER</span>
                        <span className="text-sm font-bold text-adrnln font-dot tracking-widest">🔥 TIER {driverStats.streak_tier}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/20 pt-4 flex flex-col items-center">
                    <div className="text-[10px] font-bold font-sans tracking-widest text-neutral-300">WWW.ODIOSRACING.COM</div>
                    <div className="text-[7px] font-dot text-neutral-500 uppercase tracking-widest mt-1">
                      Engineered via NIT Calicut
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-adrnln/10 pointer-events-none m-1"></div>
                </div>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full mt-2 bg-adrnln text-background font-dot text-xs font-bold py-3.5 uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(var(--color-adrnln),0.2)]"
                >
                  <span>{shareStatus}</span>
                </button>
              </div>

              {/* ACHIEVEMENTS BLOCK */}
              <div className="glass p-6 border border-border/40 bg-card/40">
                <h3 className="text-[10px] font-dot text-neutral-500 uppercase tracking-widest mb-5">// UNLOCKED ACHIEVEMENT INSIGNIAS</h3>
                <div className="grid grid-cols-1 gap-3">
                  {BADGE_RULES.map(badge => {
                    const status = badge.req(driverStats);
                    return (
                      <div key={badge.id} className={`border p-4 flex items-center space-x-4 transition-all ${status ? 'border-border/40 bg-background/80' : 'border-border/10 bg-background/20 opacity-40 select-none'}`}>
                        <div className={`w-10 h-10 flex shrink-0 items-center justify-center font-sans font-bold border ${status ? 'bg-adrnln/10 text-adrnln border-adrnln/50 shadow-[0_0_10px_rgba(var(--color-adrnln),0.2)]' : 'bg-background border-border/20 text-neutral-600'}`}>
                          {status ? '✓' : '🔒'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold font-sans tracking-wide text-white uppercase">{badge.name}</h4>
                          <p className="text-[10px] text-neutral-400 font-sans mt-1 leading-tight">{badge.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN: LEADERBOARD & LOGS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* BLACKLIST LEADERBOARD */}
          <section className="glass p-6 border border-border/40 bg-card/40">
            <div className="border-l-4 border-adrnln pl-4 mb-8">
              <h2 className="text-xl font-bold font-sans uppercase tracking-widest text-white">GLOBAL BLACKLIST TOP SPEED LEAGUE</h2>
            </div>
            
            <div className="flex flex-col space-y-2">
              {/* Grid Header */}
              <div className="grid grid-cols-[3rem_1fr_1fr_6rem] gap-4 px-4 py-3 border-b border-border/40 text-[10px] font-dot text-neutral-500 uppercase tracking-widest bg-background/40">
                <div className="text-center">POS</div>
                <div>PILOT TRACK NAME</div>
                <div>CIRCUIT NODE</div>
                <div className="text-right">ENERGY SCORE</div>
              </div>

              {/* Grid Rows */}
              {leaderboard.length > 0 ? (
                leaderboard.map((row) => (
                  <div 
                    key={row.rank_position} 
                    className={`grid grid-cols-[3rem_1fr_1fr_6rem] gap-4 items-center px-4 py-3 border transition-all hover-lift ${
                      row.rank_position === 1 
                        ? 'border-adrnln/60 bg-adrnln/5 shadow-[0_0_15px_rgba(var(--color-adrnln),0.1)] glow-adrnln z-10 scale-[1.01]' 
                        : 'border-border/20 bg-card/20 hover:border-border/40 hover:bg-card/60'
                    }`}
                  >
                    <div className="text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 text-[11px] font-bold font-dot ${row.rank_position === 1 ? 'bg-adrnln text-background shadow-md' : 'bg-background border border-border/40 text-neutral-400'}`}>
                        #{row.rank_position}
                      </span>
                    </div>
                    <div className="font-sans font-bold text-white text-sm truncate">
                      {row.profiles?.username} 
                      <span className="text-[10px] font-dot font-normal text-neutral-500 ml-3 inline-block">LVL {row.profiles?.current_level}</span>
                    </div>
                    <div className="font-dot text-xs text-neutral-400 uppercase tracking-wide truncate">
                      {row.tracks?.name || 'MAIN TRACK'}
                    </div>
                    <div className={`text-right font-bold font-dot tracking-wider ${row.rank_position === 1 ? 'text-adrnln text-glow-adrnln text-sm' : 'text-neutral-300 text-xs'}`}>
                      {row.profiles?.total_xp} XP
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-[11px] font-dot text-neutral-600 uppercase tracking-widest border border-dashed border-border/20 bg-background/20 mt-2">
                  [ SEEDING POSITIONS PENDING ]
                </div>
              )}
            </div>
          </section>

          {/* RECENT TIMING LOGS */}
          <section className="glass p-6 border border-border/40 bg-card/40">
            <h3 className="text-[10px] font-dot text-neutral-500 uppercase tracking-widest mb-6">// YOUR RECENT TIMING LOGS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalLaps.length > 0 ? (
                personalLaps.map(lap => (
                  <div key={lap.id} className="border border-border/20 bg-background/60 p-4 flex justify-between items-center transition-all hover-lift hover:border-border/40">
                    <div>
                      <div className="text-white font-bold font-dot text-lg tracking-widest">{lap.lap_time_seconds.toFixed(3)}s</div>
                      <div className="text-[10px] font-dot text-neutral-500 mt-1 uppercase tracking-widest">CHASSIS MACHINE #{lap.karts?.kart_number || '??'}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold font-dot text-sm">+{lap.xp_earned} XP</span>
                      <div className="text-[9px] font-dot text-neutral-600 mt-1 tracking-widest">{new Date(lap.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 border border-dashed border-border/20 bg-background/20 p-10 text-center text-[10px] font-dot text-neutral-600 uppercase tracking-widest">
                  [ NO TIMED TRACK TIMESTAMPS LINKED TO THIS ACCOUNT CURRENTLY ]
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}