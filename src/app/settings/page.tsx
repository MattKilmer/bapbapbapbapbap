'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from '@/components/Navigation';

interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  image: string | null;
  customImage: string | null;
  role: string;
  createdAt: string;
}

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [editingName, setEditingName] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadProfile();
    }
  }, [status, router]);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const startEditingName = () => {
    setTempName(profile?.name || '');
    setEditingName(true);
    setError(null);
    setSuccess(null);
  };

  const startEditingUsername = () => {
    setTempUsername(profile?.username || '');
    setEditingUsername(true);
    setError(null);
    setSuccess(null);
  };

  const saveName = async () => {
    if (!tempName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tempName.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setEditingName(false);
        setSuccess('Display name updated successfully!');
        // Update the session with new name
        await update({ name: data.user.name });
      } else {
        setError(data.error || 'Failed to update name');
      }
    } catch (err) {
      console.error('Error updating name:', err);
      setError('Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  const saveUsername = async () => {
    if (!tempUsername.trim()) {
      setError('Username cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: tempUsername.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setEditingUsername(false);
        setSuccess('Username updated successfully!');
        // Update the session with new username
        await update({ username: data.user.username });
      } else {
        setError(data.error || 'Failed to update username');
      }
    } catch (err) {
      console.error('Error updating username:', err);
      setError('Failed to update username');
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setEditingName(false);
    setEditingUsername(false);
    setTempName('');
    setTempUsername('');
    setError(null);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError(null);
    
    try {
      // Create form data with the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload file directly to our API
      const uploadResponse = await fetch('/api/upload-token', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }
      
      const { url: uploadedUrl } = await uploadResponse.json();
      
      // Update profile with new image URL
      const updateResponse = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customImage: uploadedUrl })
      });

      const data = await updateResponse.json();

      if (updateResponse.ok) {
        setProfile(data.user);
        setSuccess('Profile picture updated successfully!');
        // Update the session with new image
        await update({ image: data.user.customImage || data.user.image });
      } else {
        setError(data.error || 'Failed to update profile picture');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeCustomImage = async () => {
    if (!profile?.customImage) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customImage: null })
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setSuccess('Custom profile picture removed. Using default image.');
        // Update the session to use OAuth image or fallback
        await update({ image: data.user.image });
      } else {
        setError(data.error || 'Failed to remove custom image');
      }
    } catch (err) {
      console.error('Error removing custom image:', err);
      setError('Failed to remove custom image');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-950 flex items-center justify-center pt-16">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
        </div>
      </>
    );
  }

  if (!session || !profile) {
    return null;
  }

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
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link 
                href="/dashboard" 
                className="text-blue-400 hover:text-blue-300"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-gray-400">Manage your public profile information</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-600 rounded-lg text-green-200">
              {success}
            </div>
          )}

          {/* Profile Picture */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Picture</h2>
            
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0">
                {(profile.customImage || profile.image) ? (
                  <Image
                    src={profile.customImage || profile.image || ''}
                    alt={profile.name || 'Profile'}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                    priority
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {(profile.name || profile.email)?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-medium mb-2">Change your profile picture</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Upload a custom image or use your {profile.image ? 'Google' : 'default'} profile picture
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <label className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    uploadingImage 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    {uploadingImage ? 'Uploading...' : 'Upload New Picture'}
                  </label>
                  
                  {profile.customImage && (
                    <button
                      onClick={removeCustomImage}
                      disabled={saving}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? 'Removing...' : 'Remove Custom Picture'}
                    </button>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
                
                {profile.customImage && profile.image && (
                  <p className="text-xs text-gray-400 mt-2">
                    Currently using custom picture. Remove to use your Google profile picture.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Settings */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Public Profile</h2>
            
            {/* Display Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              {editingName ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Your display name"
                    maxLength={50}
                    autoFocus
                  />
                  <button
                    onClick={saveName}
                    disabled={saving || !tempName.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? '...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span className="text-white">{profile.name || 'Not set'}</span>
                  <button
                    onClick={startEditingName}
                    className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-400 mt-1">
                This is how your name will appear to other users
              </p>
            </div>

            {/* Username */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              {editingUsername ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="your_username"
                    maxLength={20}
                    autoFocus
                  />
                  <button
                    onClick={saveUsername}
                    disabled={saving || !tempUsername.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? '...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <span className="text-white">
                      {profile.username ? `@${profile.username}` : 'Not set'}
                    </span>
                    {profile.username && (
                      <div className="text-sm text-gray-400 mt-1">
                        Profile URL: /user/{profile.username}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={startEditingUsername}
                    className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {profile.username ? 'Edit' : 'Set Username'}
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-400 mt-1">
                Your unique identifier. Letters, numbers, and underscores only.
              </p>
            </div>

            {/* View Profile Link */}
            {profile.username && (
              <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 font-medium">Your public profile is live!</p>
                    <p className="text-blue-400 text-sm">Other users can find you at this URL</p>
                  </div>
                  <Link
                    href={`/user/${profile.username}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Account Information */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="p-3 bg-gray-700 rounded-lg text-gray-400">
                  {profile.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Account Type
                </label>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.role === 'ADMIN' ? 'bg-red-600 text-white' :
                    profile.role === 'ARTIST' ? 'bg-purple-600 text-white' :
                    'bg-gray-600 text-gray-300'
                  }`}>
                    {profile.role}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Member Since
                </label>
                <div className="p-3 bg-gray-700 rounded-lg text-gray-300">
                  {formatDate(profile.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}