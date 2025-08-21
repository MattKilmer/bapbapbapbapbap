'use client';
import { useEffect, useRef, useState } from 'react';
import { CanvasStage } from '@/components/CanvasStage';
import { GridOverlay } from '@/components/GridOverlay';
import { Application } from 'pixi.js';
import { animations } from '@/lib/animations';
import { play } from '@/lib/audio/engine';

export default function Home() {
  const [cfg, setCfg] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isFirstTap, setIsFirstTap] = useState(true);
  const appRef = useRef<Application | null>(null);

  useEffect(() => { 
    const loadConfig = () => fetch('/api/config').then(r => r.json()).then(data => {
      console.log('Main app received config with globalScale:', data.globalScale, 'at', new Date().toLocaleTimeString());
      setCfg(data);
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
        console.log('PIXI app found and set');
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
    
    console.log('Zone tapped:', zoneIndex);
    if (!cfg) {
      console.log('Missing cfg:', { cfg: !!cfg });
      return;
    }
    
    const zone = cfg.zones[zoneIndex];
    console.log('Zone data:', zone);
    
    const sample = zone?.samples?.length
      ? zone.samples[Math.floor(Math.random() * zone.samples.length)]
      : null;
    console.log('Selected sample:', sample);
    
    if (sample) {
      console.log('Playing audio:', sample.url, 'gain:', sample.gainDb);
      play(sample.url, sample.gainDb);
    } else {
      console.log('No sample to play');
    }
    
    // Only run animation if PIXI app is available
    if (appRef.current) {
      const anim = animations[zone.animationKey];
      if (anim) {
        console.log('Running animation:', zone.animationKey, 'with cfg.globalScale:', cfg.globalScale);
        // Use dynamic global scale from settings
        const scaledCfg = {
          ...zone.animationCfg,
          globalScale: cfg.globalScale || 2
        };
        console.log('scaledCfg passed to animation:', scaledCfg);
        anim.run({ app: appRef.current, stage: appRef.current.stage, zoneIndex, x, y, cfg: scaledCfg });
      }
    } else {
      console.log('PIXI app not ready, skipping animation');
    }
  };

  return (
    <main className="fixed inset-0 bg-black text-white">
      {/* Pulsing glow border */}
      <div className="fixed inset-0 pointer-events-none z-50">
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
      
      {/* Welcome Message */}
      {showWelcome && (
        <div className={`fixed inset-0 flex items-center justify-center z-40 pointer-events-none transition-opacity duration-1000 ${
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
              Welcome to BapBapBapBapBap
            </h1>
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
