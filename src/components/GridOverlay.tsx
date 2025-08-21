'use client';
import { useEffect } from 'react';

export function GridOverlay({ onTap, zones }: { onTap: (zone: number, x: number, y: number) => void, zones?: any[] }) {
  useEffect(() => {
    const el = document.getElementById('tap-overlay')!;
    const handler = (e: PointerEvent) => {
      const r = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const col = Math.floor((x / r.width) * 4);
      const row = Math.floor((y / r.height) * 4);
      onTap(row * 4 + col, e.clientX, e.clientY);
    };
    el.addEventListener('pointerdown', handler);
    return () => el.removeEventListener('pointerdown', handler);
  }, [onTap]);

  return (
    <div id="tap-overlay" className="fixed inset-0 touch-none">
    </div>
  );
}