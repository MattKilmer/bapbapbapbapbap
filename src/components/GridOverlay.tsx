'use client';
import { useEffect, useRef } from 'react';

export function GridOverlay({ onTap, zones }: { onTap: (zone: number, x: number, y: number) => void, zones?: any[] }) {
  const boundsRef = useRef<DOMRect | null>(null);
  
  useEffect(() => {
    const el = document.getElementById('tap-overlay')!;
    
    // Cache bounds on mount and resize
    const updateBounds = () => {
      boundsRef.current = el.getBoundingClientRect();
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);
    
    const handler = (e: PointerEvent) => {
      // Use cached bounds instead of getBoundingClientRect() on every tap
      const r = boundsRef.current;
      if (!r) return;
      
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const col = Math.floor((x / r.width) * 4);
      const row = Math.floor((y / r.height) * 4);
      onTap(row * 4 + col, x, y);
    };
    
    el.addEventListener('pointerdown', handler);
    return () => {
      el.removeEventListener('pointerdown', handler);
      window.removeEventListener('resize', updateBounds);
    };
  }, [onTap]);

  return (
    <div id="tap-overlay" className="absolute inset-0 touch-none">
    </div>
  );
}