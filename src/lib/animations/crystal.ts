import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const crystal: Anim = {
  key: 'crystal',
  name: 'Crystal',
  schema: { 
    complexity: { type: 'number', default: 16 }, 
    layers: { type: 'number', default: 3 },
    lifeMs: { type: 'number', default: 4200 } 
  },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const complexity = cfg?.complexity ?? 16;
    const layers = cfg?.layers ?? 3;
    const lifeMs = cfg?.lifeMs ?? 4200;
    const globalScale = cfg?.globalScale ?? 1;
    const crystalParticles: any[] = [];
    
    // Crystal formation colors - ice blues and purples
    const colors = [0x87ceeb, 0x4682b4, 0x6495ed, 0x9370db, 0x8a2be2, 0xb19cd9];
    
    // Create multiple crystalline formation layers
    for (let layer = 0; layer < layers; layer++) {
      const layerCount = Math.floor(complexity / layers) + layer * 2;
      const baseRadius = (15 + layer * 25) * globalScale;
      
      for (let i = 0; i < layerCount; i++) {
        const crystalFace = new Graphics();
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Create hexagonal crystal face with varying sizes
        const faceSize = (8 + Math.random() * 12) * globalScale;
        const sides = 6;
        const innerRadius = faceSize * 0.7;
        
        // Draw hexagonal crystal face
        crystalFace.moveTo(faceSize, 0);
        for (let s = 1; s <= sides; s++) {
          const angle = (s / sides) * Math.PI * 2;
          crystalFace.lineTo(
            Math.cos(angle) * faceSize,
            Math.sin(angle) * faceSize
          );
        }
        crystalFace.fill({ color, alpha: 0.8 });
        
        // Add inner crystalline structure
        const inner = new Graphics();
        inner.moveTo(innerRadius, 0);
        for (let s = 1; s <= sides; s++) {
          const angle = (s / sides) * Math.PI * 2;
          inner.lineTo(
            Math.cos(angle) * innerRadius,
            Math.sin(angle) * innerRadius
          );
        }
        inner.fill({ color: 0xffffff, alpha: 0.4 });
        crystalFace.addChild(inner);
        
        // Position in formation
        const formationAngle = (i / layerCount) * Math.PI * 2;
        const radius = baseRadius + (Math.random() - 0.5) * 10;
        const depth = Math.random(); // Simulate depth
        
        crystalParticles.push({
          graphic: crystalFace,
          x: Math.cos(formationAngle) * radius,
          y: Math.sin(formationAngle) * radius,
          baseX: Math.cos(formationAngle) * radius,
          baseY: Math.sin(formationAngle) * radius,
          layer: layer,
          depth: depth,
          formationAngle: formationAngle,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.5 + Math.random() * 1.5,
          growthDelay: layer * 150 + i * 40,
          faceSize: faceSize,
          originalAlpha: 0.8 - layer * 0.1,
          life: 0.7 + Math.random() * 0.6,
          shatterTime: 0.6 + Math.random() * 0.3,
          shatterVx: (Math.random() - 0.5) * 2,
          shatterVy: (Math.random() - 0.5) * 2
        });
        
        crystalFace.x = crystalParticles[crystalParticles.length - 1].x;
        crystalFace.y = crystalParticles[crystalParticles.length - 1].y;
        crystalFace.scale.set(0);
        crystalFace.alpha = 0;
        c.addChild(crystalFace);
      }
    }
    
    // Central crystal core - brilliant white energy
    const core = new Graphics();
    core.star(0, 0, 8 * globalScale, 12 * globalScale, 6 * globalScale).fill({ color: 0xffffff, alpha: 0.9 });
    core.circle(0, 0, 4 * globalScale).fill({ color: 0xffffff, alpha: 0.6 });
    core.scale.set(0);
    c.addChild(core);
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = elapsed / lifeMs;
      
      // Core formation phase (0-0.2)
      if (t < 0.3) {
        const coreT = t / 0.3;
        const eased = 1 - Math.pow(1 - coreT, 3);
        core.scale.set(eased);
        
        // Core energy pulsing
        const energyPulse = 1 + 0.3 * Math.sin(elapsed * 0.008);
        core.scale.set(eased * energyPulse);
        core.rotation += 0.02;
      }
      
      // Crystal formation phase
      crystalParticles.forEach((crystal, i) => {
        const crystalT = Math.max(0, (elapsed - crystal.growthDelay) / (lifeMs * 0.4));
        
        if (crystalT > 0) {
          // Growth phase - crystals emerge from center
          if (crystalT < 1) {
            const growthEased = 1 - Math.pow(1 - Math.min(1, crystalT), 2);
            crystal.graphic.scale.set(growthEased);
            crystal.graphic.alpha = crystal.originalAlpha * growthEased;
            
            // Crystals rotate into final position
            crystal.graphic.rotation += crystal.rotationSpeed;
            
            // Formation positioning with slight oscillation
            const oscillation = Math.sin(elapsed * 0.002 + crystal.pulsePhase) * 3 * globalScale;
            crystal.graphic.x = crystal.baseX + oscillation;
            crystal.graphic.y = crystal.baseY + oscillation * 0.6;
            
            // Individual crystal pulsing
            const pulse = 0.9 + 0.2 * Math.sin(elapsed * crystal.pulseSpeed * 0.001 + crystal.pulsePhase);
            crystal.graphic.scale.set(growthEased * pulse);
          }
          
          // Shatter phase - crystals fragment and scatter
          const shatterStartT = crystal.shatterTime;
          if (t > shatterStartT) {
            const shatterT = (t - shatterStartT) / (1 - shatterStartT);
            
            // Scatter motion
            crystal.x += crystal.shatterVx * shatterT * 60 * globalScale;
            crystal.y += crystal.shatterVy * shatterT * 60 * globalScale;
            crystal.graphic.x = crystal.x;
            crystal.graphic.y = crystal.y;
            
            // Spinning as they shatter
            crystal.graphic.rotation += shatterT * 0.1;
            
            // Fade and shrink
            const fadeT = Math.pow(shatterT, 1.5);
            crystal.graphic.alpha = crystal.originalAlpha * Math.max(0, 1 - fadeT);
            crystal.graphic.scale.set((1 - shatterT * 0.7) * (0.9 + 0.2 * Math.sin(elapsed * crystal.pulseSpeed * 0.001)));
          }
        }
      });
      
      // Core fade out
      if (t > 0.75) {
        const fadeT = (t - 0.75) / 0.25;
        core.alpha = Math.max(0, 1 - fadeT);
      }
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    
    requestAnimationFrame(tick);
  }
};