import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const snowflake: Anim = {
  key: 'snowflake',
  name: 'Nebula',
  schema: { density: { type: 'number', default: 40 }, lifeMs: { type: 'number', default: 4000 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const particles: any[] = [];
    const density = cfg?.density ?? 40;
    const colors = [0x4a90e2, 0x7b68ee, 0x9370db, 0xba55d3, 0xda70d6, 0x87ceeb];
    
    // Create nebula particles with varying properties
    for (let i = 0; i < density; i++) {
      const g = new Graphics();
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 1 + Math.random() * 4;
      
      // Create glowing particle with soft edges
      g.circle(0, 0, size * 2).fill({ color, alpha: 0.1 }); // Outer glow
      g.circle(0, 0, size).fill({ color, alpha: 0.7 }); // Inner core
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80;
      const depth = Math.random(); // Z-depth simulation
      
      particles.push({
        graphic: g,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        baseSize: size,
        depth: depth,
        orbitRadius: distance * (0.8 + depth * 0.4),
        orbitSpeed: (0.5 + Math.random() * 1.5) * (depth > 0.5 ? 1 : -1) * 0.001,
        baseAngle: angle,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.1 + Math.random() * 0.3,
        driftSpeed: 0.2 + Math.random() * 0.5,
        life: 0.8 + Math.random() * 0.4
      });
      
      c.addChild(g);
    }
    
    // Add central energy source
    const center = new Graphics();
    center.circle(0, 0, 6).fill({ color: 0xffffff, alpha: 0.3 });
    center.circle(0, 0, 3).fill({ color: 0xffffff, alpha: 0.8 });
    c.addChild(center);
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = elapsed / (cfg?.lifeMs ?? 4000);
      
      particles.forEach((particle, i) => {
        // Orbital motion with drift
        particle.baseAngle += particle.orbitSpeed;
        
        // Calculate orbital position
        const orbitX = Math.cos(particle.baseAngle) * particle.orbitRadius;
        const orbitY = Math.sin(particle.baseAngle) * particle.orbitRadius;
        
        // Add drift motion
        const driftX = Math.sin(elapsed * particle.driftSpeed * 0.001 + particle.phase) * 10;
        const driftY = Math.cos(elapsed * particle.driftSpeed * 0.001 + particle.phase * 1.3) * 8;
        
        particle.x = orbitX + driftX;
        particle.y = orbitY + driftY;
        
        particle.graphic.x = particle.x;
        particle.graphic.y = particle.y;
        
        // Depth-based scaling and alpha
        const depthScale = 0.3 + particle.depth * 0.7;
        const pulse = 0.7 + 0.5 * Math.sin(elapsed * particle.pulseSpeed * 0.01 + particle.phase);
        particle.graphic.scale.set(depthScale * pulse);
        
        // Simulate 3D movement by varying alpha based on depth and position
        const distanceFromCenter = Math.sqrt(particle.x * particle.x + particle.y * particle.y);
        const depthAlpha = 0.3 + particle.depth * 0.7;
        const distanceAlpha = Math.max(0.2, 1 - distanceFromCenter / 100);
        
        // Individual particle lifetime
        const particleT = t / particle.life;
        let lifeAlpha = 1;
        if (particleT > 0.7) {
          lifeAlpha = Math.max(0, 1 - (particleT - 0.7) / 0.3);
        }
        
        particle.graphic.alpha = depthAlpha * distanceAlpha * lifeAlpha * pulse;
        
        // Subtle rotation for shimmer effect
        particle.graphic.rotation += 0.005 * (particle.depth > 0.5 ? 1 : -1);
      });
      
      // Central energy source pulsing
      const centerPulse = 0.8 + 0.4 * Math.sin(elapsed * 0.003);
      center.scale.set(centerPulse);
      center.rotation += 0.01;
      
      // Overall fade out
      if (t > 0.8) {
        const fadeT = (t - 0.8) / 0.2;
        c.alpha = Math.max(0, 1 - fadeT);
      }
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};