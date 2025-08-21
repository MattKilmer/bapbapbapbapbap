import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const pulse: Anim = {
  key: 'pulse',
  name: 'Pulse',
  schema: { rings: { type: 'number', default: 4 }, lifeMs: { type: 'number', default: 1000 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const rings: any[] = [];
    const ringCount = cfg?.rings ?? 4;
    
    for (let i = 0; i < ringCount; i++) {
      const g = new Graphics();
      g.circle(0, 0, 30).stroke({ width: 3, color: 0x4ecdc4 });
      rings.push({ graphic: g, delay: i * 200 });
      c.addChild(g);
    }
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const elapsed = performance.now() - start;
      const totalLife = cfg?.lifeMs ?? 1000;
      
      rings.forEach((ring) => {
        const t = Math.max(0, (elapsed - ring.delay) / totalLife);
        if (t > 0 && t <= 1) {
          ring.graphic.scale.set(1 + t * 2);
          ring.graphic.alpha = Math.max(0, 1 - t);
        }
      });
      
      if (elapsed < totalLife + 800) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};