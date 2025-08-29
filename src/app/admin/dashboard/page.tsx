'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalSoundboards: number;
  totalPlays: number;
  activeSessions: number;
  userGrowth: number;
  popularSoundboards: Array<{
    id: string;
    name: string;
    plays: number;
    creator: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (session?.user.role !== 'ADMIN') {
      router.push('/access-denied');
      return;
    }

    loadStats();
  }, [status, session, router]);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading || !session) {
    return (
      <AdminLayout>
        <div className="p-6 bg-gray-950 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-300">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (session.user.role !== 'ADMIN') {
    return null; // Will redirect in useEffect
  }

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Overview of your BapBapBapBapBap platform</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
                  {stats?.userGrowth && (
                    <p className={`text-sm ${stats.userGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stats.userGrowth > 0 ? '+' : ''}{stats.userGrowth}% this month
                    </p>
                  )}
                </div>
                <div className="text-blue-400 text-2xl">👥</div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Soundboards</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalSoundboards || 0}</p>
                  <p className="text-sm text-gray-400">Total created</p>
                </div>
                <div className="text-purple-400 text-2xl">🎵</div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Plays</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalPlays || 0}</p>
                  <p className="text-sm text-gray-400">All time</p>
                </div>
                <div className="text-green-400 text-2xl">▶️</div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Active Today</p>
                  <p className="text-3xl font-bold text-white">{stats?.activeSessions || 0}</p>
                  <p className="text-sm text-gray-400">Sessions</p>
                </div>
                <div className="text-yellow-400 text-2xl">⚡</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Popular Soundboards */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Popular Soundboards</h2>
                <Link
                  href="/admin/soundboards"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {stats?.popularSoundboards && stats.popularSoundboards.length > 0 ? (
                  stats.popularSoundboards.map((soundboard, index) => (
                    <div key={soundboard.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{soundboard.name}</p>
                          <p className="text-gray-400 text-sm">by {soundboard.creator}</p>
                        </div>
                      </div>
                      <div className="text-gray-300 text-sm">
                        {soundboard.plays} plays
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No soundboards yet</p>
                )}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Recent Users</h2>
                <Link
                  href="/admin/users"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name || 'Anonymous'}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-gray-300 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No users yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/users"
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <div className="text-blue-400 text-xl mb-2">👥</div>
                <h3 className="text-white font-medium mb-1">Manage Users</h3>
                <p className="text-gray-400 text-sm">View, edit, and manage user accounts</p>
              </Link>

              <Link
                href="/admin/soundboards"
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <div className="text-purple-400 text-xl mb-2">🎵</div>
                <h3 className="text-white font-medium mb-1">Manage Soundboards</h3>
                <p className="text-gray-400 text-sm">View and moderate soundboards</p>
              </Link>

              <Link
                href="/admin/builder"
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <div className="text-green-400 text-xl mb-2">🔧</div>
                <h3 className="text-white font-medium mb-1">Zone Builder</h3>
                <p className="text-gray-400 text-sm">Configure zones and animations</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}