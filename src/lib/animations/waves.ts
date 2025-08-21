import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const waves: Anim = {
  key: 'waves',
  name: 'Waves',
  schema: { 
    layers: { type: 'number', default: 8 }, 
    intensity: { type: 'number', default: 40 },
    lifeMs: { type: 'number', default: 2800 } 
  },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const layers = cfg?.layers ?? 8;
    const intensity = cfg?.intensity ?? 40;
    const lifeMs = cfg?.lifeMs ?? 2800;
    const globalScale = cfg?.globalScale ?? 1;
    
    c.x = x; c.y = y; stage.addChild(c);
    
    const waveParticles: any[] = [];
    const particleCount = 120;
    const colors = [0x4fc3f7, 0x29b6f6, 0x0288d1, 0x0277bd, 0x01579b, 0x81c784, 0x66bb6a, 0x4caf50];
    
    // Create fluid particle system instead of discrete wave lines
    for (let i = 0; i < particleCount; i++) {
      const particle = new Graphics();
      const size = (1 + Math.random() * 3) * globalScale;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Create soft glowing particles
      particle.circle(0, 0, size * 2).fill({ color, alpha: 0.1 });
      particle.circle(0, 0, size).fill({ color, alpha: 0.6 });
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80 * globalScale;
      
      waveParticles.push({
        graphic: particle,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        baseX: Math.cos(angle) * distance,
        baseY: Math.sin(angle) * distance,
        waveIndex: Math.floor(i / (particleCount / layers)),
        phase: Math.random() * Math.PI * 2,
        frequency: 0.8 + Math.random() * 1.2,
        amplitude: (15 + Math.random() * intensity) * globalScale,
        speed: 0.5 + Math.random() * 1.5,
        life: 0.7 + Math.random() * 0.6,
        size: size,
        depth: Math.random()
      });
      
      c.addChild(particle);
    }
    
    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = elapsed / lifeMs;
      
      if (t <= 1) {
        waveParticles.forEach((particle, i) => {
          // Multi-layered wave motion
          const waveDelay = particle.waveIndex * 100;
          const particleT = Math.max(0, (elapsed - waveDelay) / lifeMs);
          
          if (particleT > 0) {
            // Primary wave motion
            const primaryWave = Math.sin(elapsed * 0.002 * particle.frequency + particle.phase) * particle.amplitude;
            
            // Secondary perpendicular wave for fluid motion
            const secondaryWave = Math.cos(elapsed * 0.003 * particle.frequency + particle.phase * 1.3) * (particle.amplitude * 0.6);
            
            // Tertiary circular motion for organic feel
            const circularMotion = {
              x: Math.cos(elapsed * 0.001 * particle.speed + particle.phase) * (particle.amplitude * 0.3),
              y: Math.sin(elapsed * 0.001 * particle.speed + particle.phase) * (particle.amplitude * 0.2)
            };
            
            // Combine all motions
            particle.x = particle.baseX + primaryWave * 0.3 + circularMotion.x;
            particle.y = particle.baseY + secondaryWave * 0.8 + circularMotion.y + primaryWave * 0.4;
            
            particle.graphic.x = particle.x;
            particle.graphic.y = particle.y;
            
            // Dynamic scaling based on wave motion
            const motionIntensity = Math.abs(primaryWave) / particle.amplitude;
            const baseScale = 0.5 + particle.depth * 0.8;
            const dynamicScale = baseScale + motionIntensity * 0.5;
            particle.graphic.scale.set(dynamicScale);
            
            // Fluid alpha variation
            const waveAlpha = 0.6 + 0.4 * Math.sin(elapsed * 0.004 + particle.phase);
            const distanceFromCenter = Math.sqrt(particle.x * particle.x + particle.y * particle.y);
            const centerAlpha = Math.max(0.2, 1 - distanceFromCenter / 100);
            
            // Individual particle lifetime
            const lifetimeT = particleT / particle.life;
            let lifeAlpha = 1;
            if (lifetimeT > 0.6) {
              lifeAlpha = Math.max(0, 1 - (lifetimeT - 0.6) / 0.4);
            }
            
            particle.graphic.alpha = waveAlpha * centerAlpha * lifeAlpha;
            
            // Gentle rotation for fluid shimmer
            particle.graphic.rotation += 0.01 * Math.sin(elapsed * 0.001 + particle.phase);
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