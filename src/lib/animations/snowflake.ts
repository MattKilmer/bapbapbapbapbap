import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const snowflake: Anim = {
  key: 'snowflake',
  name: 'Snowflake',
  schema: { arms: { type: 'number', default: 6 }, lifeMs: { type: 'number', default: 1800 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const arms = cfg?.arms ?? 6;
    
    // Create snowflake pattern
    const g = new Graphics();
    
    for (let i = 0; i < arms; i++) {
      const angle = (i / arms) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      // Main arm
      g.moveTo(0, 0);
      g.lineTo(cos * 40, sin * 40);
      
      // Side branches
      for (let j = 0.3; j < 1; j += 0.3) {
        const branchX = cos * 40 * j;
        const branchY = sin * 40 * j;
        const branchAngle1 = angle + Math.PI / 6;
        const branchAngle2 = angle - Math.PI / 6;
        
        g.moveTo(branchX, branchY);
        g.lineTo(branchX + Math.cos(branchAngle1) * 10, branchY + Math.sin(branchAngle1) * 10);
        g.moveTo(branchX, branchY);
        g.lineTo(branchX + Math.cos(branchAngle2) * 10, branchY + Math.sin(branchAngle2) * 10);
      }
    }
    
    g.stroke({ width: 2, color: 0x87ceeb });
    g.scale.set(0);
    c.addChild(g);
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const t = (performance.now() - start) / (cfg?.lifeMs ?? 1800);
      
      // Growth phase
      if (t < 0.3) {
        g.scale.set(t / 0.3);
      }
      // Rotation and fade
      else {
        g.rotation += 0.02;
        const fadeT = (t - 0.3) / 0.7;
        g.alpha = Math.max(0, 1 - fadeT);
      }
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};