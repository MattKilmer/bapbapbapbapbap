'use client';
import { useEffect, useState } from 'react';
import { UploadAudio } from '@/components/Admin/UploadAudio';

export default function ZonePage({ params }: { params: Promise<{ id: string }> }) {
  const [zone, setZone] = useState<any>(null);
  const [animations, setAnimations] = useState<any[]>([]);
  const [animationCfg, setAnimationCfg] = useState('');
  const [zoneId, setZoneId] = useState<string>('');

  useEffect(() => {
    params.then(({ id }) => {
      setZoneId(id);
      fetch(`/api/zones/${id}`).then(r => r.json()).then(data => {
        setZone(data);
        setAnimationCfg(JSON.stringify(data.animationCfg || {}, null, 2));
      });
    });
    fetch('/api/animations').then(r => r.json()).then(data => setAnimations(data.animations));
  }, [params]);

  const updateZone = async (data: any) => {
    if (!zoneId) return;
    await fetch(`/api/zones/${zoneId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    // Refresh zone
    const response = await fetch(`/api/zones/${zoneId}`);
    const updatedZone = await response.json();
    setZone(updatedZone);
  };

  const updateSample = async (sampleId: string, gainDb: number) => {
    // Note: This would need a PUT endpoint for samples, but we'll keep it simple for now
    setZone({
      ...zone,
      samples: zone.samples.map((s: any) => 
        s.id === sampleId ? { ...s, gainDb } : s
      )
    });
  };

  const deleteSample = async (sampleId: string) => {
    if (!zoneId) return;
    await fetch(`/api/samples/${sampleId}`, { method: 'DELETE' });
    // Refresh zone
    const response = await fetch(`/api/zones/${zoneId}`);
    const updatedZone = await response.json();
    setZone(updatedZone);
  };

  const refreshZone = async () => {
    if (!zoneId) return;
    const response = await fetch(`/api/zones/${zoneId}`);
    const updatedZone = await response.json();
    setZone(updatedZone);
  };

  const saveAnimationCfg = () => {
    try {
      const cfg = JSON.parse(animationCfg);
      updateZone({ animationCfg: cfg });
    } catch (e) {
      alert('Invalid JSON');
    }
  };

  if (!zone) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <a href="/admin" className="text-blue-500 hover:text-blue-700">← Back to Admin</a>
        <h1 className="text-2xl font-bold mt-2">Zone {zone.id} Editor</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Zone Label</label>
            <input
              type="text"
              value={zone.label}
              onChange={(e) => setZone({ ...zone, label: e.target.value })}
              onBlur={(e) => updateZone({ label: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Zone label"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Animation Type</label>
            <select
              value={zone.animationKey}
              onChange={(e) => updateZone({ animationKey: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {animations.map(anim => (
                <option key={anim.key} value={anim.key}>{anim.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Animation Configuration (JSON)</label>
            <textarea
              value={animationCfg}
              onChange={(e) => setAnimationCfg(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg font-mono text-sm h-32"
              placeholder='{"radius": 60, "lifeMs": 600}'
            />
            <button
              onClick={saveAnimationCfg}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Config
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Active</label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={zone.isActive}
                onChange={(e) => updateZone({ isActive: e.target.checked })}
                className="mr-2"
              />
              Zone is active
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Audio Samples</h3>
          
          <div className="space-y-3 mb-4">
            {zone.samples?.map((sample: any) => (
              <div key={sample.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium truncate">{sample.label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const audio = new Audio(sample.url);
                        audio.play().catch(e => console.error('Playback failed:', e));
                      }}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-bold"
                    >
                      ▶ Play
                    </button>
                    <button
                      onClick={() => deleteSample(sample.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Gain (dB):</label>
                  <input
                    type="number"
                    value={sample.gainDb}
                    onChange={(e) => updateSample(sample.id, parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border rounded text-sm"
                    step="0.1"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <UploadAudio zoneId={parseInt(zoneId)} onUploadComplete={refreshZone} />
          </div>
        </div>
      </div>
    </div>
  );
}