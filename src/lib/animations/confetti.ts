import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const confetti: Anim = {
  key: 'confetti',
  name: 'Confetti',
  schema: { 
    count: { type: 'number', default: 20 }, 
    spread: { type: 'number', default: 80 },
    lifeMs: { type: 'number', default: 2000 } 
  },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const count = cfg?.count ?? 20;
    const spread = (cfg?.spread ?? 80) * (cfg?.globalScale ?? 1);
    const lifeMs = cfg?.lifeMs ?? 2000;
    const globalScale = cfg?.globalScale ?? 1;
    
    c.x = x; c.y = y; stage.addChild(c);
    
    const particles: any[] = [];
    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0xf0932b, 0xeb4d4b, 0x6c5ce7];
    
    for (let i = 0; i < count; i++) {
      const particle = new Graphics();
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = (3 + Math.random() * 4) * globalScale;
      
      particle.rect(-size/2, -size/2, size, size).fill(color);
      c.addChild(particle);
      
      const angle = (Math.random() - 0.5) * Math.PI;
      const velocity = (2 + Math.random() * 4) * globalScale;
      
      particles.push({
        graphic: particle,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 3,
        rotation: Math.random() * 0.2 - 0.1,
        gravity: 0.15
      });
    }
    
    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / lifeMs;
      
      if (t <= 1) {
        particles.forEach(p => {
          p.vy += p.gravity;
          p.graphic.x += p.vx;
          p.graphic.y += p.vy;
          p.graphic.rotation += p.rotation;
          p.graphic.alpha = Math.max(0, 1 - t);
        });
        requestAnimationFrame(tick);
      } else {
        c.destroy();
      }
    };
    requestAnimationFrame(tick);
  }
};