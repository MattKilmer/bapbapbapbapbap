'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UploadAudio } from '@/components/Admin/UploadAudio';

interface Soundboard {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  globalScale: number;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

interface Zone {
  id: number;
  label: string;
  animationKey: string;
  animationCfg: any;
  isActive: boolean;
  samples: Array<{
    id: string;
    label: string;
    url: string;
    gainDb: number;
  }>;
}

export default function EditSoundboard({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [soundboard, setSoundboard] = useState<Soundboard | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [animations, setAnimations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundboardId, setSoundboardId] = useState<string>('');
  const [tempGlobalScale, setTempGlobalScale] = useState(1.0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      setSoundboardId(id);
      loadSoundboard(id);
    });
    loadAnimations();
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const loadSoundboard = async (id: string) => {
    try {
      const response = await fetch(`/api/config?soundboardId=${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.soundboard) {
          setSoundboard(data.soundboard);
          setZones(data.zones || []);
          setTempGlobalScale(data.globalScale);
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error loading soundboard:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadAnimations = async () => {
    try {
      const response = await fetch('/api/animations');
      if (response.ok) {
        const data = await response.json();
        setAnimations(data.animations);
      }
    } catch (error) {
      console.error('Error loading animations:', error);
    }
  };

  const refreshZones = () => {
    loadSoundboard(soundboardId);
  };

  const updateZone = async (zoneId: number, data: any) => {
    try {
      await fetch(`/api/zones/${zoneId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      refreshZones();
    } catch (error) {
      console.error('Error updating zone:', error);
    }
  };

  const deleteSample = async (sampleId: string) => {
    try {
      await fetch(`/api/samples/${sampleId}`, { method: 'DELETE' });
      refreshZones();
    } catch (error) {
      console.error('Error deleting sample:', error);
    }
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(err => console.error('Failed to play audio:', err));
  };

  const saveGlobalScale = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/soundboards/${soundboardId}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ globalScale: tempGlobalScale })
      });
      
      if (response.ok) {
        setSoundboard(prev => prev ? { ...prev, globalScale: tempGlobalScale } : null);
      } else {
        alert('Failed to save settings - please try again');
      }
    } catch (error) {
      console.error('Failed to update global scale:', error);
      alert('Failed to save settings - please try again');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session || !soundboard) {
    return null;
  }

  // Check if user owns this soundboard
  if (soundboard.creator.id !== session.user.id && session.user.role !== 'ADMIN') {
    router.push('/dashboard');
    return null;
  }

  const hasUnsavedChanges = Math.abs((soundboard?.globalScale || 1.0) - tempGlobalScale) > 0.001;

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="text-blue-400 hover:text-blue-300 inline-flex items-center mb-4"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Edit Soundboard</h1>
              <h2 className="text-xl text-gray-300">{soundboard.name}</h2>
              {soundboard.description && (
                <p className="text-gray-400">{soundboard.description}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href={`/play/${soundboard.id}`}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors"
              >
                ▶ Test Soundboard
              </Link>
            </div>
          </div>
          
          {/* Global Animation Scale Control */}
          <div className="mt-4 p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="text-sm font-semibold text-purple-300">
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
                  className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-lg font-bold text-purple-300 min-w-[3rem]">
                  {tempGlobalScale}x
                </span>
              </div>
              <button
                onClick={saveGlobalScale}
                disabled={!hasUnsavedChanges || saving}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  hasUnsavedChanges && !saving
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {saving ? '⏳ Saving...' : hasUnsavedChanges ? '💾 Save Changes' : '✅ Saved'}
              </button>
              <div className="text-xs text-purple-300 max-w-md">
                Controls how big all animations appear (0.5x = tiny, 1x = default, 5x = huge)
                {hasUnsavedChanges && <div className="text-orange-400 font-medium">⚠️ You have unsaved changes</div>}
              </div>
            </div>
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((zone) => (
            <div key={zone.id} className="border-2 border-gray-700 rounded-lg p-4 bg-gray-800 shadow-lg relative">
              {/* Zone Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">Zone {zone.id}</h3>
                  <div className={`w-3 h-3 rounded-full ${zone.isActive ? 'bg-green-400' : 'bg-red-400'}`} title={zone.isActive ? 'Active' : 'Inactive'}></div>
                </div>
              </div>

              {/* Animation Section */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white mb-2">
                  🎨 Animation: 
                  <span className="font-normal text-gray-300 ml-1">
                    {animations.find(a => a.key === zone.animationKey)?.name || 'Unknown'}
                  </span>
                </label>
                <select
                  value={zone.animationKey}
                  onChange={(e) => updateZone(zone.id, { animationKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white bg-gray-700"
                >
                  {animations.map(anim => (
                    <option key={anim.key} value={anim.key}>{anim.name}</option>
                  ))}
                </select>
              </div>

              {/* Samples Section */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white mb-2">
                  🎵 Audio Sample
                </label>
                
                {zone.samples?.length > 0 && (
                  <div className="bg-gray-700 rounded p-2">
                    <div className="flex items-center justify-between text-xs bg-gray-600 p-2 rounded border border-gray-500">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-white">{zone.samples[0].label || 'Untitled'}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => playAudio(zone.samples[0].url)}
                          className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors text-sm font-medium"
                          title="Play audio"
                        >
                          ▶ Play
                        </button>
                        <button
                          onClick={() => deleteSample(zone.samples[0].id)}
                          className="px-3 py-2 bg-rose-600 text-white rounded hover:bg-rose-500 transition-colors text-sm font-medium"
                          title="Remove sample"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Upload Section */}
                {!zone.samples?.length && (
                  <div className="mt-3">
                    <UploadAudio zoneId={zone.id} onUploadComplete={refreshZones} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}