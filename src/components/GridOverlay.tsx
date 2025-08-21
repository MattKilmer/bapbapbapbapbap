'use client';
import { useEffect } from 'react';

export function GridOverlay({ onTap }: { onTap: (zone: number, x: number, y: number) => void }) {
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
      {/* 4x4 Grid Debug Overlay */}
      <div className="grid grid-cols-4 grid-rows-4 w-full h-full pointer-events-none">
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className="border border-white/30 flex items-center justify-center"
          >
            <span className="text-white/60 text-sm font-mono bg-black/40 px-2 py-1 rounded">
              Zone {i}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}