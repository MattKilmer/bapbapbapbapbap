'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export function Navigation() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800 h-14">
      <div className="container mx-auto px-4 py-0 flex items-center justify-between h-full">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <Image
            src="/logo-small.png"
            alt="BapBapBapBapBap"
            width={300}
            height={80}
            className="h-12 w-auto sm:h-14"
            style={{ transform: 'translate(5%, -10%)' }}
            priority
          />
          <div className="text-gray-400 text-xs sm:text-sm font-light hidden xs:block">Just tap it</div>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <Link 
            href="/explore"
            className="text-white hover:text-blue-400 transition-colors text-sm sm:text-base"
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
              <Link 
                href="/dashboard"
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm max-w-20 sm:max-w-none truncate"
              >
                {session.user?.name || session.user?.email}
              </Link>
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
                className="px-2 py-1 sm:px-4 sm:py-2 border border-white text-white rounded hover:bg-white hover:text-black transition-colors text-xs sm:text-sm whitespace-nowrap"
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