'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">My Soundboards</h3>
            <p className="text-gray-400 mb-4">Create and manage your soundboards</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition-colors">
              Create Soundboard
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Explore</h3>
            <p className="text-gray-400 mb-4">Discover soundboards from other creators</p>
            <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-500 transition-colors">
              Browse Soundboards
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Account</h3>
            <p className="text-gray-400 mb-4">Manage your profile and settings</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-500 transition-colors">
              Account Settings
            </button>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Session Info</h3>
          <pre className="text-sm text-gray-300 bg-gray-900 p-4 rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}