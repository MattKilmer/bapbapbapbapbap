'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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
  creator: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function Explore() {
  const { data: session } = useSession();
  const [soundboards, setSoundboards] = useState<Soundboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSoundboards();
  }, []);

  const loadSoundboards = async () => {
    try {
      const response = await fetch('/api/soundboards?publicOnly=true');
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

  const filteredSoundboards = soundboards.filter(soundboard =>
    soundboard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    soundboard.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    soundboard.creator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    soundboard.creator.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Soundboards</h1>
          <p className="text-gray-300">Discover amazing soundboards created by the community</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search soundboards, creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
            <span className="text-lg font-bold text-blue-400">{soundboards.length}</span>
            <span className="text-sm text-gray-400 ml-2">Public Soundboards</span>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
            <span className="text-lg font-bold text-emerald-400">
              {soundboards.reduce((acc, sb) => acc + sb.plays, 0)}
            </span>
            <span className="text-sm text-gray-400 ml-2">Total Plays</span>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
            <span className="text-lg font-bold text-purple-400">
              {new Set(soundboards.map(sb => sb.creator.id)).size}
            </span>
            <span className="text-sm text-gray-400 ml-2">Creators</span>
          </div>
        </div>

        {/* Soundboards Grid */}
        {filteredSoundboards.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
            {searchTerm ? (
              <>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-400 mb-6">Try a different search term or browse all soundboards</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold mb-2">No public soundboards yet</h3>
                <p className="text-gray-400 mb-6">Be the first to create and share a soundboard!</p>
                {session ? (
                  <Link 
                    href="/soundboard/new"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Create First Soundboard
                  </Link>
                ) : (
                  <Link 
                    href="/auth/signin"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Sign Up to Create
                  </Link>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSoundboards.map((soundboard) => (
              <div key={soundboard.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">{soundboard.name}</h3>
                    {soundboard.description && (
                      <p className="text-gray-400 text-sm mb-3">{soundboard.description}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <span>by {soundboard.creator.name || soundboard.creator.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>{soundboard.zonesWithSamples}/{soundboard.totalZones} zones</span>
                    <span>{soundboard.plays} plays</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/play/${soundboard.id}`}
                      className="flex-1 bg-emerald-600 text-white py-2 px-3 sm:px-4 rounded text-center hover:bg-emerald-500 transition-colors text-sm whitespace-nowrap"
                    >
                      <span className="sm:hidden">▶</span>
                      <span className="hidden sm:inline">▶ Play</span>
                    </Link>
                    <CopyLinkButton 
                      soundboardId={soundboard.id} 
                      variant="icon"
                      size="sm"
                    />
                    {session && session.user.id === soundboard.creator.id && (
                      <Link
                        href={`/soundboard/${soundboard.id}/edit`}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 sm:px-4 rounded text-center hover:bg-blue-500 transition-colors text-sm whitespace-nowrap"
                      >
                        <span className="sm:hidden">⚙️</span>
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {filteredSoundboards.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-gray-700 p-8 text-center">
            {session ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Ready to create your own?</h2>
                <p className="text-gray-300 mb-6">
                  Join the community and share your unique soundboard with the world
                </p>
                <Link 
                  href="/soundboard/new"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all font-semibold"
                >
                  Create Your Soundboard
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">Ready to create your own soundboard?</h2>
                <p className="text-gray-300 mb-6">
                  Sign up to create and share your unique soundboards with the community. It&apos;s free and takes just a minute!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    href="/auth/signin"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all font-semibold"
                  >
                    Sign In
                  </Link>
                  <span className="text-gray-400 hidden sm:inline">or</span>
                  <Link 
                    href="/auth/signup"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg hover:from-emerald-500 hover:to-cyan-500 transition-all font-semibold"
                  >
                    Create Account
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}