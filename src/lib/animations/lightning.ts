import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const lightning: Anim = {
  key: 'lightning',
  name: 'Swarm',
  schema: { count: { type: 'number', default: 25 }, lifeMs: { type: 'number', default: 2800 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const particles: any[] = [];
    const count = cfg?.count ?? 25;
    const globalScale = cfg?.globalScale ?? 1;
    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0x6c5ce7];
    
    // Create swarming particles
    for (let i = 0; i < count; i++) {
      const g = new Graphics();
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = (2 + Math.random() * 3) * globalScale;
      
      g.circle(0, 0, size).fill(color);
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 60 * globalScale;
      
      particles.push({
        graphic: g,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 4 * globalScale,
        vy: (Math.random() - 0.5) * 4 * globalScale,
        targetX: 0,
        targetY: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        originalSize: size,
        life: 0.7 + Math.random() * 0.6,
        globalScale: globalScale
      });
      
      c.addChild(g);
    }
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = elapsed / (cfg?.lifeMs ?? 2800);
      
      particles.forEach((particle, i) => {
        // Flocking behavior - attracted to center and neighbors (scaled)
        const centerForce = 0.02 * particle.globalScale;
        const neighborForce = 0.01 * particle.globalScale;
        const separationForce = 0.05 * particle.globalScale;
        
        // Attraction to center
        const centerDx = -particle.x * centerForce;
        const centerDy = -particle.y * centerForce;
        
        // Neighbor interactions
        let neighborDx = 0;
        let neighborDy = 0;
        let separationDx = 0;
        let separationDy = 0;
        
        particles.forEach((other, j) => {
          if (i !== j) {
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 30 * particle.globalScale && distance > 0) {
              // Alignment and cohesion
              neighborDx += other.vx * neighborForce;
              neighborDy += other.vy * neighborForce;
              
              // Separation
              if (distance < 15 * particle.globalScale) {
                separationDx -= dx / distance * separationForce;
                separationDy -= dy / distance * separationForce;
              }
            }
          }
        });
        
        // Apply forces
        particle.vx += centerDx + neighborDx + separationDx;
        particle.vy += centerDy + neighborDy + separationDy;
        
        // Add some organic movement
        particle.vx += Math.sin(elapsed * 0.001 + particle.phase) * 0.1;
        particle.vy += Math.cos(elapsed * 0.001 + particle.phase) * 0.1;
        
        // Damping
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        particle.graphic.x = particle.x;
        particle.graphic.y = particle.y;
        
        // Pulsing size
        const pulse = 0.8 + 0.4 * Math.sin(elapsed * 0.003 + particle.phase);
        particle.graphic.scale.set(pulse);
        
        // Individual particle lifetime
        const particleT = t / particle.life;
        if (particleT <= 1) {
          particle.graphic.alpha = Math.max(0, 1 - particleT);
        }
      });
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};