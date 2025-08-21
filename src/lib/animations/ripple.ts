import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const ripple: Anim = {
  key: 'ripple',
  name: 'Ripple',
  schema: { 
    rings: { type: 'number', default: 3 }, 
    maxRadius: { type: 'number', default: 100 }, 
    lifeMs: { type: 'number', default: 1000 } 
  },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const rings = cfg?.rings ?? 3;
    const maxRadius = cfg?.maxRadius ?? 100;
    const lifeMs = cfg?.lifeMs ?? 1000;
    
    c.x = x; c.y = y; stage.addChild(c);
    
    for (let i = 0; i < rings; i++) {
      const g = new Graphics();
      g.circle(0, 0, 1).stroke({ width: 2, color: 0x00aaff });
      c.addChild(g);
      
      const delay = (i * lifeMs) / (rings * 2);
      const start = performance.now() + delay;
      
      const tick = () => {
        const elapsed = performance.now() - start;
        if (elapsed < 0) {
          requestAnimationFrame(tick);
          return;
        }
        
        const t = elapsed / lifeMs;
        if (t <= 1) {
          const radius = t * maxRadius;
          g.clear().circle(0, 0, radius).stroke({ 
            width: 2, 
            color: 0x00aaff,
            alpha: Math.max(0, 1 - t)
          });
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    }
    
    setTimeout(() => c.destroy(), lifeMs + (rings * lifeMs) / (rings * 2));
  }
};