import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/telemetry')({
  component: TelemetryTerminal,
});

interface TrackAsset {
  id: string;
  name: string;
}

interface ActiveAssignment {
  id: number; // 🌟 Crucial fix: Track the unique row ID entry
  kart_id: string;
  profile_id: string;
  total_laps_allocated: number;
  laps_remaining: number;
  assigned_at: string;
  profiles: { username: string } | null;
  karts: { kart_number: number } | null;
}

function TelemetryTerminal() {
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<TrackAsset[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [activeHeats, setActiveHeats] = useState<ActiveAssignment[]>([]);

  useEffect(() => {
    fetchAvailableTracks();
  }, []);

  useEffect(() => {
    if (selectedTrackId) {
      fetchLiveTrackTelemetry(selectedTrackId);
      
      // Establish real-time database subscription channel 
      // to stream live updates whenever a kart crosses the line
      const telemetrySubscription = supabase
        .channel('live-telemetry-feed')
        .on(
          'postgres_changes', 
          { event: '*', schema: 'public', table: 'active_assignments' }, 
          () => fetchLiveTrackTelemetry(selectedTrackId)
        )
        .subscribe();

      return () => {
        supabase.removeChannel(telemetrySubscription);
      };
    }
  }, [selectedTrackId]);

  const fetchAvailableTracks = async () => {
    const { data } = await supabase.from('tracks').select('id, name');
    if (data) {
      setTracks(data as TrackAsset[]);
      if (data.length > 0) setSelectedTrackId(data[0].id);
    }
  };

  const fetchLiveTrackTelemetry = async (trackId: string) => {
    try {
      const { data } = await supabase
        .from('active_assignments')
        .select(`
          id,
          kart_id,
          profile_id,
          total_laps_allocated,
          laps_remaining,
          assigned_at,
          profiles ( username ),
          karts ( kart_number )
        `) // 🌟 Crucial fix: Selected the unique row 'id' column from Supabase
        .eq('track_id', trackId)
        .gt('laps_remaining', 0)
        .order('assigned_at', { ascending: true });

      if (data) setActiveHeats(data as unknown as ActiveAssignment[]);
    } catch (err) {
      console.error('Error fetching stream data metrics:', err);
    }
  };

  // 🏁 THE HARDWARE TRANSPONDER SIMULATION ENGINE
  const handleHardwareTransponderTrigger = async (session: ActiveAssignment) => {
    const splitInput = window.prompt(`🛰️ HARDWARE SIMULATOR [CHASSIS #${session.karts?.kart_number}]:\nEnter simulated pass timing result in seconds:`, "21.850");
    if (!splitInput) return;

    const parsedTime = parseFloat(splitInput);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      alert("⚠️ Invalid telemetry notation string format.");
      return;
    }

    setLoading(true);
    try {
      // 1. Fire completed loop time straight into database
      const { error: lapError } = await supabase
        .from('lap_records')
        .insert({
          profile_id: session.profile_id,
          track_id: selectedTrackId,
          kart_id: session.kart_id,
          lap_time_seconds: parsedTime
        });

      if (lapError) throw lapError;

      // 2. Decrement session remaining loops value counts
      const remainingLaps = session.laps_remaining - 1;

      if (remainingLaps <= 0) {
        // 🌟 Crucial fix: Only drop the specific completed ticket assignment row using its unique ID
        await supabase
          .from('active_assignments')
          .delete()
          .eq('id', session.id);
      } else {
        // 🌟 Crucial fix: Safely update only the active driver's lap metric using its unique row ID
        await supabase
          .from('active_assignments')
          .update({ laps_remaining: remainingLaps })
          .eq('id', session.id);
      }

      await fetchLiveTrackTelemetry(selectedTrackId);
    } catch (err: any) {
      alert(`⚠️ Simulation failure event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 grid-bg scanlines">
      <header className="border-b border-neutral-800 pb-4 mb-8 flex justify-between items-center">
        <div>
          <span className="bg-emerald-600 text-black font-mono px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">HARDWARE INTERFACE CORE</span>
          <h1 className="text-2xl font-bold font-tech tracking-wide mt-1">ODIOS LIVE TELEMETRY MATRIX</h1>
        </div>
        
        {/* CIRCUIT FILTER INTERFACE CONTROLLER */}
        <div className="w-64 font-mono text-xs">
          <select 
            value={selectedTrackId} 
            onChange={(e) => setSelectedTrackId(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 p-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
          >
            <option value="">-- CHOOSE TARGET MONITOR --</option>
            {tracks.map(t => <option key={t.id} value={t.id}>{t.name.toUpperCase()}</option>)}
          </select>
        </div>
      </header>

      {/* TRACK RUNNING QUEUE FEEDS LAYOUT */}
      <section className="glass p-6 border border-neutral-800 bg-neutral-950/20">
        <div className="border-l-2 border-emerald-500 pl-3 mb-6">
          <h2 className="text-md font-bold uppercase font-tech tracking-wider">// Live Track Transponder Stream</h2>
          <p className="text-xs text-neutral-500 font-mono">Displays live machine arrays tracking on currently selected loop grid nodes.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 bg-black">
                <th className="p-3">GRID CHASSIS</th>
                <th className="p-3">PILOT CALLESIGN</th>
                <th className="p-3 text-center">COMPLETED LAP FEED STATUS</th>
                <th className="p-3 text-right">TRANSPONDER LOOP INTERCEPTOR</th>
              </tr>
            </thead>
            <tbody>
              {activeHeats.map((heat) => (
                <tr key={heat.id} className="border-b border-neutral-900 hover:bg-neutral-950/40">
                  <td className="p-3 text-orange-400 font-bold font-tech">CHASSIS #{heat.karts?.kart_number}</td>
                  <td className="p-3 text-white font-sans font-bold">{heat.profiles?.username}</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">
                    {heat.total_laps_allocated - heat.laps_remaining} / {heat.total_laps_allocated} LAPS COMPLETED
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleHardwareTransponderTrigger(heat)}
                      disabled={loading}
                      className="bg-emerald-950/40 border border-emerald-800 text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold text-[10px] px-3 py-1.5 uppercase transition-all tracking-wider"
                    >
                      📡 SIMULATE ANTENNA LOOP CROSS
                    </button>
                  </td>
                </tr>
              ))}
              {activeHeats.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-neutral-600 uppercase tracking-widest bg-black/20">
                    [ NO KARTS REGISTERED ON THIS CIRCUIT LOOP WINDOW ]
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
