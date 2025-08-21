import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const firework: Anim = {
  key: 'firework',
  name: 'Firework',
  schema: { sparks: { type: 'number', default: 16 }, lifeMs: { type: 'number', default: 2000 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const sparks = [];
    const sparkCount = cfg?.sparks ?? 16;
    const colors = [0xff4757, 0x3742fa, 0x2ed573, 0xffa502, 0xff6b6b];
    
    for (let i = 0; i < sparkCount; i++) {
      const g = new Graphics();
      const color = colors[Math.floor(Math.random() * colors.length)];
      g.circle(0, 0, 3).fill(color);
      
      const angle = (i / sparkCount) * Math.PI * 2;
      const velocity = 1 + Math.random() * 2;
      
      sparks.push({
        graphic: g,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        gravity: 0.1,
        life: 0.8 + Math.random() * 0.4
      });
      c.addChild(g);
    }
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const t = (performance.now() - start) / (cfg?.lifeMs ?? 2000);
      
      sparks.forEach((spark) => {
        const sparkT = t / spark.life;
        if (sparkT <= 1) {
          spark.graphic.x += spark.vx * 2;
          spark.graphic.y += spark.vy * 2;
          spark.vy += spark.gravity;
          
          spark.graphic.alpha = Math.max(0, 1 - sparkT);
          spark.graphic.scale.set(Math.max(0.2, 1 - sparkT * 0.5));
        }
      });
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};