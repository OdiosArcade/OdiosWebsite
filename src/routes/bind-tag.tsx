import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/bind-tag')({
  component: NfcTagBinder,
});

interface DriverProfile {
  id: string;
  username: string;
  mobile_number: string | null;
  nfc_tag_id: string | null;
}

function NfcTagBinder() {
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [scannedTagId, setScannedTagId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    fetchUnboundProfiles();
  }, []);

  const fetchUnboundProfiles = async () => {
    try {
      // Pull down driver profiles to let operators find who needs a tag assignment
      const { data } = await supabase
        .from('profiles')
        .select('id, username, mobile_number, nfc_tag_id')
        .order('username', { ascending: true });

      if (data) setDrivers(data as DriverProfile[]);
    } catch (err) {
      console.error('Error fetching profiles for hardware binding:', err);
    }
  };

  const handleBindHardwareTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriverId || !scannedTagId.trim()) {
      alert('⚠️ System Check Failure: You must select a pilot and scan a physical hardware tag string.');
      return;
    }

    setIsProcessing(true);

    try {
      // Execute the lock straight to your profiles table layout
      const { error } = await supabase
        .from('profiles')
        .update({ nfc_tag_id: scannedTagId.trim() })
        .eq('id', selectedDriverId);

      if (error) {
        alert(`❌ DATABASE REJECTION:\n\nThis NFC Tag ID might already be bound to another active driver profile.`);
      } else {
        alert(`⚡ HARDWARE LINK SUCCESS!\n\nPhysical key tag successfully assigned to driver profile.`);
        setScannedTagId('');
        setSelectedDriverId('');
        fetchUnboundProfiles(); // Refresh local list state matrices
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 grid-bg scanlines">
      
      {/* HUB STATUS BANNER */}
      <header className="border-b border-neutral-800 pb-4 mb-8">
        <span className="bg-orange-500 text-black font-mono px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
          HARDWARE INTEGRATION NODE
        </span>
        <h1 className="text-2xl font-bold tracking-wider font-tech text-white mt-1">
          NFC PERIPHERAL BINDING CONSOLE
        </h1>
      </header>

      <div className="max-w-2xl mx-auto glass p-8 border border-neutral-800 bg-black/90">
        <div className="mb-6 border-b border-neutral-900 pb-4">
          <h2 className="text-md font-bold uppercase tracking-wide font-tech text-orange-400">
            Link Physical Key-Band to Profile
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Select a driver profile, place the fresh wristband or card onto the desktop reader, and commit the secure link.
          </p>
        </div>

        <form onSubmit={handleBindHardwareTag} className="space-y-6">
          
          {/* DRIVER CHOOSE STEP */}
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-2">
              Step 1 // Target Driver Profile
            </label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm font-mono focus:outline-none focus:border-orange-500"
              required
            >
              <option value="">-- SELECT TARGET PROFILE --</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.username} {d.nfc_tag_id ? `[Current Tag: ${d.nfc_tag_id}]` : '(NO HARDWARE BOUND)'}
                </option>
              ))}
            </select>
          </div>

          {/* HARDWARE TAG INPUT STEP */}
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-2">
              Step 2 // Scan Physical Device Tag String
            </label>
            <input
              type="text"
              value={scannedTagId}
              onChange={(e) => setScannedTagId(e.target.value)}
              placeholder="[ Tap wristband scanner input stream string here ]"
              className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-sm font-mono text-center text-orange-400 text-lg focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          {/* ACTION SUBMIT */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-white text-black hover:bg-neutral-200 uppercase font-mono font-bold tracking-widest py-3 text-xs transition-all disabled:opacity-40"
          >
            {isProcessing ? 'WRITING HARDWARE ENCRYPTION LINK...' : '► SECURELY COMMIT HARDWARE DEVICE BIND'}
          </button>

        </form>
      </div>

    </div>
  );
}