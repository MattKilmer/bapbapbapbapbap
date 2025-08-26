'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UploadAudio } from '@/components/Admin/UploadAudio';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { Navigation } from '@/components/Navigation';

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
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempDescription, setTempDescription] = useState('');

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

  const startEditingName = () => {
    if (!soundboard) return;
    setTempName(soundboard.name);
    setEditingName(true);
  };

  const startEditingDescription = () => {
    if (!soundboard) return;
    setTempDescription(soundboard.description || '');
    setEditingDescription(true);
  };

  const saveName = async () => {
    if (!soundboard || tempName.trim() === '') return;

    setSaving(true);
    try {
      const response = await fetch(`/api/soundboards/${soundboardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tempName.trim() })
      });
      
      if (response.ok) {
        const result = await response.json();
        setSoundboard(prev => prev ? { ...prev, name: result.soundboard.name } : null);
        setEditingName(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update name');
      }
    } catch (error) {
      console.error('Failed to update name:', error);
      alert('Failed to update name - please try again');
    } finally {
      setSaving(false);
    }
  };

  const saveDescription = async () => {
    if (!soundboard) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/soundboards/${soundboardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: tempDescription.trim() })
      });
      
      if (response.ok) {
        const result = await response.json();
        setSoundboard(prev => prev ? { ...prev, description: result.soundboard.description } : null);
        setEditingDescription(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update description');
      }
    } catch (error) {
      console.error('Failed to update description:', error);
      alert('Failed to update description - please try again');
    } finally {
      setSaving(false);
    }
  };

  const cancelEditingName = () => {
    setEditingName(false);
    setTempName('');
  };

  const cancelEditingDescription = () => {
    setEditingDescription(false);
    setTempDescription('');
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
    <>
      <Navigation />
      <div className="p-4 bg-gray-950 min-h-screen pt-16">
        <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="text-blue-400 hover:text-blue-300 inline-flex items-center mb-4"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-white mb-2">Edit Soundboard</h1>
              
              {/* Editable Name */}
              <div className="mb-2">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-xl bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none flex-1"
                      placeholder="Soundboard name"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveName();
                        if (e.key === 'Escape') cancelEditingName();
                      }}
                    />
                    <button
                      onClick={saveName}
                      disabled={saving || tempName.trim() === ''}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? '⏳' : '✓'}
                    </button>
                    <button
                      onClick={cancelEditingName}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h2 className="text-xl text-gray-300">{soundboard.name}</h2>
                    <button
                      onClick={startEditingName}
                      className="opacity-0 group-hover:opacity-100 px-2 py-1 text-gray-400 hover:text-white transition-all text-sm cursor-pointer"
                      title="Edit name"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>

              {/* Editable Description */}
              <div>
                {editingDescription ? (
                  <div className="flex items-start gap-2">
                    <textarea
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      className="bg-gray-700 text-gray-300 px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none flex-1 resize-none"
                      placeholder="Add a description (optional)"
                      rows={2}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          saveDescription();
                        }
                        if (e.key === 'Escape') cancelEditingDescription();
                      }}
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={saveDescription}
                        disabled={saving}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? '⏳' : '✓'}
                      </button>
                      <button
                        onClick={cancelEditingDescription}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 group">
                    {soundboard.description ? (
                      <p className="text-gray-400">{soundboard.description}</p>
                    ) : (
                      <p className="text-gray-500 italic">No description</p>
                    )}
                    <button
                      onClick={startEditingDescription}
                      className="opacity-0 group-hover:opacity-100 px-2 py-1 text-gray-400 hover:text-white transition-all text-sm cursor-pointer"
                      title="Edit description"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <Link 
                href={`/play/${soundboard.id}`}
                className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors text-center text-sm sm:text-base font-medium"
              >
                <span className="sm:hidden">▶</span>
                <span className="hidden sm:inline">▶ Test Soundboard</span>
              </Link>
              <CopyLinkButton 
                soundboardId={soundboard.id} 
                size="sm"
              />
              <ToggleSwitch
                enabled={soundboard.isPublic}
                onToggle={toggleVisibility}
                disabled={updatingVisibility}
                enabledLabel="Public"
                disabledLabel="Private"
                size="md"
              />
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
    </>
  );
}