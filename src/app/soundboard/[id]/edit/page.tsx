'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UploadAudio } from '@/components/Admin/UploadAudio';
import { CopyLinkButton } from '@/components/CopyLinkButton';

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
  position: number;
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
  const [saving, setSaving] = useState(false);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);

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

  const toggleVisibility = async () => {
    if (!soundboard) return;

    setUpdatingVisibility(true);
    try {
      const response = await fetch(`/api/soundboards/${soundboardId}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !soundboard.isPublic })
      });
      
      if (response.ok) {
        const result = await response.json();
        setSoundboard(prev => prev ? { ...prev, isPublic: result.soundboard.isPublic } : null);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update visibility');
      }
    } catch (error) {
      console.error('Failed to update visibility:', error);
      alert('Failed to update visibility - please try again');
    } finally {
      setUpdatingVisibility(false);
    }
  };


  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
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


  return (
    <div className="p-4 bg-gray-950 min-h-screen">
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
              <CopyLinkButton 
                soundboardId={soundboard.id} 
                size="md"
              />
              <button
                onClick={toggleVisibility}
                disabled={updatingVisibility}
                className={`px-4 py-2 rounded transition-colors font-medium ${
                  soundboard.isPublic
                    ? 'bg-orange-600 text-white hover:bg-orange-500'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                } ${updatingVisibility ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {updatingVisibility ? (
                  '⏳ Updating...'
                ) : soundboard.isPublic ? (
                  '👁️ Hide from Explore'
                ) : (
                  '🔍 Show in Explore'
                )}
              </button>
            </div>
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((zone) => (
            <div key={zone.id} className="border-2 border-gray-700 rounded-lg p-4 bg-gray-800 shadow-lg relative">
              {/* Zone Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">Zone {zone.position}</h3>
                  <div className={`w-3 h-3 rounded-full ${zone.isActive ? 'bg-green-400' : 'bg-red-400'}`} title={zone.isActive ? 'Active' : 'Inactive'}></div>
                </div>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}