'use client';
import { useEffect, useRef, useState } from 'react';
import { CanvasStage } from '@/components/CanvasStage';
import { GridOverlay } from '@/components/GridOverlay';
import { Navigation } from '@/components/Navigation';
import { Application } from 'pixi.js';
import { animations } from '@/lib/animations';
import { play } from '@/lib/audio/engine';
import Link from 'next/link';

export default function PlaySoundboard({ params }: { params: Promise<{ id: string }> }) {
  const [cfg, setCfg] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isFirstTap, setIsFirstTap] = useState(true);
  const [soundboardId, setSoundboardId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setSoundboardId(id);
      loadConfig(id);
    });
  }, []);

  useEffect(() => { 
    // Check for PIXI app periodically until it's available
    const checkApp = () => {
      const app = (window as any).__pixiApp;
      if (app) {
        appRef.current = app;
        // PIXI app ready
      } else {
        setTimeout(checkApp, 100);
      }
    };
    checkApp();
  }, []);

  const loadConfig = (soundboardId?: string) => {
    const url = soundboardId ? `/api/config?soundboardId=${soundboardId}` : '/api/config';
    
    fetch(url)
      .then(r => {
        if (!r.ok) {
          throw new Error('Soundboard not found');
        }
        return r.json();
      })
      .then(data => {
        setCfg(data);
        setError('');
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading soundboard:', error);
        setError('Soundboard not found or unavailable');
        setLoading(false);
      });
  };

  const onTap = (zoneIndex: number, x: number, y: number) => {
    // Increment play count on first tap
    if (isFirstTap && soundboardId) {
      fetch(`/api/soundboards/${soundboardId}/play`, { method: 'POST' })
        .catch(() => {}); // Ignore play count increment errors
    }

    // Handle first tap welcome message
    if (isFirstTap) {
      setIsFirstTap(false);
      // Start fade out animation, then remove from DOM after transition
      setTimeout(() => setShowWelcome(false), 1000);
    }
    
    if (!cfg) {
      return;
    }
    
    const zone = cfg.zones[zoneIndex];
    
    const sample = zone?.samples?.length
      ? zone.samples[Math.floor(Math.random() * zone.samples.length)]
      : null;
    
    if (sample) {
      play(sample.url, sample.gainDb);
    }
    
    // Only run animation if PIXI app is available
    if (appRef.current) {
      const anim = animations[zone.animationKey];
      if (anim) {
        // Use dynamic global scale from settings
        const scaledCfg = {
          ...zone.animationCfg,
          globalScale: cfg.globalScale || 1
        };
        anim.run({ app: appRef.current, stage: appRef.current.stage, zoneIndex, x, y, cfg: scaledCfg });
      }
    }
  };

  if (loading) {
    return (
      <main className="fixed inset-0 bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-300">Loading soundboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="fixed inset-0 bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎵</div>
          <h1 className="text-2xl font-bold mb-2">Soundboard Not Found</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link 
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Go to Main Soundboard
          </Link>
        </div>
      </main>
    );
  }

  const soundboardName = cfg?.soundboard?.name || 'Soundboard';
  const creatorName = cfg?.soundboard?.creator?.name || cfg?.soundboard?.creator?.email;

  return (
    <main className="fixed inset-0 bg-black text-white">
      <Navigation />
      
      {/* Secondary Navigation Bar with Soundboard Info */}
      {cfg?.soundboard && (
        <div className="fixed top-14 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-gray-800 h-10">
          <div className="container mx-auto px-4 flex items-center justify-center h-full">
            <div className="text-sm font-medium text-white">{soundboardName}</div>
            {creatorName && (
              <div className="text-xs text-gray-400 ml-2">by {creatorName}</div>
            )}
          </div>
        </div>
      )}

      {/* Playing Area Container */}
      <div className={`fixed ${cfg?.soundboard ? 'top-24' : 'top-14'} left-0 right-0 bottom-0`}>
        {/* Pulsing glow border */}
        <div className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute inset-0" 
               style={{
                 animation: 'pulse-glow 5s ease-in-out infinite',
                 margin: '0',
                 boxSizing: 'border-box'
               }}>
          </div>
        </div>
        <CanvasStage />
        <GridOverlay onTap={onTap} zones={cfg?.zones} />
      </div>
      
      {/* Welcome Message */}
      {showWelcome && (
        <div className={`fixed inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-1000 ${
          !isFirstTap ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="text-center px-4 max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white mb-4 md:mb-8 tracking-wider leading-tight" 
                style={{ 
                  fontFamily: 'var(--font-comfortaa)',
                  textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.3)',
                  letterSpacing: '0.1em',
                  fontWeight: '300'
                }}>
              {soundboardName}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 font-light tracking-wide animate-pulse"
               style={{ 
                 fontFamily: 'var(--font-comfortaa)',
                 textShadow: '0 0 20px rgba(255,255,255,0.3)',
                 fontWeight: '300'
               }}>
              Just tap it
            </p>
            {creatorName && (
              <p className="text-sm md:text-base text-white/60 mt-4">
                Created by {creatorName}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}