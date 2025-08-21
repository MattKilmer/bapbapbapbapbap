'use client';
import { useState } from 'react';

export function UploadAudio({ zoneId, onUploadComplete }: { zoneId: number, onUploadComplete?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const onUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      // Upload file using FormData to our API
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('/api/upload-token', {
        method: 'POST',
        body: formData
      });
      
      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(`Upload failed: ${errorData.error || 'Unknown error'}`);
      }
      
      const { url, filename } = await uploadRes.json();
      console.log('File uploaded:', { url, filename });
      
      // Save to database
      const sampleRes = await fetch(`/api/zones/${zoneId}/samples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, label: filename })
      });
      
      if (sampleRes.ok) {
        setFile(null);
        onUploadComplete?.();
        alert('✅ Audio uploaded successfully!');
      } else {
        const errorData = await sampleRes.json();
        console.error('Sample save error:', errorData);
        throw new Error(`Failed to save sample: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input 
          type="file" 
          accept="audio/*" 
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-xs text-gray-900 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer hover:file:bg-blue-600"
        />
      </div>
      {file && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-800 truncate flex-1">{file.name}</span>
          <button 
            onClick={onUpload}
            disabled={uploading}
            className={`ml-2 px-3 py-1 text-white text-xs rounded transition-colors ${
              uploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload'}
          </button>
        </div>
      )}
      {!file && !uploading && (
        <div className="text-xs text-gray-700 text-center">
          Choose an audio file to upload
        </div>
      )}
    </div>
  );
}