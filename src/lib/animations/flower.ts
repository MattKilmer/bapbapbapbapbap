import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const flower: Anim = {
  key: 'flower',
  name: 'Flower',
  schema: { petals: { type: 'number', default: 8 }, lifeMs: { type: 'number', default: 1200 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const petals = cfg?.petals ?? 8;
    const petalGraphics = [];
    
    for (let i = 0; i < petals; i++) {
      const g = new Graphics();
      const angle = (i / petals) * Math.PI * 2;
      
      // Draw petal shape
      g.moveTo(0, 0);
      g.bezierCurveTo(10, -15, 25, -10, 30, 0);
      g.bezierCurveTo(25, 10, 10, 15, 0, 0);
      g.fill(0xff69b4);
      
      g.rotation = angle;
      g.scale.set(0);
      
      petalGraphics.push(g);
      c.addChild(g);
    }
    
    // Add center
    const center = new Graphics();
    center.circle(0, 0, 8).fill(0xffd700);
    center.scale.set(0);
    c.addChild(center);
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const t = (performance.now() - start) / (cfg?.lifeMs ?? 1200);
      
      // Animate petals growing
      petalGraphics.forEach((petal, i) => {
        const petalDelay = i * 0.1;
        const petalT = Math.max(0, Math.min(1, (t - petalDelay) * 2));
        petal.scale.set(petalT);
      });
      
      // Animate center
      const centerT = Math.max(0, Math.min(1, (t - 0.5) * 2));
      center.scale.set(centerT);
      
      // Fade out
      if (t > 0.7) {
        c.alpha = Math.max(0, 1 - ((t - 0.7) / 0.3));
      }
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};