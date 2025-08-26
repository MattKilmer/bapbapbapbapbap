'use client';
import { useEffect, useRef, useState } from 'react';
import { CanvasStage } from '@/components/CanvasStage';
import { GridOverlay } from '@/components/GridOverlay';
import { Navigation } from '@/components/Navigation';
import { Application } from 'pixi.js';
import { animations } from '@/lib/animations';
import { play } from '@/lib/audio/engine';
import Image from 'next/image';

export default function Home() {
  const [cfg, setCfg] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isFirstTap, setIsFirstTap] = useState(true);
  const appRef = useRef<Application | null>(null);

  useEffect(() => { 
    const loadConfig = () => fetch('/api/config')
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        }
        return r.json();
      })
      .then(data => {
        setCfg(data);
      })
      .catch(error => {
        console.error('Failed to load config:', error);
      });
    
    // Load config initially
    loadConfig();
    
    // Poll for updates every 2 seconds to catch admin changes
    const interval = setInterval(loadConfig, 2000);
    
    return () => clearInterval(interval);
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

  const onTap = (zoneIndex: number, x: number, y: number) => {
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

  return (
    <main className="fixed inset-0 bg-black text-white">
      <Navigation />
      
      {/* Playing Area Container */}
      <div className="fixed top-14 left-0 right-0 bottom-0">
        {/* Pulsing glow border */}
        <div className="absolute inset-0 pointer-events-none z-40">
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
        <div className={`fixed inset-0 flex items-center justify-center z-30 pointer-events-none transition-opacity duration-1000 ${
          !isFirstTap ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="text-center px-4 max-w-6xl mx-auto">
            <div className="mb-6 md:mb-12 flex justify-center">
              <Image
                src="/logo-large.png"
                alt="BapBapBapBapBap"
                width={600}
                height={150}
                className="w-full max-w-2xl h-auto"
                style={{ 
                  filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.5)) drop-shadow(0 0 60px rgba(255,255,255,0.3))',
                  transform: 'translate(5%, -10%)'
                }}
                priority
              />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4 md:mb-8 tracking-wider leading-tight" 
                style={{ 
                  fontFamily: 'var(--font-comfortaa)',
                  textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.3)',
                  letterSpacing: '0.1em',
                  fontWeight: '300'
                }}>
              Welcome
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 font-light tracking-wide animate-pulse"
               style={{ 
                 fontFamily: 'var(--font-comfortaa)',
                 textShadow: '0 0 20px rgba(255,255,255,0.3)',
                 fontWeight: '300'
               }}>
              Tap the screen to begin
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
