'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function Navigation() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div className="text-lg sm:text-2xl font-bold text-white truncate">BapBapBapBapBap</div>
          <div className="text-gray-400 text-xs sm:text-sm font-light hidden xs:block">Just tap it</div>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <Link 
            href="/explore"
            className="text-white hover:text-blue-400 transition-colors hidden md:block"
          >
            Explore
          </Link>

          {status === 'loading' ? (
            <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
          ) : session ? (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                href="/dashboard"
                className="text-white hover:text-blue-400 transition-colors text-sm sm:text-base"
              >
                Dashboard
              </Link>
              <div className="text-gray-400 text-xs sm:text-sm max-w-24 sm:max-w-none truncate hidden sm:block">
                {session.user?.name || session.user?.email}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-2 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors text-xs sm:text-sm"
              >
                <span className="sm:hidden">Out</span>
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="/auth/signin"
                className="text-white hover:text-blue-400 transition-colors text-sm sm:text-base"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="px-2 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors text-xs sm:text-sm whitespace-nowrap"
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