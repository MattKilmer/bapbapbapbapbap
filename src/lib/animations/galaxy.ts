import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const galaxy: Anim = {
  key: 'galaxy',
  name: 'Galaxy',
  schema: { stars: { type: 'number', default: 30 }, lifeMs: { type: 'number', default: 2500 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const stars = [];
    const starCount = cfg?.stars ?? 30;
    
    for (let i = 0; i < starCount; i++) {
      const g = new Graphics();
      const size = 1 + Math.random() * 3;
      const brightness = Math.random();
      const color = brightness > 0.7 ? 0xffffff : brightness > 0.4 ? 0x87ceeb : 0x4169e1;
      
      g.circle(0, 0, size).fill(color);
      
      const distance = 10 + Math.random() * 60;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.7;
      
      stars.push({
        graphic: g,
        distance,
        angle,
        speed,
        originalAlpha: brightness
      });
      
      c.addChild(g);
    }
    
    // Add central bright star
    const center = new Graphics();
    center.circle(0, 0, 6).fill(0xffd700);
    center.alpha = 0;
    c.addChild(center);
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const t = (performance.now() - start) / (cfg?.lifeMs ?? 2500);
      
      // Animate center star
      if (t < 0.2) {
        center.alpha = t / 0.2;
      } else if (t > 0.8) {
        center.alpha = Math.max(0, 1 - (t - 0.8) / 0.2);
      }
      
      // Animate spiral
      stars.forEach((star) => {
        star.angle += star.speed * 0.05;
        const spiralRadius = star.distance * (0.5 + t * 0.5);
        
        star.graphic.x = Math.cos(star.angle) * spiralRadius;
        star.graphic.y = Math.sin(star.angle) * spiralRadius;
        
        // Twinkling effect
        star.graphic.alpha = star.originalAlpha * (0.5 + 0.5 * Math.sin(performance.now() * 0.01 + star.angle));
        
        if (t > 0.7) {
          star.graphic.alpha *= Math.max(0, 1 - (t - 0.7) / 0.3);
        }
      });
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};