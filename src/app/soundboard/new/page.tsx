'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function NewSoundboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (name.trim().length === 0) {
      setError('Please enter a name for your soundboard');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/soundboards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          isPublic,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/soundboard/${data.soundboard.id}/edit`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create soundboard');
      }
    } catch (error) {
      console.error('Error creating soundboard:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/dashboard" 
              className="text-blue-400 hover:text-blue-300 inline-flex items-center mb-4"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold mb-2">Create New Soundboard</h1>
            <p className="text-gray-300">Set up your new 4×4 interactive sound grid</p>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            {error && (
              <div className="mb-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Soundboard Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={50}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="My Awesome Soundboard"
                />
                <p className="text-xs text-gray-400 mt-1">{name.length}/50 characters</p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your soundboard (optional)"
                />
                <p className="text-xs text-gray-400 mt-1">{description.length}/200 characters</p>
              </div>

              <div className="flex items-center">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm font-medium text-white">
                  List in explore section (recommended)
                </label>
              </div>
              <p className="text-xs text-gray-400 ml-6 -mt-2">
                All soundboards can be shared with direct links. This option makes it discoverable in the explore section.
              </p>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <strong>16 empty zones</strong> will be created for your soundboard
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      You&apos;ll be taken to the <strong>editor</strong> to upload audio samples
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <strong>Customize animations</strong> and settings for each zone
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading || name.trim().length === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    loading || name.trim().length === 0
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Soundboard'
                  )}
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}