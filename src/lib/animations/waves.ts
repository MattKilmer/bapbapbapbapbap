import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const waves: Anim = {
  key: 'waves',
  name: 'Waves',
  schema: { 
    amplitude: { type: 'number', default: 30 }, 
    frequency: { type: 'number', default: 0.05 },
    width: { type: 'number', default: 120 },
    lifeMs: { type: 'number', default: 1500 } 
  },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const amplitude = cfg?.amplitude ?? 30;
    const frequency = cfg?.frequency ?? 0.05;
    const width = cfg?.width ?? 120;
    const lifeMs = cfg?.lifeMs ?? 1500;
    
    c.x = x; c.y = y; stage.addChild(c);
    
    const waves: any[] = [];
    const waveCount = 3;
    const colors = [0x00ccff, 0x0099cc, 0x006699];
    
    for (let i = 0; i < waveCount; i++) {
      const wave = new Graphics();
      c.addChild(wave);
      waves.push({
        graphic: wave,
        color: colors[i],
        phase: i * Math.PI / 3,
        delay: i * 200
      });
    }
    
    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = elapsed / lifeMs;
      
      if (t <= 1) {
        waves.forEach((wave, i) => {
          const waveElapsed = elapsed - wave.delay;
          if (waveElapsed > 0) {
            const waveT = waveElapsed / lifeMs;
            const alpha = Math.max(0, 1 - waveT);
            
            wave.graphic.clear();
            wave.graphic.moveTo(-width/2, 0);
            
            for (let x = -width/2; x <= width/2; x += 2) {
              const waveY = Math.sin((x * frequency) + (waveElapsed * 0.01) + wave.phase) * amplitude * alpha;
              wave.graphic.lineTo(x, waveY);
            }
            
            wave.graphic.stroke({ width: 2, color: wave.color, alpha });
          }
        });
        requestAnimationFrame(tick);
      } else {
        c.destroy();
      }
    };
    requestAnimationFrame(tick);
  }
};