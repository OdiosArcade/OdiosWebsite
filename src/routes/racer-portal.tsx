import { createFileRoute } from '@tanstack/react-router';
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
  { level: 1, title: 'ROOKIE RECRUIT', minXp: 0, maxXp: 3000, color: 'text-neutral-400 border-neutral-700 bg-neutral-900/50' },
  { level: 3, title: 'ASPHALT STRIKER', minXp: 3000, maxXp: 10000, color: 'text-cyan-400 border-cyan-800 bg-cyan-950/20' },
  { level: 5, title: 'TRACK INTERCEPTOR', minXp: 10000, maxXp: 25000, color: 'text-emerald-400 border-emerald-800 bg-emerald-950/20' },
  { level: 8, title: 'APEX APPARITION', minXp: 25000, maxXp: 50000, color: 'text-purple-400 border-purple-800 bg-purple-950/20' },
  { level: 12, title: 'BLACK_LIST MASTER', minXp: 50000, maxXp: 999999, color: 'text-red-500 border-red-900 bg-red-950/30' },
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
      // Force profile data fetch straight from source row context
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
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-xs tracking-widest text-neutral-500">
        [ DECRYPTING MULTI-IDENTIFIER RACER GATEWAY NETWORK... ]
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-black text-white p-6 grid-bg scanlines flex items-center justify-center">
        <form onSubmit={handleLoginSubmit} className="glass p-8 w-full max-w-md border border-neutral-800 bg-black/90">
          <div className="border-l-2 border-red-500 pl-3 mb-6">
            <h1 className="text-xl font-bold font-tech tracking-wider uppercase">ODIOS RACER SIGN-IN</h1>
            <p className="text-xs text-neutral-400">Username, Phone (+91...), or Email identity path.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase mb-2"> USER ID/PHONE/EMAIL</label>
              <input type="text" value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} placeholder="Username / Phone / Email" className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-red-500 placeholder:text-neutral-700" required />
            </div>
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase mb-2">Security Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 font-mono text-sm focus:outline-none focus:border-red-500" required />
            </div>
            <button type="submit" className="w-full bg-white text-black py-3 text-xs uppercase font-mono font-bold tracking-widest hover:bg-neutral-200">
              ⚡ INITIALIZE CONNECT STREAM
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Synchronized Multi-Milestone Math Processing
  const currentRank = driverStats 
    ? [...RANK_MILESTONES].reverse().find(r => driverStats.current_level >= r.level) || RANK_MILESTONES[0]
    : RANK_MILESTONES[0];

  const totalXp = driverStats ? driverStats.total_xp : 0;
  const xpInCurrentTier = totalXp - currentRank.minXp;
  const tierTotalRange = currentRank.maxXp - currentRank.minXp;
  const xpProgress = Math.min(Math.max((xpInCurrentTier / tierTotalRange) * 100, 0), 100);

  const latestLap = personalLaps[0];

  return (
    <div className="min-h-screen bg-black text-white p-6 grid-bg scanlines">
      <header className="border-b border-neutral-800 pb-4 mb-8 flex justify-between items-center">
        <div>
          <span className="bg-red-600 text-white font-mono px-2 py-0.5 text-[9px] font-bold uppercase">SECURED INTEGRATION VIA MULTI-PATH</span>
          <h1 className="text-2xl font-bold font-tech tracking-wide text-white mt-1">PILOT TERMINAL MAIN</h1>
        </div>
        <button onClick={handleLogout} className="border border-neutral-800 bg-neutral-950 px-4 py-1.5 font-mono text-xs text-neutral-400 hover:text-red-500 transition-colors">
          ► LOGOUT TERMINAL
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          {driverStats && (
            <>
              <div className="glass p-6 border border-neutral-800 bg-neutral-950/80 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">CALLSIGN</span>
                    <h2 className="text-xl font-bold text-white tracking-wide font-sans">{driverStats.username}</h2>
                  </div>
                  <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase font-bold ${currentRank.color}`}>
                    {currentRank.title}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-neutral-900 py-3 my-4 font-mono text-xs text-neutral-400">
                  <div>LEVEL: <span className="text-white block font-bold text-lg font-tech mt-0.5">#{driverStats.current_level}</span></div>
                  <div>RESERVE LAPS: <span className="text-orange-400 block font-bold text-lg font-tech mt-0.5">{driverStats.wallet_balance_laps}</span></div>
                </div>

                <div className="font-mono text-xs">
                  <div className="flex justify-between text-neutral-500 text-[10px] mb-1">
                    <span>XP PROGRESS TRACK</span>
                    <span>{totalXp} / {currentRank.maxXp} XP</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2 border border-neutral-800 p-0.5">
                    <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
                  </div>
                </div>
              </div>

              {/* 📱 INSTAGRAM / WHATSAPP GRAPHIC SHARE BLOCK */}
              <div className="glass p-6 border border-orange-500/30 bg-gradient-to-b from-neutral-950 to-neutral-900 rounded-none">
                <div className="border-l-2 border-orange-500 pl-2.5 mb-4">
                  <h3 className="text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">💥 STORY GENERATOR PLATFORM</h3>
                  <p className="text-[10px] text-neutral-400">Screenshot this custom card layout directly or trigger the native direct sheet below.</p>
                </div>

                {/* THE VISUAL PLACARD CONTAINER */}
                <div className="w-full aspect-[9/16] max-w-[260px] mx-auto bg-black border-2 border-orange-500 p-5 flex flex-col justify-between relative overflow-hidden shadow-[0_0_40px_rgba(234,179,8,0.05)] scanlines my-4">
                  <div className="flex justify-between items-start border-b border-neutral-900 pb-3">
                    <div>
                      <h4 className="text-[13px] font-black tracking-tighter font-tech text-white leading-none">ODIOS TELEMETRY</h4>
                      <span className="text-[7px] font-mono tracking-widest text-orange-400 uppercase">Live Circuit Data</span>
                    </div>
                    <span className="text-[8px] font-mono text-neutral-600 bg-neutral-950 px-1.5 py-0.5 border border-neutral-900">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-6 my-auto relative z-10">
                    <div>
                      <span className="text-[8px] font-mono text-neutral-500 block uppercase tracking-wider">PILOT CALLSIGN</span>
                      <div className="text-lg font-extrabold font-sans tracking-tight text-white truncate">
                        {driverStats.username}
                      </div>
                      <span className={`inline-block border text-[7px] px-1 py-0.5 uppercase tracking-wider mt-1 font-mono font-bold ${currentRank.color}`}>
                        {currentRank.title}
                      </span>
                    </div>

                    <div className="bg-neutral-950/80 border border-neutral-900 p-3 shadow-inner">
                      <span className="text-[8px] font-mono text-neutral-400 block uppercase tracking-wide">LAP TIME SUMMARY</span>
                      <div className="text-3xl font-black font-tech text-orange-400 tracking-tighter mt-0.5">
                        {latestLap ? `${latestLap.lap_time_seconds.toFixed(3)}s` : 'STAGE_READY'}
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-neutral-500 mt-1">
                        <span>CHASSIS #{latestLap?.karts?.kart_number || '??'}</span>
                        <span className="text-emerald-400">+{latestLap?.xp_earned || 0} XP</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <div className="border border-neutral-900 bg-neutral-950/40 p-2 text-center">
                        <span className="text-[7px] text-neutral-500 block uppercase">RANK STAGE</span>
                        <span className="text-xs font-bold text-white font-tech tracking-wide">LVL {driverStats.current_level}</span>
                      </div>
                      <div className="border border-neutral-900 bg-neutral-950/40 p-2 text-center">
                        <span className="text-[7px] text-neutral-500 block uppercase">STREAK TIER</span>
                        <span className="text-xs font-bold text-orange-400 font-tech tracking-wide">🔥 TIER {driverStats.streak_tier}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-900 pt-3 flex flex-col items-center">
                    <div className="text-[8px] font-bold font-tech tracking-widest text-neutral-400">WWW.ODIOSRACING.COM</div>
                    <div className="text-[6px] font-mono text-neutral-600 uppercase tracking-widest mt-0.5">
                      Engineered via NIT Calicut
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-orange-500/5 pointer-events-none m-1"></div>
                </div>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs font-bold py-3 uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
                >
                  <span>{shareStatus}</span>
                </button>
              </div>

              <div className="glass p-6 border border-neutral-800 bg-neutral-950/30">
                <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-4">// UNLOCKED ACHIEVEMENT INSIGNIAS</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {BADGE_RULES.map(badge => {
                    const status = badge.req(driverStats);
                    return (
                      <div key={badge.id} className={`border p-3 flex items-center space-x-3 ${status ? 'border-neutral-800 bg-black/60' : 'border-neutral-950 opacity-20 select-none'}`}>
                        <div className={`w-8 h-8 flex items-center justify-center font-tech font-bold border ${status ? 'bg-red-950/50 text-red-500 border-red-900' : 'bg-neutral-950 border-neutral-800 text-neutral-700'}`}>
                          {status ? '✓' : '🔒'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold font-tech tracking-wide text-white">{badge.name}</h4>
                          <p className="text-[10px] text-neutral-400 font-sans mt-0.5">{badge.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className="glass p-6 border border-neutral-800 bg-neutral-950/40">
            <div className="border-l-2 border-red-500 pl-3 mb-6">
              <h2 className="text-md font-bold font-tech uppercase tracking-wider">GLOBAL BLACKLIST TOP SPEED LEAGUE</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 bg-neutral-950/80">
                    <th className="p-3 w-16 text-center">POS</th>
                    <th className="p-3">PILOT TRACK NAME</th>
                    <th className="p-3">CIRCUIT NODE</th>
                    <th className="p-3 text-right">TOTAL ENERGY SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length > 0 ? (
                    leaderboard.map((row) => (
                      <tr key={row.rank_position} className="border-b border-neutral-900 hover:bg-neutral-950/40">
                        <td className="p-3 text-center">
                          <span className={`inline-block w-5 py-0.5 text-[10px] font-bold font-tech ${row.rank_position === 1 ? 'bg-red-600 text-white' : 'bg-neutral-900 text-neutral-500'}`}>
                            #{row.rank_position}
                          </span>
                        </td>
                        <td className="p-3 font-sans font-bold text-white">
                          {row.profiles?.username} <span className="text-[9px] font-mono font-normal text-neutral-500 ml-2">LVL {row.profiles?.current_level}</span>
                        </td>
                        <td className="p-3 text-neutral-400 uppercase tracking-tight">{row.tracks?.name || 'MAIN TRACK'}</td>
                        <td className="p-3 text-right font-bold text-red-500 tracking-wider">{row.profiles?.total_xp} XP</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-neutral-600 uppercase tracking-widest">[ SEEDING POSITIONS PENDING ]</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="glass p-6 border border-neutral-800 bg-neutral-950/40">
            <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-4">// YOUR RECENT TIMING LOGS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {personalLaps.length > 0 ? (
                personalLaps.map(lap => (
                  <div key={lap.id} className="border border-neutral-900 bg-neutral-950 p-3.5 flex justify-between items-center font-mono text-xs">
                    <div>
                      <div className="text-white font-bold text-sm tracking-widest">{lap.lap_time_seconds.toFixed(3)}s</div>
                      <div className="text-[9px] text-neutral-500 mt-0.5">CHASSIS MACHINE #{lap.karts?.kart_number || '??'}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">+{lap.xp_earned} XP</span>
                      <div className="text-[9px] text-neutral-600 mt-0.5">{new Date(lap.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 border border-dashed border-neutral-900 p-8 text-center text-[10px] font-mono text-neutral-600 uppercase">
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