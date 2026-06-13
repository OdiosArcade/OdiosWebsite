import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/admin-portal')({
  component: OdiosAdminTerminal,
});

// Structural Interfaces
interface OperatorProfile {
  id: string;
  operator_name: string;
  secure_phone: string;
  is_active: boolean;
  created_at: string;
}

interface TrackAsset {
  id: string;
  name: string;
  location: string;
  track_record_seconds: number;
}

interface KartAsset {
  id: string;
  kart_number: number;
  status: 'active' | 'maintenance' | 'decommissioned';
  kart_deployments?: {
    id: string;
    deployment_status: string;
    tracks: { name: string } | null;
  }[];
}

interface ShiftAssignment {
  id: string;
  shift_status: string;
  assigned_at: string;
  tracks: { name: string } | null;
  operators: { operator_name: string } | null;
}

function OdiosAdminTerminal() {
  const [activeTab, setActiveTab] = useState<'operators' | 'tracks' | 'karts' | 'shifts'>('operators');
  const [operators, setOperators] = useState<OperatorProfile[]>([]);
  const [tracks, setTracks] = useState<TrackAsset[]>([]);
  const [karts, setKarts] = useState<KartAsset[]>([]);
  const [shifts, setShifts] = useState<ShiftAssignment[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Management States
  const [opEmail, setOpEmail] = useState('');
  const [opPassword, setOpPassword] = useState('');
  const [opName, setOpName] = useState('');
  const [opPhone, setOpPhone] = useState('');

  const [trackName, setTrackName] = useState('');
  const [trackLoc, setTrackLoc] = useState('');
  const [trackRecord, setTrackRecord] = useState('');

  const [kartId, setKartId] = useState('');
  const [kartNum, setKartNum] = useState('');

  // Deployment Form States
  const [deployTrackId, setDeployTrackId] = useState('');
  const [deployKartId, setDeployKartId] = useState('');

  const [selectedTrackId, setSelectedTrackId] = useState('');
  const [selectedOperatorId, setSelectedOperatorId] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'operators') {
        const { data } = await supabase.from('operators').select('*').order('created_at', { ascending: false });
        if (data) setOperators(data as OperatorProfile[]);
      } else if (activeTab === 'tracks') {
        const { data } = await supabase.from('tracks').select('*');
        if (data) setTracks(data as TrackAsset[]);
      } else if (activeTab === 'karts') {
        // Fetch static tracks to populate the deployment picker dropdown array
        const { data: tData } = await supabase.from('tracks').select('id, name');
        if (tData) setTracks(tData as TrackAsset[]);

        // Fetch karts with left-join relational data targeting active live deployments
        const { data } = await supabase
          .from('karts')
          .select(`
            id, 
            kart_number, 
            status,
            kart_deployments(id, deployment_status, tracks(name))
          `)
          .order('kart_number', { ascending: true });
        if (data) setKarts(data as unknown as KartAsset[]);
      } else if (activeTab === 'shifts') {
        const { data: tData } = await supabase.from('tracks').select('id, name');
        if (tData) setTracks(tData as TrackAsset[]);
        const { data: oData } = await supabase.from('operators').select('id, operator_name').eq('is_active', true);
        if (oData) setOperators(oData as OperatorProfile[]);

        const { data: sData } = await supabase
          .from('track_assignments')
          .select('id, shift_status, assigned_at, tracks ( name ), operators ( operator_name )')
          .order('shift_status', { ascending: true });
        if (sData) setShifts(sData as unknown as ShiftAssignment[]);
      }
    } catch (err) {
      console.error('High-command data pull error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 👤 FORM ACTIONS
  const handleCreateOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: opEmail,
        password: opPassword,
        options: { 
          data: { operator_name: opName, phone: opPhone, internal_role: 'operator' },
          emailRedirectTo: window.location.origin + '/operator'
        }
      });

      if (authError) throw authError;

      if (authData?.user) {
        const { error: opTableError } = await supabase.from('operators').insert({
          id: authData.user.id,
          operator_name: opName.trim(),
          secure_phone: opPhone.trim(),
          is_active: true
        });

        if (opTableError) throw opTableError;
        alert(`⚡ Operator identity [${opName}] securely synchronized across all tables.`);
        setOpEmail(''); setOpPassword(''); setOpName(''); setOpPhone('');
        fetchAdminData();
      }
    } catch (err: any) {
      alert(`⚠️ Registration Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('tracks').insert({
        id: crypto.randomUUID(),
        name: trackName,
        location: trackLoc,
        track_record_seconds: parseFloat(trackRecord) || 25.00
      });
      if (error) throw error;
      alert(`🏁 Circuit layout node successfully compiled.`);
      setTrackName(''); setTrackLoc(''); setTrackRecord('');
      fetchAdminData();
    } catch (err: any) {
      alert(`⚠️ Track Creation Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('karts').insert({
        id: kartId.trim().toUpperCase(),
        kart_number: parseInt(kartNum),
        status: 'active'
      });
      if (error) throw error;
      alert(`🏎️ Hardware chassis inventory logged.`);
      setKartId(''); setKartNum('');
      fetchAdminData();
    } catch (err: any) {
      alert(`⚠️ Hardware Index Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🏎️ LIVE HARDWARE DEPLOYMENT INTERCEPTOR
  const handleDeployKartToTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deployTrackId || !deployKartId) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('kart_deployments').upsert(
        {
          track_id: deployTrackId,
          kart_id: deployKartId,
          deployment_status: 'active'
        },
        { onConflict: 'kart_id' }
      );

      if (error) throw error;
      alert('🏎️ Chassis hardware asset successfully deployed to circuit transponder loop.');
      setDeployTrackId(''); setDeployKartId('');
      fetchAdminData();
    } catch (err: any) {
      alert(`⚠️ Hardware Deployment Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRecallKart = async (deploymentId: string) => {
    if (!window.confirm('Recall this kart chassis back to the master workshop storage array?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('kart_deployments').delete().eq('id', deploymentId);
      if (error) throw error;
      alert('✓ Kart recalled successfully from tracking loops.');
      fetchAdminData();
    } catch (err: any) {
      alert(`⚠️ Recall Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔗 RE-ENGINEERED SHIFT ALLOCATION (Clears index blockers automatically)
  const handleAssignShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Wipe out any pre-existing finished historical rows matching this pair to avoid unique constraint trips
      await supabase
        .from('track_assignments')
        .delete()
        .eq('track_id', selectedTrackId)
        .eq('operator_id', selectedOperatorId);

      // 2. Insert pristine active shift link tracking line cleanly
      const { error } = await supabase.from('track_assignments').insert({
        track_id: selectedTrackId,
        operator_id: selectedOperatorId,
        shift_status: 'active'
      });

      if (error) throw error;
      alert(`⚡ Shift assignment compiled successfully.`);
      setSelectedTrackId(''); setSelectedOperatorId('');
      fetchAdminData();
    } catch (err: any) {
      alert(`⚠️ Relational Mapping Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeassignShift = async (assignmentId: string) => {
    if (!window.confirm('⚠️ Secure Override: Terminate active shift rotation loop for this operator?')) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('track_assignments')
        .update({ shift_status: 'completed' })
        .eq('id', assignmentId);

      if (error) throw error;
      alert('✓ Shift marked COMPLETED.');
      fetchAdminData();
    } catch (err: any) {
      alert(`⚠️ Shift Update Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ HARDWARE & PROFILE REMOVAL OVERRIDES
  const handleRemoveOperator = async (opId: string, name: string) => {
    if (!window.confirm(`💥 CRITICAL OVERRIDE: Permanently delete Operator [${name}] and wipe credentials? This action cannot be undone.`)) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('operators').delete().eq('id', opId);
      if (error) throw error;
      alert(`✓ Operator [${name}] dropped from active directory ledger.`);
      fetchAdminData();
    } catch (err: any) {
      alert(`⚠️ Removal Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTrack = async (trackId: string, name: string) => {
    if (!window.confirm(`💥 CRITICAL OVERRIDE: Permanently delete Track Node [${name}]?`)) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('tracks').delete().eq('id', trackId);
      if (error) {
        if (error.code === '23503') {
          throw new Error('This track node has active historical telemetry logs (lap records) linked to it. Clear dependencies or set a status bypass rule first.');
        }
        throw error;
      }
      alert(`✓ Track Node [${name}] decommissioned and removed.`);
      fetchAdminData();
    } catch (err: any) {
      alert(`⚠️ Relational Restriction: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveKart = async (kartId: string) => {
    if (!window.confirm(`💥 CRITICAL OVERRIDE: Completely erase hardware chassis asset [${kartId}] from fleet registers?`)) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('karts').delete().eq('id', kartId);
      if (error) {
        if (error.code === '23503') {
          throw new Error('This go-kart chassis is hard-linked to logged telemetry splits. Set status to "decommissioned" instead to keep referential audit integrity intact.');
        }
        throw error;
      }
      alert(`✓ Hardware Chassis [${kartId}] dropped from fleet registry array.`);
      fetchAdminData();
    } catch (err: any) {
      alert(`⚠️ Hardware Restriction: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 grid-bg scanlines">
      <header className="border-b border-neutral-800 pb-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-orange-600 text-black font-mono px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">ROOT HIGH-COMMAND TERM</span>
          <h1 className="text-2xl font-bold font-tech tracking-wide text-white mt-1">ODIOS MANAGEMENT SYSTEM</h1>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {(['operators', 'tracks', 'karts', 'shifts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 uppercase tracking-wider border transition-all ${activeTab === tab ? 'bg-orange-500 text-black border-orange-500 font-bold' : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'}`}
            >
              // {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INPUT PANEL MODULES */}
        <div className="lg:col-span-1 space-y-6">
          {activeTab === 'operators' && (
            <form onSubmit={handleCreateOperator} className="glass p-6 border border-neutral-800 bg-neutral-950/80">
              <div className="border-l-2 border-orange-500 pl-2 mb-4">
                <h2 className="text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">PROVISION TRACK OPERATOR</h2>
              </div>
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Operator Callsign Handle</label>
                  <input type="text" value={opName} onChange={(e) => setOpName(e.target.value)} placeholder="e.g. op_marshall_alpha" className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-orange-500" required />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Secure Contact Phone</label>
                  <input type="text" value={opPhone} onChange={(e) => setOpPhone(e.target.value)} placeholder="+91..." className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-orange-500" required />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Direct Auth Email Link</label>
                  <input type="email" value={opEmail} onChange={(e) => setOpEmail(e.target.value)} placeholder="alpha@odios.com" className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-orange-500" required />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Secure Password Key</label>
                  <input type="password" value={opPassword} onChange={(e) => setOpPassword(e.target.value)} placeholder="••••••••" className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-orange-500" required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-white text-black py-3 font-bold uppercase tracking-widest text-center hover:bg-neutral-200">
                  ⚡ ENCRYPT & PROVISION
                </button>
              </div>
            </form>
          )}

          {activeTab === 'tracks' && (
            <form onSubmit={handleCreateTrack} className="glass p-6 border border-neutral-800 bg-neutral-950/80">
              <div className="border-l-2 border-cyan-500 pl-2 mb-4">
                <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">PROVISION HARDWARE CIRCUIT NODE</h2>
              </div>
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Circuit Location Name</label>
                  <input type="text" value={trackName} onChange={(e) => setTrackName(e.target.value)} placeholder="e.g. Apex Loop Node Alpha" className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-cyan-500" required />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Physical Arena Sub-Zone</label>
                  <input type="text" value={trackLoc} onChange={(e) => setTrackLoc(e.target.value)} placeholder="e.g. Sector-4 Stadium Complex" className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-cyan-500" required />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Circuit Record Target (Seconds)</label>
                  <input type="number" step="0.001" value={trackRecord} onChange={(e) => setTrackRecord(e.target.value)} placeholder="e.g. 23.850" className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-cyan-500" required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-cyan-500 text-black py-3 font-bold uppercase tracking-widest text-center hover:bg-cyan-400">
                  ⚡ COMPILE LAYOUT MAP
                </button>
              </div>
            </form>
          )}

          {activeTab === 'karts' && (
            <div className="space-y-6">
              {/* FLEET LOG COMPONENT */}
              <form onSubmit={handleCreateKart} className="glass p-6 border border-neutral-800 bg-neutral-950/80">
                <div className="border-l-2 border-emerald-500 pl-2 mb-4">
                  <h2 className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">LOG CHASSIS HARDWARE ASSET</h2>
                </div>
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase mb-1">Hardware Core Reference ID</label>
                    <input type="text" value={kartId} onChange={(e) => setKartId(e.target.value)} placeholder="e.g. KART-09" className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase mb-1">Chassis Graphical Number Badge</label>
                    <input type="number" value={kartNum} onChange={(e) => setKartNum(e.target.value)} placeholder="e.g. 9" className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-black py-3 font-bold uppercase tracking-widest text-center hover:bg-emerald-400">
                    ⚡ COMMENCE HARDWARE INDEX
                  </button>
                </div>
              </form>

              {/* NEW LIVE DEPLOYMENT CONTROLLER FORM */}
              <form onSubmit={handleDeployKartToTrack} className="glass p-6 border border-orange-500/30 bg-neutral-950/90 shadow-md">
                <div className="border-l-2 border-orange-500 pl-2 mb-4">
                  <h3 className="text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">DEPLOY KART ASSET TO LOOP</h3>
                  <p className="text-[10px] text-neutral-500">Map an active machine to a physical track station node context.</p>
                </div>
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase mb-1">Target Circuit Node</label>
                    <select value={deployTrackId} onChange={(e) => setDeployTrackId(e.target.value)} className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-orange-500 font-mono" required>
                      <option value="">-- CHOOSE CIRCUITS LAYER --</option>
                      {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase mb-1">Available Fleet Chassis</label>
                    <select value={deployKartId} onChange={(e) => setDeployKartId(e.target.value)} className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-orange-500 font-mono" required>
                      <option value="">-- CHOOSE HARDWARE ID --</option>
                      {karts.filter(k => k.status === 'active' && (!k.kart_deployments || k.kart_deployments.length === 0)).map(k => (
                        <option key={k.id} value={k.id}>CHASSIS #{k.kart_number} ({k.id})</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-orange-500 text-black py-3 font-bold uppercase tracking-widest text-center hover:bg-orange-400 transition-colors">
                    ⚡ CONNECT TRACK TELEMETRY
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'shifts' && (
            <form onSubmit={handleAssignShift} className="glass p-6 border border-neutral-800 bg-neutral-950/80">
              <div className="border-l-2 border-purple-500 pl-2 mb-4">
                <h2 className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">ASSIGN OPERATOR SHIFT LOCK</h2>
              </div>
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Target Circuit Node</label>
                  <select value={selectedTrackId} onChange={(e) => setSelectedTrackId(e.target.value)} className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-purple-500 font-mono" required>
                    <option value="">-- CHOOSE TRACK COMPONENT --</option>
                    {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Authorized Active Operator</label>
                  <select value={selectedOperatorId} onChange={(e) => setSelectedOperatorId(e.target.value)} className="w-full bg-black border border-neutral-800 p-2.5 text-white focus:outline-none focus:border-purple-500 font-mono" required>
                    <option value="">-- CHOOSE SYSTEM OPERATOR --</option>
                    {operators.map(o => <option key={o.id} value={o.id}>{o.operator_name}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-3 font-bold uppercase tracking-widest text-center hover:bg-purple-500">
                  ⚡ BIND LINK-SHIFT ENTRY
                </button>
              </div>
            </form>
          )}
        </div>

        {/* DATA ARRAYS VISUALIZER COMPONENT */}
        <div className="lg:col-span-2 space-y-6">
          <section className="glass p-6 border border-neutral-800 bg-neutral-950/40 min-h-[440px]">
            <div className="border-l-2 border-orange-500 pl-3 mb-6">
              <h2 className="text-md font-bold font-tech uppercase tracking-wider">{activeTab.toUpperCase()} DATAGRID REGISTER</h2>
            </div>

            {loading ? (
              <div className="text-xs font-mono text-neutral-600 uppercase tracking-widest text-center py-20">[ ARRAYS PACKAGING IN LIVE THREAD... ]</div>
            ) : (
              <div className="overflow-x-auto">
                {activeTab === 'operators' && (
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 bg-black">
                        <th className="p-3">CALLSIGN HANDLE</th>
                        <th className="p-3">SECURE CONTACT PHONE</th>
                        <th className="p-3">STATUS LINK</th>
                        <th className="p-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {operators.map((op) => (
                        <tr key={op.id} className="border-b border-neutral-900 hover:bg-neutral-950/60">
                          <td className="p-3 text-white font-bold">{op.operator_name}</td>
                          <td className="p-3 text-orange-400">{op.secure_phone}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase border ${op.is_active ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' : 'bg-red-950/40 border-red-900 text-red-500'}`}>
                              {op.is_active ? 'ACTIVE' : 'REVOKED'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleRemoveOperator(op.id, op.operator_name)}
                              className="bg-red-950/20 border border-red-900/60 text-red-500 hover:bg-red-900 hover:text-black font-mono text-[9px] px-2 py-1 uppercase tracking-wider transition-all"
                            >
                              ✕ REMOVE
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'tracks' && (
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 bg-black">
                        <th className="p-3">CIRCUIT NODE NAME</th>
                        <th className="p-3">LOCATION NODE</th>
                        <th className="p-3">LAP BENCHMARK</th>
                        <th className="p-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tracks.map((track) => (
                        <tr key={track.id} className="border-b border-neutral-900 hover:bg-neutral-950/60">
                          <td className="p-3 text-white font-bold">{track.name}</td>
                          <td className="p-3 text-cyan-400">{track.location}</td>
                          <td className="p-3 text-red-500 font-bold font-tech">{track.track_record_seconds?.toFixed(3)}s</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleRemoveTrack(track.id, track.name)}
                              className="bg-red-950/20 border border-red-900/60 text-red-500 hover:bg-red-900 hover:text-black font-mono text-[9px] px-2 py-1 uppercase tracking-wider transition-all"
                            >
                              ✕ WIPE NODE
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'karts' && (
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 bg-black">
                        <th className="p-3">CHASSIS CORE ID</th>
                        <th className="p-3">FLEET NUMBER LAYOUT</th>
                        <th className="p-3">OPERATIONAL LOOP STATION</th>
                        <th className="p-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {karts.map((kart) => {
                        const activeDeploy = kart.kart_deployments && kart.kart_deployments[0];
                        return (
                          <tr key={kart.id} className="border-b border-neutral-900 hover:bg-neutral-950/60">
                            <td className="p-3 text-white font-bold font-tech">{kart.id}</td>
                            <td className="p-3 text-neutral-400 font-bold">Chassis #{kart.kart_number}</td>
                            <td className="p-3">
                              {activeDeploy ? (
                                <span className="text-orange-400 font-bold uppercase text-[11px] tracking-tight">
                                  📍 LOCKED: {activeDeploy.tracks?.name}
                                </span>
                              ) : (
                                <span className="bg-neutral-900 text-neutral-500 border border-neutral-800 px-2 py-0.5 uppercase text-[9px] font-mono">
                                  📦 GARAGE STORAGE [{kart.status}]
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right space-x-2">
                              {activeDeploy ? (
                                <button
                                  onClick={() => handleRecallKart(activeDeploy.id)}
                                  className="bg-orange-950/30 border border-orange-900 text-orange-400 hover:bg-orange-500 hover:text-black font-mono text-[9px] px-2 py-1 uppercase tracking-wider transition-all"
                                >
                                  ↩ RECALL
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRemoveKart(kart.id)}
                                  className="bg-red-950/20 border border-red-900/60 text-red-500 hover:bg-red-900 hover:text-black font-mono text-[9px] px-2 py-1 uppercase tracking-wider transition-all"
                                >
                                  ✕ SCRAP
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {activeTab === 'shifts' && (
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 bg-black">
                        <th className="p-3">CIRCUIT NODE LOCATION</th>
                        <th className="p-3">ASSIGNED OPERATOR</th>
                        <th className="p-3">SHIFT STATUS</th>
                        <th className="p-3 text-right">COMMAND OPTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shifts.map((s) => (
                        <tr key={s.id} className="border-b border-neutral-900 hover:bg-neutral-950/60">
                          <td className="p-3 text-white font-bold">{s.tracks?.name || 'MAIN REFUGE'}</td>
                          <td className="p-3 text-purple-400 font-bold">{s.operators?.operator_name || 'UNASSIGNED'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase border ${s.shift_status === 'active' ? 'bg-purple-950 text-purple-400 border-purple-800' : 'bg-neutral-900 text-neutral-500 border-neutral-800'}`}>
                              {s.shift_status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {s.shift_status === 'active' ? (
                              <button
                                onClick={() => handleDeassignShift(s.id)}
                                className="bg-red-950/40 border border-red-900 text-red-400 hover:bg-red-900 hover:text-black font-mono text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider transition-colors"
                              >
                                ✕ DE-ASSIGN
                              </button>
                            ) : (
                              <span className="text-[10px] text-neutral-600 font-mono tracking-tighter uppercase">[ COMPLETED SHIFT ]</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </section>
        </div>
        
      </div>
    </div>
  );
}