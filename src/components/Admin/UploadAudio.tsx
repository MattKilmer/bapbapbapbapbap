'use client';
import { useState, useRef, useCallback } from 'react';

export function UploadAudio({ zoneId, onUploadComplete }: { zoneId: number, onUploadComplete?: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
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
  }, [zoneId, onUploadComplete]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      uploadFile(file);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [uploadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    
    if (audioFile) {
      uploadFile(audioFile);
    } else {
      alert('Please drop an audio file');
    }
  }, [uploadFile]);

  const handleClick = useCallback(() => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [uploading]);

  return (
    <div
      className={`relative cursor-pointer transition-colors rounded-lg border-2 border-dashed p-4 text-center ${
        isDragOver
          ? 'border-blue-400 bg-blue-900/30'
          : uploading
          ? 'border-gray-500 bg-gray-700/50 cursor-not-allowed'
          : 'border-gray-600 hover:border-blue-500 hover:bg-blue-900/20'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      {uploading ? (
        <div className="text-sm text-gray-300">
          <div className="animate-spin inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full mr-2"></div>
          Uploading audio...
        </div>
      ) : (
        <div className="text-sm text-gray-300">
          <div className="mb-1">📁 Click to browse or drag & drop</div>
          <div className="text-xs text-gray-400">Audio files only</div>
        </div>
      )}
    </div>
  );
}