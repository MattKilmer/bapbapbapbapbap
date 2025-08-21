'use client';
import { useEffect, useState } from 'react';
import { UploadAudio } from '@/components/Admin/UploadAudio';

export default function AdminPage() {
  const [zones, setZones] = useState<any[]>([]);
  const [animations, setAnimations] = useState<any[]>([]);
  const [globalScale, setGlobalScale] = useState<number>(2);
  const [tempGlobalScale, setTempGlobalScale] = useState<number>(2);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(data => {
      setZones(data.zones);
      const scale = data.globalScale || 2;
      setGlobalScale(scale);
      setTempGlobalScale(scale);
    });
    fetch('/api/animations').then(r => r.json()).then(data => setAnimations(data.animations));
  }, []);

  const refreshZones = async () => {
    const response = await fetch('/api/config');
    const config = await response.json();
    setZones(config.zones);
    const scale = config.globalScale || 2;
    setGlobalScale(scale);
    setTempGlobalScale(scale);
  };

  const saveGlobalScale = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ globalScale: tempGlobalScale })
      });
      
      const result = await response.json();
      if (response.ok && result.globalScale !== undefined) {
        setGlobalScale(tempGlobalScale);
        console.log('Global scale saved:', tempGlobalScale);
      } else {
        console.error('Failed to save global scale');
        alert('Failed to save global scale - please try again');
      }
    } catch (error) {
      console.error('Failed to update global scale:', error);
      alert('Failed to save global scale - please try again');
    } finally {
      setSaving(false);
    }
  };

  const hasUnsavedChanges = globalScale !== tempGlobalScale;

  const updateZone = async (zoneId: number, data: any) => {
    await fetch(`/api/zones/${zoneId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    refreshZones();
  };

  const deleteSample = async (sampleId: string) => {
    await fetch(`/api/samples/${sampleId}`, { method: 'DELETE' });
    refreshZones();
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(err => console.error('Failed to play audio:', err));
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audio Zones Admin</h1>
          <p className="text-gray-600">Manage your 4×4 audio trigger grid. Upload samples, configure animations, and test your zones.</p>
          <div className="flex gap-4 mt-4">
            <a 
              href="/" 
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              🎯 Test Main App
            </a>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>{zones.filter(z => z.isActive).length} active zones</span>
              <span className="mx-2">•</span>
              <span>{zones.reduce((acc, z) => acc + (z.samples?.length || 0), 0)} total samples</span>
            </div>
          </div>
          
          {/* Global Animation Scale Control */}
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="text-sm font-semibold text-purple-800">
                🎨 Global Animation Scale:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={tempGlobalScale}
                  onChange={(e) => setTempGlobalScale(parseFloat(e.target.value))}
                  className="w-32 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-lg font-bold text-purple-700 min-w-[3rem]">
                  {tempGlobalScale}x
                </span>
              </div>
              <button
                onClick={saveGlobalScale}
                disabled={!hasUnsavedChanges || saving}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  hasUnsavedChanges && !saving
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {saving ? '⏳ Saving...' : hasUnsavedChanges ? '💾 Save Changes' : '✅ Saved'}
              </button>
              <div className="text-xs text-purple-600 max-w-md">
                Controls how big all animations appear (0.5x = tiny, 2x = default, 5x = huge)
                {hasUnsavedChanges && <div className="text-orange-600 font-medium">⚠️ You have unsaved changes</div>}
              </div>
            </div>
          </div>
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {zones.map((zone) => (
          <div key={zone.id} className="border-2 rounded-lg p-4 bg-white shadow-lg relative">
            {/* Zone Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800">Zone {zone.id}</h3>
                <div className={`w-3 h-3 rounded-full ${zone.isActive ? 'bg-green-500' : 'bg-red-500'}`} title={zone.isActive ? 'Active' : 'Inactive'}></div>
              </div>
            </div>

            {/* Animation Section */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                🎨 Animation: 
                <span className="font-normal text-gray-700 ml-1">
                  {animations.find(a => a.key === zone.animationKey)?.name || 'Unknown'}
                </span>
              </label>
              <select
                value={zone.animationKey}
                onChange={(e) => updateZone(zone.id, { animationKey: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                {animations.map(anim => (
                  <option key={anim.key} value={anim.key}>{anim.name}</option>
                ))}
              </select>
            </div>

            {/* Samples Section */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                🎵 Audio Samples ({zone.samples?.length || 0})
              </label>
              
              {zone.samples?.length > 0 ? (
                <div className="space-y-2 max-h-24 overflow-y-auto bg-gray-50 rounded p-2">
                  {zone.samples?.map((sample: any) => (
                    <div key={sample.id} className="flex items-center justify-between text-xs bg-white p-2 rounded border">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-gray-900">{sample.label || 'Untitled'}</div>
                        <div className="text-gray-700">{sample.gainDb}dB</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => playAudio(sample.url)}
                          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
                          title="Play audio"
                        >
                          ▶ Play
                        </button>
                        <button
                          onClick={() => deleteSample(sample.id)}
                          className="text-red-500 hover:text-red-700 px-1"
                          title="Delete sample"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-700 text-sm italic text-center py-4 bg-gray-50 rounded">
                  No audio samples uploaded
                </div>
              )}
              
              {/* Upload Section */}
              <div className="mt-3 p-2 bg-blue-50 rounded border-2 border-dashed border-blue-200">
                <UploadAudio zoneId={zone.id} onUploadComplete={refreshZones} />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center pt-2 border-t border-gray-200">
              <a
                href={`/admin/zones/${zone.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                ⚙️ Configure
              </a>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}