'use client';
import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';

export function CanvasStage() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const app = new Application();
    app.init({ background: '#000000', resizeTo: window, antialias: true }).then(() => {
      ref.current!.appendChild(app.canvas);
      (window as any).__pixiApp = app; // simple sharing
    });
    return () => app.destroy(true);
  }, []);
  return <div ref={ref} className="fixed inset-0" />;
}