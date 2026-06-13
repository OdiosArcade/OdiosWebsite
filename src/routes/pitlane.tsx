import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/pitlane')({
  component: PitLaneMonitor,
});

interface QueueItem {
  kart_id: string;
  profile_id: string;
  total_laps_allocated: number;
  laps_remaining: number;
  assigned_at: string;
  profiles: { username: string; current_level: number } | null;
  karts: { kart_number: number } | null;
}

function PitLaneMonitor() {
  const [activeQueue, setActiveQueue] = useState<QueueItem[]>([]);
  const [sysTime, setSysTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setSysTime(new Date().toLocaleTimeString());
    }, 1000);

    fetchLiveQueue();

    const queueSubscription = supabase
      .channel('live_pit_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'active_assignments' },
        () => {
          fetchLiveQueue();
        }
      )
      .subscribe();

    return () => {
      clearInterval(clockInterval);
      supabase.removeChannel(queueSubscription);
    };
  }, []);

  const fetchLiveQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('active_assignments')
        .select(`
          kart_id,
          profile_id,
          total_laps_allocated,
          laps_remaining,
          assigned_at,
          profiles ( username, current_level ),
          karts ( kart_number )
        `)
        .gt('laps_remaining', 0)
        .order('assigned_at', { ascending: true });

      if (data) {
        setActiveQueue(data as unknown as QueueItem[]);
      }
      if (error) console.error('Queue connection dropped:', error);
    } catch (err) {
      console.error('System fetching failure:', err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 grid-bg scanlines">
      <header className="border-b-4 border-yellow-500 bg-black p-6 mb-8 flex justify-between items-center shadow-md">
        <div>
          <span className="bg-yellow-500 text-black px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase">
            GARAGE HUD MONITOR
          </span>
          <h1 className="text-3xl font-extrabold tracking-tighter font-tech text-white mt-1">
            PIT LANE DISPATCH QUEUE
          </h1>
        </div>
        <div className="text-right font-mono">
          <div className="text-2xl font-bold text-yellow-400 font-tech tracking-widest">{sysTime}</div>
          <div className="text-[10px] text-neutral-500 tracking-wider">SYSTEM NODE: LOCAL_PIT_01</div>
        </div>
      </header>

      <main className="space-y-6">
        {activeQueue.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {activeQueue.map((item, index) => (
              <div 
                key={item.kart_id} 
                className={`border-2 p-5 flex flex-col md:flex-row justify-between items-stretch md:items-center bg-black/80 transition-all ${
                  index === 0 
                    ? 'border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.15)] bg-gradient-to-r from-yellow-950/20 to-transparent' 
                    : 'border-neutral-800'
                }`}
              >
                <div className="flex items-center space-x-6 mb-4 md:mb-0">
                  <div className={`w-14 h-14 flex flex-col items-center justify-center font-tech font-extrabold text-2xl ${
                    index === 0 ? 'bg-yellow-500 text-black' : 'bg-neutral-900 text-neutral-400 border border-neutral-700'
                  }`}>
                    <span className="text-[9px] font-mono block -mb-1 tracking-tight">POS</span>
                    {index + 1}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold tracking-wide text-white">
                      {item.profiles?.username || 'GUEST_RACER'}
                    </h2>
                    <p className="text-xs font-mono text-neutral-400 mt-0.5">
                      STATUS: <span className="text-neutral-300">LEVEL {item.profiles?.current_level || 1}</span> 
                      <span className="text-neutral-600 mx-2">|</span> 
                      STAMP: <span className="text-neutral-500">{new Date(item.assigned_at).toLocaleTimeString()}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-8 border-t md:border-t-0 border-neutral-800 pt-4 md:pt-0">
                  <div className="text-left md:text-center px-4">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500">ASSIGNED CHASSIS</span>
                    <span className="text-2xl font-black font-tech text-orange-400 tracking-wide">
                      KART #{item.karts?.kart_number || '??'}
                    </span>
                  </div>

                  <div className="text-left md:text-center px-4 border-l border-neutral-800">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500">LAPS RUNWAY</span>
                    <span className="text-xl font-bold font-mono text-emerald-400 tracking-wider">
                      {item.laps_remaining} <span className="text-xs text-neutral-400 font-sans text-white">/ {item.total_laps_allocated} REMAINING</span>
                    </span>
                  </div>

                  <div className="hidden lg:block text-right pl-4 border-l border-neutral-800 font-mono text-[10px] text-neutral-500">
                    <div>HARDWARE_ID: <span className="text-neutral-400">{item.kart_id}</span></div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center justify-end">
                  {index === 0 ? (
                    <span className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 px-4 py-2 font-mono text-xs font-bold tracking-widest animate-pulse uppercase">
                      ➔ NEXT RACER GO TO LAUNCH PAD
                    </span>
                  ) : (
                    <span className="bg-neutral-900 border border-neutral-800 text-neutral-500 px-4 py-2 font-mono text-xs uppercase tracking-wider">
                      STAGED IN PIT LOCK
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-neutral-800 bg-neutral-950 p-20 text-center shadow-inner">
            <div className="w-16 h-16 border-4 border-t-yellow-500 border-neutral-800 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-lg font-bold uppercase font-tech text-neutral-400 tracking-wider">
              Awaiting Race Director Clearances...
            </h3>
          </div>
        )}
      </main>
    </div>
  );
}