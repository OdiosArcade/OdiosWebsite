import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/leaderboard')({
  component: BlacklistLeaderboard,
});

// Structural Interfaces
interface BlacklistRecord {
  rank_position: number;
  track_id: string;
  profiles: { username: string; current_level: number; total_xp: number } | null;
  tracks: { name: string } | null;
}

interface XpLeaderboardRecord {
  id: string;
  username: string;
  total_xp: number;
}

interface TrackItem {
  id: string;
  name: string;
}

function BlacklistLeaderboard() {
  const [loading, setLoading] = useState(false);
  
  // Requirement 1 State: #1 Drivers across all individual track nodes
  const [trackChampions, setTrackChampions] = useState<BlacklistRecord[]>([]);
  
  // Requirement 2 States: Track-specific filtering lists
  const [availableTracks, setAvailableTracks] = useState<TrackItem[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [filteredBlacklist, setFilteredBlacklist] = useState<BlacklistRecord[]>([]);
  
  // Requirement 3 State: Top 100 XP Leaderboard profiles
  const [globalXpRank, setGlobalXpRank] = useState<XpLeaderboardRecord[]>([]);

  useEffect(() => {
    fetchInitialLeaderboardData();
    fetchGlobalXpLeaderboard();
  }, []);

  // Re-fetch track specific blacklist rows whenever the dropdown index updates
  useEffect(() => {
    if (selectedTrackId) {
      fetchTrackSpecificBlacklist(selectedTrackId);
    } else {
      setFilteredBlacklist([]);
    }
  }, [selectedTrackId]);

  const fetchInitialLeaderboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch drop-down items context mapping references
      const { data: trackData } = await supabase.from('tracks').select('id, name');
      if (trackData) {
        setAvailableTracks(trackData as TrackItem[]);
        // Set first track as active default selection item if available
        if (trackData.length > 0) {
          setSelectedTrackId(trackData[0].id);
        }
      }

      // 2. REQUIREMENT 1: Fetch rank #1 entries across all track tables
      const { data: champData } = await supabase
        .from('blacklist_ranks')
        .select(`
          rank_position,
          track_id,
          profiles ( username, current_level, total_xp ),
          tracks ( name )
        `)
        .eq('rank_position', 1);

      if (champData) setTrackChampions(champData as unknown as BlacklistRecord[]);
    } catch (err) {
      console.error('Error compiling track records mapping framework:', err);
    } finally {
      setLoading(false);
    }
  };

  // REQUIREMENT 2: Fetch full list rankings restricted to a specific circuit node
  const fetchTrackSpecificBlacklist = async (trackId: string) => {
    try {
      const { data } = await supabase
        .from('blacklist_ranks')
        .select(`
          rank_position,
          track_id,
          profiles ( username, current_level, total_xp ),
          tracks ( name )
        `)
        .eq('track_id', trackId)
        .order('rank_position', { ascending: true });

      if (data) setFilteredBlacklist(data as unknown as BlacklistRecord[]);
    } catch (err) {
      console.error('Track split query error:', err);
    }
  };

  // REQUIREMENT 3: Fetch absolute Top 100 XP score accounts profiles registry
  const fetchGlobalXpLeaderboard = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, total_xp')
        .order('total_xp', { ascending: false })
        .limit(100);

      if (data) {
        // Enforce a bulletproof descending sort right on the client side 
        const sortedData = [...data].sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0));
        setGlobalXpRank(sortedData as XpLeaderboardRecord[]);
      }
    } catch (err) {
      console.error('Global elite loop sync pull drop error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8 grid-bg scanlines">
      
      {/* HEADER BANNER SECTION */}
      <header className="border-b border-border/40 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="bg-adrnln text-background font-dot px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase animate-pulse">
            CRITERION LEAGUE DATA ARRAYS
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight font-sans text-white mt-3 uppercase">THE ODIOS LEADERBOARDS</h1>
        </div>
        <p className="text-[10px] font-dot text-neutral-500 uppercase tracking-widest border border-border/20 bg-card/40 px-3 py-1.5 hidden sm:block">
          NODE // LIVE_RACER_ standings
        </p>
      </header>

      {/* METRIC GRIDS WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMN 1: REQUIREMENT 1 - TRACK CHAMPIONS GRID MATRIX */}
        <section className="lg:col-span-4 glass p-6 border border-border/40 bg-card/40 rounded-none h-fit shadow-lg relative overflow-hidden">
          <div className="border-l-4 border-adrnln pl-3 mb-6 relative z-10">
            <h2 className="text-sm font-bold font-sans uppercase tracking-widest text-white">01 // Circuit Champions</h2>
            <p className="text-[10px] text-neutral-500 font-dot tracking-widest mt-1 uppercase">Reigning #1 absolute lap holders.</p>
          </div>

          <div className="space-y-4 relative z-10">
            {trackChampions.length > 0 ? (
              trackChampions.map((champ, index) => (
                <div key={`${champ.track_id}-${index}`} className="border border-border/20 bg-background/60 p-4 flex justify-between items-center transition-all hover-lift hover:border-adrnln/40">
                  <div>
                    <span className="text-[9px] bg-adrnln/10 text-adrnln border border-adrnln/20 font-dot font-bold px-2 py-0.5 rounded-none block w-fit mb-2 uppercase tracking-widest">
                      🏁 {champ.tracks?.name || 'NODE REFUGE'}
                    </span>
                    <div className="text-white font-bold text-base font-sans truncate">{champ.profiles?.username}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-adrnln font-bold font-dot tracking-wider text-xl text-glow-adrnln">{champ.profiles?.total_xp}</span>
                    <div className="text-[9px] text-neutral-500 font-dot uppercase tracking-widest mt-0.5">TOTAL XP</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-[10px] text-neutral-600 uppercase font-dot tracking-widest border border-dashed border-border/20 bg-background/20">
                [ NO TRACK RANK #1 FOUND ]
              </div>
            )}
          </div>
          
          {/* Subtle background detail */}
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <span className="font-dot text-8xl font-black">01</span>
          </div>
        </section>

        {/* COLUMN 2: REQUIREMENT 2 - TRACK INTERACTIVE BLACKLIST FILTER */}
        <section className="lg:col-span-4 glass p-6 border border-border/40 bg-card/40 rounded-none h-fit shadow-lg relative overflow-hidden">
          <div className="border-l-4 border-neutral-500 pl-3 mb-6 relative z-10">
            <h2 className="text-sm font-bold font-sans uppercase tracking-widest text-white">02 // Circuit Blacklist</h2>
            <p className="text-[10px] text-neutral-500 font-dot tracking-widest mt-1 uppercase">Query entire circuit sector fields.</p>
          </div>

          {/* DYNAMIC DROP-DOWN PICKER TRACK ID LINK */}
          <div className="mb-6 relative z-10">
            <label className="block text-[10px] font-dot uppercase text-neutral-500 mb-2 tracking-widest">// TARGET INTERACTIVE CIRCUIT NODE</label>
            <div className="relative">
              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                className="w-full bg-background border border-border/40 px-4 py-3.5 text-white font-dot text-xs focus:outline-none focus:border-adrnln focus:ring-1 focus:ring-adrnln rounded-none appearance-none cursor-pointer transition-all shadow-inner relative z-10"
              >
                <option value="">-- SELECT CIRCUIT NODE MAP --</option>
                {availableTracks.map(t => (
                  <option key={t.id} value={t.id}>{t.name.toUpperCase()}</option>
                ))}
              </select>
              {/* Custom Dropdown Chevron for Technical Feel */}
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none z-20 text-adrnln font-dot text-xs">
                ▼
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 relative z-10">
            {/* Grid Header */}
            <div className="grid grid-cols-[3rem_1fr_5rem] gap-3 px-3 py-2.5 border-b border-border/40 text-[9px] font-dot text-neutral-500 uppercase tracking-widest bg-background/40">
              <div className="text-center">POS</div>
              <div>PILOT</div>
              <div className="text-right">SCORE</div>
            </div>
            
            {/* Grid Body */}
            {filteredBlacklist.length > 0 ? (
              filteredBlacklist.map((row) => (
                <div key={row.rank_position} className={`grid grid-cols-[3rem_1fr_5rem] gap-3 items-center px-3 py-3 border transition-all hover-lift ${row.rank_position === 1 ? 'border-adrnln/60 bg-adrnln/5 shadow-[0_0_15px_rgba(var(--color-adrnln),0.1)] glow-adrnln z-10 scale-[1.01]' : 'border-border/20 bg-background/60 hover:border-border/40'}`}>
                  <div className="text-center">
                    <span className={`inline-flex items-center justify-center w-7 h-7 text-[10px] font-bold font-dot ${row.rank_position === 1 ? 'bg-adrnln text-background shadow-md' : 'bg-background border border-border/40 text-neutral-400'}`}>
                      #{row.rank_position}
                    </span>
                  </div>
                  <div className="text-white font-bold font-sans text-sm truncate">
                    {row.profiles?.username}
                    <span className="font-dot text-[9px] text-neutral-600 block tracking-widest mt-0.5">LVL {row.profiles?.current_level}</span>
                  </div>
                  <div className={`text-right font-bold font-dot tracking-wider ${row.rank_position === 1 ? 'text-adrnln text-glow-adrnln' : 'text-neutral-300'}`}>
                    {row.profiles?.total_xp} XP
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[10px] font-dot text-neutral-600 uppercase tracking-widest border border-dashed border-border/20 bg-background/20 mt-2">
                {selectedTrackId ? '[ NO ACTIVE SPEEDS RECORDED ON CIRCUIT ]' : '[ SELECT NODE LAYER DROPDOWN ]'}
              </div>
            )}
          </div>
          
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <span className="font-dot text-8xl font-black">02</span>
          </div>
        </section>

        {/* COLUMN 3: REQUIREMENT 3 - GLOBAL ELITE TOP 100 TOTAL XP STREAM */}
        <section className="lg:col-span-4 glass p-6 border border-border/40 bg-card/40 rounded-none h-fit shadow-lg relative overflow-hidden">
          <div className="border-l-4 border-neutral-700 pl-3 mb-6 relative z-10">
            <h2 className="text-sm font-bold font-sans uppercase tracking-widest text-white">03 // Global Elite Pipeline</h2>
            <p className="text-[10px] text-neutral-500 font-dot tracking-widest mt-1 uppercase">Top 100 lifetime points accruals.</p>
          </div>

          {/* STREAM TERMINAL CONTAINER WITH SCROLL OVERRIDES */}
          <div className="max-h-[600px] overflow-y-auto pr-3 space-y-2 relative z-10 scrollbar-thin">
            {globalXpRank.length > 0 ? (
              globalXpRank.map((pilot, idx) => (
                <div key={pilot.id} className="border border-border/20 bg-background/40 p-3 flex justify-between items-center transition-all hover-lift hover:border-border/60 group">
                  <div className="flex items-center space-x-4 min-w-0">
                    <span className="font-dot text-neutral-600 text-xs w-5 text-right group-hover:text-neutral-400 transition-colors shrink-0">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-white font-sans font-bold tracking-wide text-sm truncate">
                      {pilot.username}
                    </span>
                  </div>
                  <div className="text-neutral-300 font-bold font-dot tracking-wider shrink-0 ml-2">
                    {pilot.total_xp.toLocaleString()} <span className="text-[9px] text-neutral-600 ml-0.5">XP</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-[10px] text-neutral-600 font-dot uppercase tracking-widest border border-dashed border-border/20 bg-background/20">
                [ SYNCING GLOBAL NETWORK SCORES... ]
              </div>
            )}
          </div>

          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <span className="font-dot text-8xl font-black">03</span>
          </div>
        </section>

      </div>
    </div>
  );
}