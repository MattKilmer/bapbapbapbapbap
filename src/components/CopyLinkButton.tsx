'use client';

import { useState } from 'react';

interface CopyLinkButtonProps {
  soundboardId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon';
  className?: string;
}

export function CopyLinkButton({ 
  soundboardId, 
  size = 'sm', 
  variant = 'button',
  className = ''
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);

  const playUrl = `${window.location.origin}/play/${soundboardId}`;

  const handleCopyLink = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(playUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = playUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        alert(`Copy this link: ${playUrl}`);
      }
      document.body.removeChild(textArea);
    } finally {
      setCopying(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = `
    rounded font-medium transition-all duration-200 
    ${copied ? 'bg-green-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-500'}
    ${copying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  if (variant === 'icon') {
    return (
      <button
        onClick={handleCopyLink}
        disabled={copying}
        className={`p-2 rounded transition-colors ${
          copied 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-600 text-white hover:bg-gray-500'
        } ${copying ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        title={copied ? 'Link copied!' : 'Copy share link'}
      >
        {copying ? '⏳' : copied ? '✓' : '🔗'}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopyLink}
      disabled={copying}
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      title={copied ? 'Link copied to clipboard!' : 'Copy share link'}
    >
      {copying ? (
        '⏳ Copying...'
      ) : copied ? (
        '✓ Copied!'
      ) : (
        '🔗 Copy Link'
      )}
    </button>
  );
}