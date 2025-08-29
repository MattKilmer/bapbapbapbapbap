import Link from 'next/link';
import { Navigation } from '@/components/Navigation';

export default function AccessDeniedPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-950 flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-6">🚫</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-400 mb-6">
            You need administrator privileges to access this area.
          </p>
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}