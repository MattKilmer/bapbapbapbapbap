'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CopyLinkButton } from '@/components/CopyLinkButton';

interface Soundboard {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  plays: number;
  likes: number;
  zonesWithSamples: number;
  totalZones: number;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [soundboards, setSoundboards] = useState<Soundboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingVisibility, setUpdatingVisibility] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      loadSoundboards();
    }
  }, [session]);

  const loadSoundboards = async () => {
    try {
      const response = await fetch('/api/soundboards');
      if (response.ok) {
        const data = await response.json();
        setSoundboards(data.soundboards);
      }
    } catch (error) {
      console.error('Error loading soundboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSoundboard = async (soundboardId: string, soundboardName: string) => {
    if (!confirm(`Are you sure you want to delete "${soundboardName}"? This action cannot be undone and will delete all zones and audio samples.`)) {
      return;
    }

    setDeleting(soundboardId);
    try {
      const response = await fetch(`/api/soundboards/${soundboardId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the soundboard from the list
        setSoundboards(prev => prev.filter(sb => sb.id !== soundboardId));
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete soundboard');
      }
    } catch (error) {
      console.error('Error deleting soundboard:', error);
      alert('Something went wrong while deleting the soundboard');
    } finally {
      setDeleting(null);
    }
  };

  const toggleVisibility = async (soundboardId: string, currentIsPublic: boolean) => {
    setUpdatingVisibility(soundboardId);
    try {
      const response = await fetch(`/api/soundboards/${soundboardId}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !currentIsPublic })
      });
      
      if (response.ok) {
        const result = await response.json();
        // Update the soundboard in the list
        setSoundboards(prev => prev.map(sb => 
          sb.id === soundboardId 
            ? { ...sb, isPublic: result.soundboard.isPublic }
            : sb
        ));
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update visibility');
      }
    } catch (error) {
      console.error('Failed to update visibility:', error);
      alert('Failed to update visibility - please try again');
    } finally {
      setUpdatingVisibility(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-300">Welcome back, {session.user?.name || session.user?.email}!</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/soundboard/new" className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400">+ Create Soundboard</h3>
            <p className="text-gray-400">Start with a fresh 4×4 grid</p>
          </Link>

          <Link href="/explore" className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-emerald-500 transition-colors group">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-400">🌟 Explore</h3>
            <p className="text-gray-400">Discover public soundboards</p>
          </Link>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">📊 Stats</h3>
            <p className="text-gray-400">{soundboards.length} soundboards</p>
            <p className="text-gray-400">{soundboards.reduce((acc, sb) => acc + sb.plays, 0)} total plays</p>
          </div>
        </div>

        {/* My Soundboards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">My Soundboards</h2>
          
          {soundboards.length === 0 ? (
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold mb-2">No soundboards yet</h3>
              <p className="text-gray-400 mb-6">Create your first soundboard to get started!</p>
              <Link 
                href="/soundboard/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                Create Your First Soundboard
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soundboards.map((soundboard) => (
                <div key={soundboard.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{soundboard.name}</h3>
                        {soundboard.description && (
                          <p className="text-gray-400 text-sm mb-3">{soundboard.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleVisibility(soundboard.id, soundboard.isPublic)}
                        disabled={updatingVisibility === soundboard.id}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          updatingVisibility === soundboard.id
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : soundboard.isPublic
                            ? 'bg-green-900 text-green-300 hover:bg-green-800'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title={`Click to ${soundboard.isPublic ? 'hide from' : 'show in'} explore section`}
                      >
                        {updatingVisibility === soundboard.id ? '⏳ Updating...' : soundboard.isPublic ? '🌍 Public' : '🔒 Private'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{soundboard.zonesWithSamples}/{soundboard.totalZones} zones filled</span>
                      <span>{soundboard.plays} plays</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/play/${soundboard.id}`}
                        className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded text-center hover:bg-emerald-500 transition-colors text-sm"
                      >
                        ▶ Play
                      </Link>
                      <Link
                        href={`/soundboard/${soundboard.id}/edit`}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-500 transition-colors text-sm"
                      >
                        ⚙️ Edit
                      </Link>
                      <CopyLinkButton 
                        soundboardId={soundboard.id} 
                        variant="icon"
                        size="sm"
                      />
                      <button
                        onClick={() => deleteSoundboard(soundboard.id, soundboard.name)}
                        disabled={deleting === soundboard.id}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          deleting === soundboard.id
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-500'
                        }`}
                        title="Delete soundboard"
                      >
                        {deleting === soundboard.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}