import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const crystal: Anim = {
  key: 'crystal',
  name: 'Crystal',
  schema: { shards: { type: 'number', default: 8 }, lifeMs: { type: 'number', default: 1400 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const shards = [];
    const shardCount = cfg?.shards ?? 8;
    const crystalColors = [0x00ffff, 0x40e0d0, 0x87ceeb, 0xb0e0e6, 0xe0ffff];
    
    // Create main crystal core
    const core = new Graphics();
    core.star(0, 0, 6, 20, 10).fill(0xffffff);
    core.alpha = 0;
    core.scale.set(0);
    c.addChild(core);
    
    for (let i = 0; i < shardCount; i++) {
      const g = new Graphics();
      const color = crystalColors[Math.floor(Math.random() * crystalColors.length)];
      const length = 15 + Math.random() * 25;
      const width = 4 + Math.random() * 6;
      
      // Draw crystal shard (elongated diamond)
      g.moveTo(0, -length);
      g.lineTo(width/2, -length/3);
      g.lineTo(0, length/3);
      g.lineTo(-width/2, -length/3);
      g.lineTo(0, -length);
      g.fill(color);
      
      // Add inner highlight
      const highlight = new Graphics();
      highlight.moveTo(0, -length);
      highlight.lineTo(width/4, -length/2);
      highlight.lineTo(0, 0);
      highlight.lineTo(-width/4, -length/2);
      highlight.lineTo(0, -length);
      highlight.fill({ color: 0xffffff, alpha: 0.3 });
      g.addChild(highlight);
      
      const angle = (i / shardCount) * Math.PI * 2;
      g.rotation = angle;
      g.scale.set(0);
      g.alpha = 0;
      
      shards.push({
        graphic: g,
        angle,
        delay: i * 80
      });
      
      c.addChild(g);
    }
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = elapsed / (cfg?.lifeMs ?? 1400);
      
      // Animate core
      if (t < 0.2) {
        const coreT = t / 0.2;
        core.scale.set(coreT);
        core.alpha = coreT;
      } else if (t > 0.8) {
        const fadeT = (t - 0.8) / 0.2;
        core.alpha = Math.max(0, 1 - fadeT);
      }
      
      // Pulsing effect
      const pulse = 1 + 0.2 * Math.sin(elapsed * 0.01);
      core.scale.set(core.scale.x * pulse);
      
      // Animate shards
      shards.forEach((shard, i) => {
        const shardT = Math.max(0, (elapsed - shard.delay) / 800);
        
        if (shardT > 0 && shardT <= 1) {
          const eased = 1 - Math.pow(1 - shardT, 2);
          shard.graphic.scale.set(eased);
          shard.graphic.alpha = eased;
          
          // Slight rotation
          shard.graphic.rotation = shard.angle + Math.sin(elapsed * 0.005 + i) * 0.1;
        }
        
        // Fade out
        if (t > 0.6) {
          const fadeT = (t - 0.6) / 0.4;
          shard.graphic.alpha *= Math.max(0, 1 - fadeT);
        }
      });
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};