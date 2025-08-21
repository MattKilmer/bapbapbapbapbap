import { Graphics, Container, Text } from 'pixi.js';
import type { Anim } from './index';

export const matrix: Anim = {
  key: 'matrix',
  name: 'Matrix',
  schema: { columns: { type: 'number', default: 8 }, lifeMs: { type: 'number', default: 2000 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const columns = cfg?.columns ?? 8;
    const chars = '0123456789ABCDEF';
    const streams = [];
    
    for (let i = 0; i < columns; i++) {
      const stream = [];
      const streamLength = 5 + Math.random() * 8;
      
      for (let j = 0; j < streamLength; j++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const text = new Text({
          text: char,
          style: {
            fontSize: 12,
            fill: j === 0 ? 0x00ff00 : 0x008000,
            fontFamily: 'monospace'
          }
        });
        
        text.x = (i - columns/2) * 15;
        text.y = -j * 15 - 100;
        text.alpha = j === 0 ? 1 : 0.3 + (j * 0.1);
        
        stream.push(text);
        c.addChild(text);
      }
      
      streams.push({
        chars: stream,
        speed: 2 + Math.random() * 3,
        delay: Math.random() * 500
      });
    }
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = elapsed / (cfg?.lifeMs ?? 2000);
      
      streams.forEach((stream) => {
        if (elapsed > stream.delay) {
          stream.chars.forEach((char) => {
            char.y += stream.speed;
          });
        }
        
        // Fade out
        if (t > 0.7) {
          stream.chars.forEach((char) => {
            char.alpha *= 0.95;
          });
        }
      });
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};