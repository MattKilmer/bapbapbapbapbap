'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function Navigation() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="text-2xl font-bold text-white">BapBapBapBapBap</div>
          <div className="text-gray-400 text-sm font-light">Just tap it</div>
        </Link>

        <div className="flex items-center space-x-4">
          {status === 'loading' ? (
            <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
          ) : session ? (
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Dashboard
              </Link>
              <div className="text-gray-400">
                {session.user?.name || session.user?.email}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors text-sm"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/auth/signin"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors text-sm"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}