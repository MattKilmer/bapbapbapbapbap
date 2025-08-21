import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const plasma: Anim = {
  key: 'plasma',
  name: 'Plasma',
  schema: { orbs: { type: 'number', default: 12 }, lifeMs: { type: 'number', default: 2200 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const orbs: any[] = [];
    const orbCount = cfg?.orbs ?? 12;
    
    for (let i = 0; i < orbCount; i++) {
      const g = new Graphics();
      const size = 3 + Math.random() * 8;
      
      // Create plasma-like gradient effect with multiple circles
      const colors = [0xff0080, 0x8000ff, 0x0080ff, 0x00ff80];
      const color = colors[i % colors.length];
      
      // Outer glow
      g.circle(0, 0, size * 2).fill({ color, alpha: 0.1 });
      // Inner bright core
      g.circle(0, 0, size).fill({ color, alpha: 0.8 });
      
      const angle = (i / orbCount) * Math.PI * 2;
      const distance = Math.random() * 50;
      const speed = 0.5 + Math.random() * 1.5;
      const phase = Math.random() * Math.PI * 2;
      
      orbs.push({
        graphic: g,
        baseAngle: angle,
        distance,
        speed,
        phase,
        wobbleSpeed: 0.02 + Math.random() * 0.03
      });
      
      c.addChild(g);
    }
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = elapsed / (cfg?.lifeMs ?? 2200);
      
      orbs.forEach((orb, i) => {
        // Orbital motion with wobble
        const currentAngle = orb.baseAngle + elapsed * 0.001 * orb.speed;
        const wobble = Math.sin(elapsed * orb.wobbleSpeed + orb.phase) * 15;
        const currentDistance = orb.distance + wobble;
        
        orb.graphic.x = Math.cos(currentAngle) * currentDistance;
        orb.graphic.y = Math.sin(currentAngle) * currentDistance;
        
        // Pulsing scale
        const pulse = 0.8 + 0.4 * Math.sin(elapsed * 0.005 + orb.phase);
        orb.graphic.scale.set(pulse);
        
        // Energy-like alpha variation
        const energy = 0.6 + 0.4 * Math.sin(elapsed * 0.003 + i);
        orb.graphic.alpha = energy;
        
        // Fade out
        if (t > 0.7) {
          orb.graphic.alpha *= Math.max(0, 1 - (t - 0.7) / 0.3);
        }
      });
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};