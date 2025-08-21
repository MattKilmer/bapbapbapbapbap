import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const lightning: Anim = {
  key: 'lightning',
  name: 'Lightning',
  schema: { branches: { type: 'number', default: 6 }, lifeMs: { type: 'number', default: 400 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const branches = cfg?.branches ?? 6;
    
    for (let i = 0; i < branches; i++) {
      const g = new Graphics();
      const angle = (i / branches) * Math.PI * 2;
      const length = 40 + Math.random() * 40;
      
      // Create zigzag lightning path
      const points: number[][] = [];
      for (let j = 0; j <= 10; j++) {
        const dist = (j / 10) * length;
        const zigzag = (Math.random() - 0.5) * 20;
        points.push([
          Math.cos(angle) * dist + Math.cos(angle + Math.PI/2) * zigzag,
          Math.sin(angle) * dist + Math.sin(angle + Math.PI/2) * zigzag
        ]);
      }
      
      g.moveTo(0, 0);
      points.forEach(([px, py]) => g.lineTo(px, py));
      g.stroke({ width: 2, color: 0xffeb3b });
      
      c.addChild(g);
    }
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const t = (performance.now() - start) / (cfg?.lifeMs ?? 400);
      c.alpha = Math.max(0, 1 - t * 2);
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};