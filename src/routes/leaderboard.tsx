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
    <div className="min-h-screen bg-black text-white p-6 grid-bg scanlines">
      
      {/* HEADER BANNER SECTION */}
      <header className="border-b border-neutral-800 pb-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <span className="bg-red-600 text-white font-mono px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase animate-pulse">
            CRITERION LEAGUE DATA ARRAYS
          </span>
          <h1 className="text-3xl font-extrabold tracking-wider font-tech text-white mt-1">THE ODIOS LEADERBOARDS</h1>
        </div>
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
          NODE // LIVE_RACER_ standings
        </p>
      </header>

      {/* METRIC GRIDS WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMN 1: REQUIREMENT 1 - TRACK CHAMPIONS GRID MATRIX */}
        <section className="glass p-6 border border-neutral-800 bg-neutral-950/40 rounded-none h-fit">
          <div className="border-l-2 border-red-600 pl-3 mb-6">
            <h2 className="text-sm font-bold font-tech uppercase tracking-wide text-white">01 // Circuit Champions</h2>
            <p className="text-[11px] text-neutral-500 font-mono">The reigning #1 fastest drivers on each track loop.</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {trackChampions.length > 0 ? (
              trackChampions.map((champ, index) => (
                <div key={`${champ.track_id}-${index}`} className="border border-red-900/30 bg-black/60 p-3 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] bg-red-950 text-red-400 border border-red-900 font-bold px-1 py-0.5 rounded-none block w-fit mb-1 uppercase">
                      🏁 {champ.tracks?.name || 'NODE REFUGE'}
                    </span>
                    <div className="text-white font-bold text-sm font-sans">{champ.profiles?.username}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-red-500 font-bold font-tech tracking-wide text-sm">{champ.profiles?.total_xp}</span>
                    <div className="text-[9px] text-neutral-500 uppercase tracking-tighter mt-0.5">SCORE TOTAL XP</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-600 uppercase tracking-widest border border-dashed border-neutral-900">
                [ NO TRACK RANK #1 FOUND ]
              </div>
            )}
          </div>
        </section>

        {/* COLUMN 2: REQUIREMENT 2 - TRACK INTERACTIVE BLACKLIST FILTER */}
        <section className="glass p-6 border border-neutral-800 bg-neutral-950/40 rounded-none h-fit">
          <div className="border-l-2 border-orange-500 pl-3 mb-4">
            <h2 className="text-sm font-bold font-tech uppercase tracking-wide text-white">02 // Circuit Specific Blacklist</h2>
            <p className="text-[11px] text-neutral-500 font-mono">Query entire standings across custom sector fields.</p>
          </div>

          {/* DYNAMIC DROP-DOWN PICKER TRACK ID LINK */}
          <div className="mb-6 font-mono text-xs">
            <label className="block text-[10px] uppercase text-neutral-500 mb-2 tracking-widest">// TARGET INTERACTIVE CIRCUIT NODE</label>
            <select
              value={selectedTrackId}
              onChange={(e) => setSelectedTrackId(e.target.value)}
              className="w-full bg-black border border-neutral-800 px-4 py-3 text-white font-mono focus:outline-none focus:border-orange-500 rounded-none"
            >
              <option value="">-- SELECT CIRCUIT NODE MAP --</option>
              {availableTracks.map(t => (
                <option key={t.id} value={t.id}>{t.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500 bg-black">
                  <th className="p-2 w-12 text-center uppercase">RANK</th>
                  <th className="p-2 uppercase">PILOT</th>
                  <th className="p-2 text-right uppercase">TOTAL SCORE</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlacklist.length > 0 ? (
                  filteredBlacklist.map((row) => (
                    <tr key={row.rank_position} className="border-b border-neutral-900 hover:bg-neutral-950/40 transition-colors">
                      <td className="p-2 text-center">
                        <span className={`inline-block px-1 py-0.5 text-[10px] font-bold ${row.rank_position === 1 ? 'bg-orange-500 text-black' : 'text-neutral-500 border border-neutral-800 bg-neutral-950'}`}>
                          #{row.rank_position}
                        </span>
                      </td>
                      <td className="p-2 text-white font-bold font-sans">
                        {row.profiles?.username}
                        <span className="font-mono text-[9px] text-neutral-600 block">LEVEL {row.profiles?.current_level}</span>
                      </td>
                      <td className="p-2 text-right text-orange-400 font-bold">{row.profiles?.total_xp} XP</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-neutral-700 uppercase tracking-wider">
                      {selectedTrackId ? '[ NO ACTIVE SPEEDS RECORDED ON CIRCUIT ]' : '[ SELECT NODE LAYER DROPDOWN ]'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* COLUMN 3: REQUIREMENT 3 - GLOBAL ELITE TOP 100 TOTAL XP STREAM */}
        <section className="glass p-6 border border-neutral-800 bg-neutral-950/40 rounded-none h-fit">
          <div className="border-l-2 border-purple-500 pl-3 mb-6">
            <h2 className="text-sm font-bold font-tech uppercase tracking-wide text-white">03 // Global Elite Rankings (Top 100)</h2>
            <p className="text-[11px] text-neutral-500 font-mono">Absolute leaderboard sorted by total lifetime points accruals.</p>
          </div>

          {/* STREAM TERMINAL CONTAINER WITH SCROLL OVERRIDES */}
          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-1.5 scrollbar-thin">
            {globalXpRank.length > 0 ? (
              globalXpRank.map((pilot, idx) => (
                <div key={pilot.id} className="border border-neutral-900 bg-neutral-950/80 p-2.5 flex justify-between items-center font-mono text-xs hover:border-purple-900/60 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-neutral-600 font-bold w-6 text-right">{(idx + 1).toString().padStart(2, '0')}</span>
                    <span className="text-white font-sans font-bold tracking-tight">{pilot.username}</span>
                  </div>
                  <div className="text-purple-400 font-bold font-tech tracking-wider text-sm">
                    {pilot.total_xp.toLocaleString()} <span className="text-[9px] text-neutral-600 font-mono">XP</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-neutral-700 uppercase tracking-widest">
                [ SYNCING GLOBAL NETWORK SCORES... ]
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}