import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const tornado: Anim = {
  key: 'tornado',
  name: 'Tornado',
  schema: { particles: { type: 'number', default: 20 }, lifeMs: { type: 'number', default: 1500 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const particles: any[] = [];
    const particleCount = cfg?.particles ?? 20;
    const globalScale = cfg?.globalScale ?? 1;
    
    for (let i = 0; i < particleCount; i++) {
      const g = new Graphics();
      g.circle(0, 0, 2 * globalScale).fill(0x90ee90);
      particles.push({
        graphic: g,
        height: Math.random() * 100, // Keep as 0-100 for calculation
        speed: 0.5 + Math.random() * 1.5,
        offset: Math.random() * Math.PI * 2,
        globalScale: globalScale
      });
      c.addChild(g);
    }
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const t = (performance.now() - start) / (cfg?.lifeMs ?? 1500);
      
      particles.forEach((particle, i) => {
        const angle = t * particle.speed * Math.PI * 2 + particle.offset;
        const radius = (1 - particle.height / 100) * 30 * particle.globalScale * (1 - t * 0.5);
        
        particle.graphic.x = Math.cos(angle) * radius;
        particle.graphic.y = (-particle.height * particle.globalScale) + t * 120 * particle.globalScale;
        particle.graphic.alpha = Math.max(0, 1 - t);
      });
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};