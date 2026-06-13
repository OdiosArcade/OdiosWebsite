import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/operator')({
  component: OperatorDashboard,
});

const useToast = () => {
  return {
    toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
      console.log(`[SYSTEM NOTIFICATION]: ${title} - ${description}`);
      alert(`${variant === 'destructive' ? '⚠️ ERROR: ' : '✅ SUCCESS: '}\n\n${title}\n${description}`);
    }
  };
};

interface Profile {
  id: string;
  username: string;
  wallet_balance_laps: number;
}

interface KartDeployment {
  kart_id: string;
  karts: {
    kart_number: number;
    status: string;
  } | null;
}

interface Assignment {
  kart_id: string;
  profile_id: string;
  total_laps_allocated: number;
  laps_remaining: number;
  assigned_at: string;
  profiles: { username: string } | null;
  karts: { kart_number: number } | null;
}

interface LiveShiftContext {
  assignmentId: string;
  trackId: string;
  trackName: string;
}

function OperatorDashboard() {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [activeShift, setActiveShift] = useState<LiveShiftContext | null>(null);
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [deployedKarts, setDeployedKarts] = useState<KartDeployment[]>([]);
  const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);

  const [nfcTagId, setNfcTagId] = useState('');
  const [scannedProfile, setScannedProfile] = useState<Profile | null>(null);
  const [topUpLaps, setTopUpLaps] = useState<number>(0);

  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedKartId, setSelectedKartId] = useState('');
  const [allocatedLaps, setAllocatedLaps] = useState<number>(10);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSessionUser(session.user);
        verifyShiftAccess(session.user.id);
      } else {
        setAuthLoading(false);
      }
    });
  }, []);

  const handleOperatorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(`⚠️ Access Denied: ${error.message}`);
        setAuthLoading(false);
        return;
      }
      if (data?.user) {
        setSessionUser(data.user);
        await verifyShiftAccess(data.user.id);
      }
    } catch (err: any) {
      alert(`⚠️ Authentication Exception: ${err.message}`);
      setAuthLoading(false);
    }
  };

  const handleOperatorLogout = async () => {
    await supabase.auth.signOut();
    setSessionUser(null);
    setActiveShift(null);
    setScannedProfile(null);
    setNfcTagId('');
    setAuthLoading(false);
  };

  const verifyShiftAccess = async (userId: string) => {
    try {
      const { data: shiftData, error: shiftError } = await supabase
        .from('track_assignments')
        .select('id, track_id, tracks ( name )')
        .eq('operator_id', userId)
        .eq('shift_status', 'active')
        .maybeSingle();

      if (shiftError || !shiftData) {
        setActiveShift(null);
        setAuthLoading(false);
        return;
      }

      const trackMeta = shiftData.tracks as unknown as { name: string } | null;
      const context = {
        assignmentId: shiftData.id,
        trackId: shiftData.track_id,
        trackName: trackMeta?.name || 'Assigned Track'
      };

      setActiveShift(context);
      await fetchTrackSpecificData(context.trackId);
    } catch (err) {
      console.error('Security verification error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchTrackSpecificData = async (trackId: string) => {
    try {
      // 1. Fetch ONLY karts physically deployed to THIS track
      const { data: kartsData } = await supabase
        .from('kart_deployments')
        .select('kart_id, karts(kart_number, status)')
        .eq('track_id', trackId)
        .eq('deployment_status', 'active');
      
      if (kartsData) setDeployedKarts(kartsData as unknown as KartDeployment[]);

      // 2. Fetch all drivers
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, wallet_balance_laps');
      if (profilesData) setProfiles(profilesData as Profile[]);

      // 3. Fetch assignments ONLY for this track
      const { data: assignmentsData } = await supabase
        .from('active_assignments')
        .select(`
          kart_id,
          profile_id,
          total_laps_allocated,
          laps_remaining,
          assigned_at,
          profiles ( username ),
          karts ( kart_number )
        `)
        .eq('track_id', trackId)
        .gt('laps_remaining', 0)
        .order('assigned_at', { ascending: false });
      
      if (assignmentsData) setActiveAssignments(assignmentsData as unknown as Assignment[]);
    } catch (error) {
      console.error('Data hydration error:', error);
    }
  };

  // 💳 FIXED NFC TAG LOOKUP PIPELINE
  const handleCardLookup = async (tagId: string) => {
    setNfcTagId(tagId);
    if (!tagId || tagId.trim().length < 2) {
      setScannedProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, wallet_balance_laps')
        .eq('nfc_tag_id', tagId.trim())
        .maybeSingle();

      if (error) {
        console.error("NFC Query Error:", error);
        return;
      }

      if (data) {
        setScannedProfile(data as Profile);
      } else {
        setScannedProfile(null);
      }
    } catch (err) {
      console.error("Card tracking fail:", err);
    }
  };

  // 📝 FIXED NFC TOP-UP STATE MANAGEMENT LOGIC
  const handleProcessTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedProfile || topUpLaps <= 0) return;
    setLoading(true);

    try {
      const targetProfileId = scannedProfile.id;
      const currentBalance = scannedProfile.wallet_balance_laps || 0;
      const totalUpdatedBalance = currentBalance + topUpLaps;

      const { error } = await supabase
        .from('profiles')
        .update({ wallet_balance_laps: totalUpdatedBalance })
        .eq('id', targetProfileId);

      if (error) throw error;

      toast({ title: "Credits Loaded", description: `Added ${topUpLaps} laps to account loops.` });
      setTopUpLaps(0);
      
      // Force refresh data models using our current track reference context keys
      if (activeShift) {
        await fetchTrackSpecificData(activeShift.trackId);
      }

      // Re-trigger visual NFC register verification display state
      const { data: refreshedProfile } = await supabase
        .from('profiles')
        .select('id, username, wallet_balance_laps')
        .eq('id', targetProfileId)
        .single();

      if (refreshedProfile) {
        setScannedProfile(refreshedProfile as Profile);
      }
    } catch (err: any) {
      alert(`⚠️ NFC Balance Committing Failure: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCommitHeatAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift || !selectedDriverId || !selectedKartId || allocatedLaps <= 0) return;

    const driver = profiles.find(p => p.id === selectedDriverId);
    if (!driver || driver.wallet_balance_laps < allocatedLaps) {
      toast({ title: "Low Balance", description: "Driver lacks enough credits.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error: assignError } = await supabase.from('active_assignments').upsert([{
      kart_id: selectedKartId,
      profile_id: selectedDriverId,
      track_id: activeShift.trackId,
      total_laps_allocated: allocatedLaps,
      laps_remaining: allocatedLaps
    }]);

    if (!assignError) {
      await supabase.from('profiles').update({ wallet_balance_laps: driver.wallet_balance_laps - allocatedLaps }).eq('id', selectedDriverId);
      toast({ title: "Heat Ready", description: "Kart dispatched to transponder loop." });
      setSelectedDriverId('');
      setSelectedKartId('');
      fetchTrackSpecificData(activeShift.trackId);
    }
    setLoading(false);
  };

  if (authLoading) return <div className="min-h-screen bg-black text-orange-500 flex items-center justify-center font-mono text-xs tracking-widest scanlines">[ DECRYPTING STATION SIGNATURE... ]</div>;

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-black text-white p-6 grid-bg scanlines flex items-center justify-center">
        <form onSubmit={handleOperatorLogin} className="glass p-8 w-full max-w-md border border-neutral-800 bg-black/90">
          <div className="border-l-2 border-orange-500 pl-3 mb-6">
            <h1 className="text-xl font-bold font-tech tracking-wider uppercase">STATION SIGN-IN</h1>
          </div>
          <div className="space-y-4 font-mono text-xs">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-neutral-950 border border-neutral-800 p-3 text-white focus:outline-none focus:border-orange-500" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-neutral-950 border border-neutral-800 p-3 text-white focus:outline-none focus:border-orange-500" required />
            <button type="submit" className="w-full bg-white text-black py-3 font-bold uppercase tracking-widest">⚡ BOOT TERMINAL</button>
          </div>
        </form>
      </div>
    );
  }

  if (!activeShift) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center font-mono p-6 text-center scanlines">
        <div className="border border-red-900 bg-red-950/20 max-w-md p-8 space-y-4">
          <span className="bg-red-600 text-black font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider">TERMINAL LOCKOUT</span>
          <h2 className="text-lg font-bold text-white tracking-wide uppercase font-tech">NO ACTIVE SHIFT FOUND</h2>
          <p className="text-xs text-neutral-400">Your profile is not assigned to an active track node right now.</p>
          <button onClick={handleOperatorLogout} className="border border-neutral-800 bg-black px-4 py-2 text-[10px] text-neutral-500 hover:text-red-500">DISCONNECT</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 grid-bg scanlines">
      <header className="border-b border-neutral-800 pb-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wider font-tech">ODIOS RACING SYSTEM</h1>
          <p className="text-xs text-neutral-400 font-mono tracking-widest uppercase">● STATION PIT LANE HUB // {activeShift.trackName}</p>
        </div>
        <button onClick={handleOperatorLogout} className="border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-[10px] text-neutral-500 hover:text-red-500 font-mono transition-colors">► LOGOUT STATION</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* CARD TOP UP SECTION */}
        <section className="glass p-6 border border-neutral-800 bg-neutral-950/40">
          <div className="border-l-2 border-orange-500 pl-3 mb-6">
            <h2 className="text-sm font-bold font-mono text-neutral-400 uppercase">01 // CARD BINDING & RECHARGE</h2>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500">Scan physical NFC card transponder string</label>
            <input 
              type="text" 
              value={nfcTagId} 
              onChange={(e) => handleCardLookup(e.target.value)} 
              placeholder="Scan or Type NFC Tag Key..." 
              className="w-full bg-black border border-neutral-800 px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-orange-500" 
            />
            
            {scannedProfile ? (
              <form onSubmit={handleProcessTopUp} className="bg-black border border-neutral-800 p-4 space-y-4 animate-fade-in">
                <div className="flex justify-between text-[11px] font-mono text-neutral-400 uppercase border-b border-neutral-900 pb-2">
                  <span>Pilot: <b className="text-white">{scannedProfile.username}</b></span>
                  <span>Wallet: <b className="text-orange-400">{scannedProfile.wallet_balance_laps || 0} LAPS</b></span>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-2">Input Laps Amount to Inject</label>
                  <input 
                    type="number" 
                    value={topUpLaps || ''} 
                    onChange={(e) => setTopUpLaps(parseInt(e.target.value) || 0)} 
                    placeholder="e.g. 10" 
                    className="w-full bg-neutral-900 border border-neutral-800 p-2.5 text-sm text-white font-mono focus:outline-none focus:border-orange-500" 
                    required 
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-white text-black uppercase font-mono font-bold py-2.5 text-xs hover:bg-neutral-200 transition-colors">
                  {loading ? 'SYNCING TRANSACTION...' : '► SECURELY ADD LAPS'}
                </button>
              </form>
            ) : (
              <div className="border border-dashed border-neutral-900 p-6 text-center text-xs font-mono text-neutral-600">
                {nfcTagId ? '[ NO REGISTERED DRIVER MATCHES THIS NFC TAG STRING ]' : '[ PLACE PHYSICAL DEVICE HANDSET OVER SENSOR TRANSFERS ]'}
              </div>
            )}
          </div>
        </section>

        {/* FLEET ALLOCATION SECTION */}
        <section className="glass p-6 border border-neutral-800 bg-neutral-950/40">
          <div className="border-l-2 border-orange-500 pl-3 mb-6">
            <h2 className="text-sm font-bold font-mono text-neutral-400 uppercase">02 // FLEET ALLOCATION ({activeShift.trackName})</h2>
          </div>
          <form onSubmit={handleCommitHeatAllocation} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] text-neutral-500 uppercase mb-1">Target Pilot Driver</label>
              <select value={selectedDriverId} onChange={(e) => setSelectedDriverId(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 text-white focus:outline-none focus:border-orange-500 font-mono" required>
                <option value="">-- SELECT PILOT --</option>
                {profiles.map(p => <option key={p.id} value={p.id}>{p.username} ({p.wallet_balance_laps || 0} Laps)</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-neutral-500 uppercase mb-1">Station Deployed Go-Kart</label>
              <select value={selectedKartId} onChange={(e) => setSelectedKartId(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 text-white focus:outline-none focus:border-orange-500 font-mono" required>
                <option value="">-- CHOOSE LOCAL CHASSIS --</option>
                {deployedKarts.map(dk => (
                  <option key={dk.kart_id} value={dk.kart_id}>CHASSIS #{dk.karts?.kart_number} ({dk.kart_id})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-neutral-500 uppercase mb-1">Heat Session Lap Credit</label>
              <input type="number" value={allocatedLaps} onChange={(e) => setAllocatedLaps(parseInt(e.target.value) || 0)} min="1" className="w-full bg-black border border-neutral-800 p-3 text-white focus:outline-none focus:border-orange-500" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-orange-500 text-black uppercase font-bold py-3 transition-transform font-mono tracking-wider">⚡ DISPATCH HEAT</button>
          </form>
        </section>
      </div>

      {/* LIVE STATION ASSIGNMENTS REGISTER */}
      <section className="glass p-6 border border-neutral-800 bg-neutral-950/20">
        <h3 className="text-xs font-bold uppercase font-mono mb-4 text-neutral-500">// ACTIVE HEATS ON {activeShift.trackName.toUpperCase()}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500 bg-black">
                <th className="p-3">TIME</th>
                <th className="p-3">PILOT</th>
                <th className="p-3">CHASSIS</th>
                <th className="p-3 text-center">REMAINING STATUS</th>
              </tr>
            </thead>
            <tbody>
              {activeAssignments.map((session, index) => (
                <tr key={`${session.kart_id}-${index}`} className="border-b border-neutral-900 hover:bg-neutral-950/40">
                  <td className="p-3 text-neutral-600">{new Date(session.assigned_at).toLocaleTimeString()}</td>
                  <td className="p-3 text-white font-bold">{session.profiles?.username || 'Guest Pilot'}</td>
                  <td className="p-3 text-orange-400 font-bold">#{session.karts?.kart_number || '??'}</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">{session.laps_remaining} / {session.total_laps_allocated} LAPS</td>
                </tr>
              ))}
              {activeAssignments.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-neutral-700">[ PIT LANE EMPTY - CHASSIS STAGED ]</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}