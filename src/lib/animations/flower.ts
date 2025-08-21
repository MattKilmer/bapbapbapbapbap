import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const flower: Anim = {
  key: 'flower',
  name: 'Mandala',
  schema: { complexity: { type: 'number', default: 6 }, lifeMs: { type: 'number', default: 3500 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const complexity = cfg?.complexity ?? 6;
    const layers: any[] = [];
    const colors = [0xff6b9d, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0x6c5ce7, 0xff4757];
    
    // Create multiple intricate layers
    for (let layer = 0; layer < complexity; layer++) {
      const layerContainer = new Container();
      const layerData: any[] = [];
      
      const elementsInLayer = 8 + layer * 4; // Increasing complexity per layer
      const radius = 15 + layer * 12;
      const color = colors[layer % colors.length];
      
      for (let i = 0; i < elementsInLayer; i++) {
        const g = new Graphics();
        const angle = (i / elementsInLayer) * Math.PI * 2;
        
        // Create intricate petal/geometric shapes
        const petalLength = 8 + layer * 3;
        const petalWidth = 3 + layer;
        
        // Multiple petal segments for complexity
        for (let segment = 0; segment < 3; segment++) {
          const segmentOffset = segment * petalLength * 0.3;
          const segmentWidth = petalWidth * (1 - segment * 0.3);
          const alpha = 0.8 - segment * 0.2;
          
          g.moveTo(segmentOffset, 0);
          g.bezierCurveTo(
            segmentOffset + petalLength * 0.3, -segmentWidth,
            segmentOffset + petalLength * 0.7, -segmentWidth * 0.5,
            segmentOffset + petalLength, 0
          );
          g.bezierCurveTo(
            segmentOffset + petalLength * 0.7, segmentWidth * 0.5,
            segmentOffset + petalLength * 0.3, segmentWidth,
            segmentOffset, 0
          );
          g.fill({ color, alpha });
        }
        
        g.x = Math.cos(angle) * radius;
        g.y = Math.sin(angle) * radius;
        g.rotation = angle + Math.PI / 2;
        g.scale.set(0);
        
        layerData.push({
          graphic: g,
          baseAngle: angle,
          originalRadius: radius,
          phase: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          pulseSpeed: 0.5 + Math.random() * 1.5
        });
        
        layerContainer.addChild(g);
      }
      
      layers.push({
        container: layerContainer,
        elements: layerData,
        delay: layer * 200,
        rotationSpeed: (layer % 2 === 0 ? 1 : -1) * 0.001 * (layer + 1)
      });
      
      c.addChild(layerContainer);
    }
    
    // Central energy core
    const core = new Graphics();
    core.circle(0, 0, 4).fill({ color: 0xffffff, alpha: 0.9 });
    core.scale.set(0);
    c.addChild(core);
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = elapsed / (cfg?.lifeMs ?? 3500);
      
      layers.forEach((layer, layerIndex) => {
        const layerT = Math.max(0, (elapsed - layer.delay) / 2000);
        
        // Rotate entire layer
        layer.container.rotation += layer.rotationSpeed;
        
        layer.elements.forEach((element: any, elementIndex) => {
          if (layerT > 0) {
            // Growth animation
            const growthT = Math.min(1, layerT * 2);
            const eased = 1 - Math.pow(1 - growthT, 3); // Ease out cubic
            element.graphic.scale.set(eased);
            
            // Individual element rotation
            element.graphic.rotation += element.rotationSpeed;
            
            // Responsive pulsing based on layer and time
            const pulse = 0.8 + 0.3 * Math.sin(elapsed * 0.002 * element.pulseSpeed + element.phase);
            const layerPulse = 1 + 0.1 * Math.sin(elapsed * 0.001 + layerIndex);
            element.graphic.scale.set(eased * pulse * layerPulse);
            
            // Dynamic radius variation
            const radiusVar = 1 + 0.15 * Math.sin(elapsed * 0.0015 + element.phase);
            const newRadius = element.originalRadius * radiusVar;
            element.graphic.x = Math.cos(element.baseAngle) * newRadius;
            element.graphic.y = Math.sin(element.baseAngle) * newRadius;
            
            // Color shift over time (subtle tint variation)
            const colorShift = 0.9 + 0.1 * Math.sin(elapsed * 0.001 + layerIndex + elementIndex);
            element.graphic.alpha = Math.max(0.1, Math.min(1, colorShift));
          }
        });
      });
      
      // Core animation
      if (t > 0.1) {
        const coreT = Math.min(1, (t - 0.1) / 0.3);
        core.scale.set(coreT);
        
        // Core pulsing
        const corePulse = 1 + 0.5 * Math.sin(elapsed * 0.005);
        core.scale.set(coreT * corePulse);
        
        // Core rotation
        core.rotation += 0.02;
      }
      
      // Fade out
      if (t > 0.8) {
        const fadeT = (t - 0.8) / 0.2;
        c.alpha = Math.max(0, 1 - fadeT);
      }
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};