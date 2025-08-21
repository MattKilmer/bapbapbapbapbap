import { Graphics, Container, Text } from 'pixi.js';
import type { Anim } from './index';

export const matrix: Anim = {
  key: 'matrix',
  name: 'Matrix',
  schema: { 
    density: { type: 'number', default: 40 }, 
    chaos: { type: 'number', default: 3 },
    lifeMs: { type: 'number', default: 3500 } 
  },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const density = cfg?.density ?? 40;
    const chaos = cfg?.chaos ?? 3;
    const dataStreams: any[] = [];
    
    // Abstract symbols and varied character sets
    const charSets = [
      '01', // Binary
      '0123456789ABCDEF', // Hex
      'αβγδεζηθικλμνξοπρστυφχψω', // Greek
      '∀∃∈∉∋∌∩∪∞≠≤≥±∓⊕⊗⊙⊆⊇', // Mathematical
      '░▒▓█▄▀▐▌', // Block characters
      '←↑→↓↔↕↖↗↘↙', // Arrows
      '♠♣♥♦♪♫☆★◆◇◈'  // Symbols
    ];
    
    // Dynamic color palette - neon cyberpunk colors
    const colorPalettes = [
      [0x00ff00, 0x40ff40, 0x80ff80], // Classic green
      [0xff0080, 0xff40a0, 0xff80c0], // Hot pink
      [0x00ffff, 0x40ffff, 0x80ffff], // Cyan
      [0xffff00, 0xffff40, 0xffff80], // Yellow
      [0xff8000, 0xffa040, 0xffc080], // Orange
      [0x8000ff, 0xa040ff, 0xc080ff], // Purple
      [0xff0040, 0xff4060, 0xff8090]  // Red-pink
    ];
    
    for (let i = 0; i < density; i++) {
      const streamType = Math.floor(Math.random() * charSets.length);
      const colorPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
      const streamLength = 3 + Math.random() * 12;
      const stream: any[] = [];
      
      // Position streams in abstract formations
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 60;
      const baseX = Math.cos(angle) * radius;
      const baseY = Math.sin(angle) * radius - 80;
      
      // Create flowing direction (not just downward)
      const flowAngle = angle + (Math.random() - 0.5) * Math.PI * 0.5;
      const flowX = Math.cos(flowAngle);
      const flowY = Math.abs(Math.sin(flowAngle)) + 0.5; // Bias toward downward
      
      for (let j = 0; j < streamLength; j++) {
        const charSet = charSets[streamType];
        const char = charSet[Math.floor(Math.random() * charSet.length)];
        const colorIndex = Math.min(j, colorPalette.length - 1);
        
        const text = new Text({
          text: char,
          style: {
            fontSize: 8 + Math.random() * 8,
            fill: colorPalette[colorIndex],
            fontFamily: 'monospace',
            fontWeight: j < 2 ? 'bold' : 'normal'
          }
        });
        
        // Abstract positioning with slight randomness
        text.x = baseX + (Math.random() - 0.5) * 8;
        text.y = baseY - j * (10 + Math.random() * 8);
        text.alpha = j === 0 ? 1 : Math.max(0.2, 1 - j * 0.1);
        text.rotation = (Math.random() - 0.5) * 0.3;
        
        stream.push(text);
        c.addChild(text);
      }
      
      dataStreams.push({
        chars: stream,
        flowX: flowX,
        flowY: flowY,
        speed: 1 + Math.random() * 4,
        delay: Math.random() * 800,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        colorShift: Math.random() * Math.PI * 2,
        streamType: streamType,
        colorPalette: colorPalette,
        morphTimer: 0
      });
    }
    
    c.x = x; c.y = y; stage.addChild(c);
    const start = performance.now();
    
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = elapsed / (cfg?.lifeMs ?? 3500);
      
      dataStreams.forEach((stream, streamIndex) => {
        if (elapsed > stream.delay) {
          stream.chars.forEach((char: any, charIndex: number) => {
            // Abstract flowing movement
            char.x += stream.flowX * stream.speed * 0.3;
            char.y += stream.flowY * stream.speed;
            
            // Add chaotic movement based on chaos parameter
            char.x += Math.sin(elapsed * 0.003 + charIndex + streamIndex) * chaos * 0.5;
            char.y += Math.cos(elapsed * 0.002 + charIndex) * chaos * 0.3;
            
            // Rotation and scaling effects
            char.rotation += stream.rotationSpeed;
            const pulse = 0.8 + 0.3 * Math.sin(elapsed * 0.004 + stream.pulsePhase + charIndex);
            char.scale.set(pulse);
            
            // Dynamic color shifting
            if (charIndex < 3) {
              const colorShift = Math.sin(elapsed * 0.001 + stream.colorShift + charIndex) * 0.5 + 0.5;
              const baseColor = stream.colorPalette[charIndex];
              // Simple alpha variation instead of color math
              char.alpha = (char.alpha || 1) * (0.6 + colorShift * 0.4);
            }
          });
          
          // Morph characters periodically for more abstract feel
          stream.morphTimer += 16;
          if (stream.morphTimer > 300 + Math.random() * 500) {
            stream.morphTimer = 0;
            const randomChar = stream.chars[Math.floor(Math.random() * stream.chars.length)];
            if (randomChar) {
              const charSet = charSets[stream.streamType];
              randomChar.text = charSet[Math.floor(Math.random() * charSet.length)];
            }
          }
        }
        
        // Abstract fade out with varied timing
        if (t > 0.6) {
          const fadeStart = 0.6 + (streamIndex % 5) * 0.05;
          if (t > fadeStart) {
            const fadeT = (t - fadeStart) / (1 - fadeStart);
            stream.chars.forEach((char: any) => {
              char.alpha *= Math.max(0.1, 1 - fadeT * 1.2);
            });
          }
        }
      });
      
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};