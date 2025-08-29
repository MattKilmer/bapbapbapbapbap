'use client';
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import Link from 'next/link';

interface Soundboard {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  plays: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
  zonesWithSamples: number;
  totalZones: number;
}

export default function AdminSoundboardsPage() {
  const [soundboards, setSoundboards] = useState<Soundboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<keyof Soundboard>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchSoundboards();
  }, []);

  const fetchSoundboards = async () => {
    try {
      const response = await fetch('/api/admin/soundboards');
      if (response.ok) {
        const data = await response.json();
        setSoundboards(data.soundboards);
      }
    } catch (error) {
      console.error('Failed to fetch soundboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (soundboardId: string, isPublic: boolean) => {
    try {
      const response = await fetch(`/api/soundboards/${soundboardId}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !isPublic })
      });

      if (response.ok) {
        setSoundboards(soundboards.map(sb => 
          sb.id === soundboardId ? { ...sb, isPublic: !isPublic } : sb
        ));
      } else {
        alert('Failed to update soundboard visibility');
      }
    } catch (error) {
      console.error('Failed to update visibility:', error);
      alert('Failed to update soundboard visibility');
    }
  };

  const deleteSoundboard = async (soundboardId: string) => {
    if (!confirm('Are you sure you want to delete this soundboard? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/soundboards/${soundboardId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSoundboards(soundboards.filter(sb => sb.id !== soundboardId));
      } else {
        alert('Failed to delete soundboard');
      }
    } catch (error) {
      console.error('Failed to delete soundboard:', error);
      alert('Failed to delete soundboard');
    }
  };

  const filteredSoundboards = soundboards
    .filter(sb => {
      const matchesSearch = sb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sb.creator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sb.creator.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVisibility = visibilityFilter === 'all' || 
                                (visibilityFilter === 'public' && sb.isPublic) ||
                                (visibilityFilter === 'private' && !sb.isPublic);
      return matchesSearch && matchesVisibility;
    })
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 bg-gray-950 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-300">Loading soundboards...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Soundboards Management</h1>
            <p className="text-gray-300">View, moderate, and manage all soundboards on the platform</p>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search soundboards by name or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
              
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="all">All Soundboards</option>
                <option value="public">Public Only</option>
                <option value="private">Private Only</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as keyof Soundboard);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="updatedAt-desc">Recently Updated</option>
                <option value="createdAt-desc">Recently Created</option>
                <option value="plays-desc">Most Plays</option>
                <option value="name-asc">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Soundboards Table */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Soundboard
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Creator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Zones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Plays
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredSoundboards.length > 0 ? (
                    filteredSoundboards.map((soundboard) => (
                      <tr key={soundboard.id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {soundboard.name}
                            </div>
                            {soundboard.description && (
                              <div className="text-sm text-gray-400 truncate max-w-xs">
                                {soundboard.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {(soundboard.creator.name?.charAt(0) || soundboard.creator.email.charAt(0)).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-white">
                                {soundboard.creator.name || 'Anonymous'}
                              </div>
                              <div className="text-sm text-gray-400">{soundboard.creator.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleVisibility(soundboard.id, soundboard.isPublic)}
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              soundboard.isPublic
                                ? 'bg-green-600 text-white hover:bg-green-500'
                                : 'bg-gray-600 text-white hover:bg-gray-500'
                            } transition-colors`}
                          >
                            {soundboard.isPublic ? 'Public' : 'Private'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {soundboard.zonesWithSamples}/{soundboard.totalZones} active
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {soundboard.plays.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {new Date(soundboard.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/play/${soundboard.id}`}
                              target="_blank"
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="View soundboard"
                            >
                              View
                            </Link>
                            <Link
                              href={`/soundboard/${soundboard.id}/edit`}
                              className="text-green-400 hover:text-green-300 transition-colors"
                              title="Edit soundboard"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => deleteSoundboard(soundboard.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete soundboard"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        No soundboards found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 text-sm text-gray-400">
            Showing {filteredSoundboards.length} of {soundboards.length} soundboards
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}