import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const spiral: Anim = {
  key: 'spiral',
  name: 'Spiral',
  schema: { turns: { type: 'number', default: 3 }, lifeMs: { type: 'number', default: 800 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const particles = [];
    
    for (let i = 0; i < 12; i++) {
      const g = new Graphics();
      g.circle(0, 0, 4).fill(0xff6b6b);
      particles.push(g);
      c.addChild(g);
    }
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    const turns = cfg?.turns ?? 3;
    
    const tick = () => {
      const t = (performance.now() - start) / (cfg?.lifeMs ?? 800);
      
      particles.forEach((p, i) => {
        const angle = (t * turns * Math.PI * 2) + (i * (Math.PI * 2) / particles.length);
        const radius = t * 50;
        p.x = Math.cos(angle) * radius;
        p.y = Math.sin(angle) * radius;
        p.alpha = Math.max(0, 1 - t);
      });
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};