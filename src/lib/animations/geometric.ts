import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const geometric: Anim = {
  key: 'geometric',
  name: 'Geometric',
  schema: { shapes: { type: 'number', default: 5 }, lifeMs: { type: 'number', default: 1600 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const shapes: any[] = [];
    const shapeCount = cfg?.shapes ?? 5;
    const globalScale = cfg?.globalScale ?? 1;
    const shapeTypes = ['triangle', 'square', 'pentagon', 'hexagon'];
    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0xf0932b];
    
    for (let i = 0; i < shapeCount; i++) {
      const g = new Graphics();
      const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = (10 + Math.random() * 20) * globalScale;
      
      // Draw different geometric shapes
      switch (shapeType) {
        case 'triangle':
          g.moveTo(0, -size);
          g.lineTo(-size * 0.866, size * 0.5);
          g.lineTo(size * 0.866, size * 0.5);
          g.lineTo(0, -size);
          break;
        case 'square':
          g.rect(-size/2, -size/2, size, size);
          break;
        case 'pentagon':
        case 'hexagon':
          const sides = shapeType === 'pentagon' ? 5 : 6;
          g.moveTo(size, 0);
          for (let j = 1; j <= sides; j++) {
            const angle = (j / sides) * Math.PI * 2;
            g.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
          }
          break;
      }
      
      g.fill(color);
      g.alpha = 0;
      g.scale.set(0);
      
      const angle = (i / shapeCount) * Math.PI * 2;
      const distance = (30 + Math.random() * 30) * globalScale;
      
      shapes.push({
        graphic: g,
        targetX: Math.cos(angle) * distance,
        targetY: Math.sin(angle) * distance,
        delay: i * 100,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      });
      
      c.addChild(g);
    }
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = elapsed / (cfg?.lifeMs ?? 1600);
      
      shapes.forEach((shape, i) => {
        const shapeT = Math.max(0, (elapsed - shape.delay) / 800);
        
        if (shapeT > 0) {
          // Animate in
          if (shapeT < 1) {
            const eased = 1 - Math.pow(1 - shapeT, 3);
            shape.graphic.x = shape.targetX * eased;
            shape.graphic.y = shape.targetY * eased;
            shape.graphic.scale.set(eased * globalScale);
            shape.graphic.alpha = eased;
          }
          
          // Rotate
          shape.graphic.rotation += shape.rotationSpeed;
          
          // Fade out
          if (t > 0.6) {
            const fadeT = (t - 0.6) / 0.4;
            shape.graphic.alpha = Math.max(0, (1 - fadeT) * (shapeT < 1 ? shapeT : 1));
          }
        }
      });
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};