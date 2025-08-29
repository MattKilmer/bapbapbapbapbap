'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { CopyLinkButton } from '@/components/CopyLinkButton';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  image?: string;
  role: string;
  createdAt: string;
  soundboards: Array<{
    id: string;
    name: string;
    description?: string;
    plays: number;
    likes: number;
    createdAt: string;
    activeZones: number;
  }>;
}

export default function UserProfilePage() {
  const params = useParams();
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = params.username as string;
  const isOwnProfile = session?.user?.username === username;

  useEffect(() => {
    if (!username) return;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/user/${username}`);
        
        if (response.status === 404) {
          setError('User not found');
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-950 flex items-center justify-center pt-16">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-950 flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              {error || 'User not found'}
            </h1>
            <Link 
              href="/explore" 
              className="text-blue-400 hover:text-blue-300"
            >
              ← Back to Explore
            </Link>
          </div>
        </div>
      </>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-600 text-white';
      case 'ARTIST': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-950 pt-16">
        <div className="max-w-7xl mx-auto p-6">
          {/* User Header */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || user.username}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {(user.name || user.username)?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">
                    {user.name || user.username}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                
                <p className="text-gray-400 text-lg mb-3">@{user.username}</p>
                
                <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-4">
                  <div>
                    <span className="font-semibold text-white">{user.soundboards.length}</span> soundboards
                  </div>
                  <div>
                    <span className="font-semibold text-white">
                      {user.soundboards.reduce((acc, sb) => acc + sb.plays, 0)}
                    </span> total plays
                  </div>
                  <div>
                    Member since {formatDate(user.createdAt)}
                  </div>
                </div>

                {isOwnProfile && (
                  <div className="flex gap-3">
                    <Link
                      href="/settings"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm font-medium"
                    >
                      Edit Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Soundboards Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Public Soundboards ({user.soundboards.length})
            </h2>

            {user.soundboards.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">
                  This user hasnt created any public soundboards yet.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {user.soundboards.map((soundboard) => (
                  <div key={soundboard.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                        {soundboard.name}
                      </h3>
                      {soundboard.description && (
                        <p className="text-gray-400 text-sm line-clamp-3">
                          {soundboard.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-4">
                        <span>{soundboard.activeZones} zones</span>
                        <span>{soundboard.plays} plays</span>
                        {soundboard.likes > 0 && (
                          <span>{soundboard.likes} likes</span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Created {formatDate(soundboard.createdAt)}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/play/${soundboard.id}`}
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors text-center font-medium"
                      >
                        ▶ Play
                      </Link>
                      <CopyLinkButton 
                        soundboardId={soundboard.id}
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}