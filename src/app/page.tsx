'use client';
import { useEffect, useRef, useState } from 'react';
import { CanvasStage } from '@/components/CanvasStage';
import { GridOverlay } from '@/components/GridOverlay';
import { Application } from 'pixi.js';
import { animations } from '@/lib/animations';
import { play } from '@/lib/audio/engine';

export default function Home() {
  const [cfg, setCfg] = useState<any>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => { fetch('/api/config').then(r => r.json()).then(setCfg); }, []);
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
        console.log('Running animation:', zone.animationKey);
        anim.run({ app: appRef.current, stage: appRef.current.stage, zoneIndex, x, y, cfg: zone.animationCfg });
      }
    } else {
      console.log('PIXI app not ready, skipping animation');
    }
  };

  return (
    <main className="fixed inset-0 bg-black text-white">
      <CanvasStage />
      <GridOverlay onTap={onTap} zones={cfg?.zones} />
    </main>
  );
}
