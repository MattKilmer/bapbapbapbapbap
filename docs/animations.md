# Animation System

Deep dive into BapBapBapBapBap's PIXI.js-based animation system and how to create custom animations.

## 🎨 Animation Architecture

### Core Components
- **PIXI.js**: High-performance 2D graphics rendering
- **Animation Registry**: Centralized system for managing animation types
- **Parameter System**: Dynamic configuration for each animation
- **Global Scaling**: Real-time size adjustment for all animations
- **Performance Optimization**: Automatic cleanup and memory management

### Animation Lifecycle
1. **Initialization**: Animation triggered by user tap
2. **Parameter Loading**: Configuration applied from database/settings
3. **Rendering**: PIXI.js creates graphics objects
4. **Animation Loop**: RequestAnimationFrame updates positions/properties
5. **Cleanup**: Objects destroyed when animation completes

## 🧩 Animation Structure

### Animation Interface
All animations implement the `Anim` interface:

```typescript
interface Anim {
  key: string;           // Unique identifier
  name: string;          // Display name
  schema: Schema;        // Parameter definitions
  run: AnimationRunner;  // Main animation function
}

interface AnimationRunner {
  (params: {
    app: PIXI.Application;
    stage: PIXI.Container;
    zoneIndex: number;
    x: number;
    y: number;
    cfg: any;
  }): void;
}
```

### Parameter Schema
Define configurable parameters for each animation:

```typescript
interface Schema {
  [key: string]: {
    type: 'number' | 'boolean' | 'string' | 'color';
    default: any;
    min?: number;      // For number types
    max?: number;      // For number types
    step?: number;     // For number types
    options?: string[]; // For string types
  };
}
```

## 🎭 Built-in Animations

### Basic Animations

#### Burst
**File**: `src/lib/animations/burst.ts`
**Effect**: Explosive radial particle burst
**Parameters**:
- `particles`: Number of particles (default: 20)
- `lifeMs`: Animation duration (default: 1500ms)
- `speed`: Particle velocity (default: 1.0)

```typescript
export const burst: Anim = {
  key: 'burst',
  name: 'Burst',
  schema: {
    particles: { type: 'number', default: 20, min: 5, max: 50 },
    lifeMs: { type: 'number', default: 1500, min: 500, max: 5000 },
    speed: { type: 'number', default: 1.0, min: 0.1, max: 3.0 }
  },
  run: ({ stage, x, y, cfg }) => {
    const globalScale = cfg?.globalScale ?? 1;
    // Animation implementation...
  }
};
```

#### Ripple
**Effect**: Expanding concentric rings
**Key Features**:
- Wave propagation simulation
- Particle trail effects
- Fade-out over time

#### Confetti
**Effect**: Colorful particles with gravity physics
**Physics**:
- Initial velocity randomization
- Gravity acceleration
- Air resistance simulation
- Color variation

### Advanced Animations

#### Mandala
**File**: `src/lib/animations/mandala.ts`
**Effect**: Multi-layered geometric patterns
**Features**:
- Mathematical pattern generation
- Recursive geometric structures
- Symmetrical particle placement
- Color harmony algorithms

#### Nebula
**File**: `src/lib/animations/nebula.ts`
**Effect**: 3D orbital particle system with depth simulation
**Advanced Features**:
- 3D to 2D projection mathematics
- Orbital mechanics simulation
- Depth-based scaling and opacity
- Multi-layer rendering

#### Matrix
**File**: `src/lib/animations/matrix.ts`
**Effect**: Cyberpunk-style character streams
**Technical Details**:
- Dynamic text generation
- Multiple character streams
- Varying fall speeds
- Color transitions and fading

## 🛠️ Creating Custom Animations

### Step 1: Create Animation File
Create a new file in `src/lib/animations/your-animation.ts`:

```typescript
import { Graphics, Container, Text } from 'pixi.js';
import type { Anim } from './index';

export const yourAnimation: Anim = {
  key: 'yourAnimation',
  name: 'Your Animation',
  schema: {
    // Define parameters here
    intensity: { type: 'number', default: 1.0, min: 0.1, max: 5.0 },
    color: { type: 'color', default: '#ffffff' },
    enabled: { type: 'boolean', default: true }
  },
  run: ({ stage, x, y, cfg }) => {
    // Your animation logic here
  }
};
```

### Step 2: Implement Animation Logic

#### Basic Structure
```typescript
run: ({ stage, x, y, cfg }) => {
  // Get global scale for responsive sizing
  const globalScale = cfg?.globalScale ?? 1;
  
  // Create container for organization
  const container = new Container();
  container.x = x;
  container.y = y;
  
  // Create graphics objects
  const graphics = new Graphics();
  container.addChild(graphics);
  stage.addChild(container);
  
  // Animation timing
  const startTime = performance.now();
  const duration = cfg?.lifeMs ?? 2000;
  
  // Animation loop
  const animate = () => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Update animation based on progress (0 to 1)
    updateAnimation(graphics, progress, globalScale);
    
    // Continue or cleanup
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      container.destroy();
    }
  };
  
  requestAnimationFrame(animate);
}
```

#### Particle System Example
```typescript
run: ({ stage, x, y, cfg }) => {
  const globalScale = cfg?.globalScale ?? 1;
  const particleCount = cfg?.particles ?? 15;
  const container = new Container();
  const particles = [];
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    const particle = new Graphics();
    particle.circle(0, 0, 3 * globalScale);
    particle.fill(0x00ff00);
    
    // Initial properties
    particles.push({
      graphic: particle,
      vx: (Math.random() - 0.5) * 10 * globalScale,
      vy: (Math.random() - 0.5) * 10 * globalScale,
      life: 1.0
    });
    
    container.addChild(particle);
  }
  
  container.x = x;
  container.y = y;
  stage.addChild(container);
  
  const animate = () => {
    let alive = false;
    
    particles.forEach(p => {
      if (p.life > 0) {
        // Update position
        p.graphic.x += p.vx;
        p.graphic.y += p.vy;
        
        // Update properties
        p.life -= 0.02;
        p.graphic.alpha = p.life;
        
        // Apply effects (gravity, friction, etc.)
        p.vy += 0.2; // Gravity
        p.vx *= 0.99; // Air resistance
        
        alive = true;
      }
    });
    
    if (alive) {
      requestAnimationFrame(animate);
    } else {
      container.destroy();
    }
  };
  
  requestAnimationFrame(animate);
}
```

### Step 3: Register Animation
Add your animation to `src/lib/animations/index.ts`:

```typescript
import { yourAnimation } from './your-animation';

export const animations: Record<string, Anim> = {
  // ... existing animations
  yourAnimation,
};
```

### Step 4: Test Animation
1. Start development server: `npm run dev`
2. Go to admin panel: `http://localhost:3000/admin`
3. Select your animation from dropdown
4. Test in main app

## 🎯 Animation Best Practices

### Performance Optimization

#### Object Pooling
Reuse graphics objects to reduce garbage collection:

```typescript
const particlePool = [];

function getParticle() {
  return particlePool.pop() || new Graphics();
}

function releaseParticle(particle) {
  particle.clear();
  particlePool.push(particle);
}
```

#### Efficient Updates
Minimize calculations in animation loops:

```typescript
// Pre-calculate values outside the loop
const gravity = 0.2 * globalScale;
const friction = 0.99;

const animate = () => {
  particles.forEach(p => {
    // Use pre-calculated values
    p.vy += gravity;
    p.vx *= friction;
  });
};
```

#### Memory Management
Always destroy containers when animations finish:

```typescript
if (progress >= 1) {
  container.destroy({ children: true });
  return; // Exit animation loop
}
```

### Visual Design

#### Global Scale Integration
Always multiply sizes by `globalScale`:

```typescript
const size = baseSize * globalScale;
const speed = baseSpeed * globalScale;
const offset = baseOffset * globalScale;
```

#### Color Harmony
Use consistent color schemes:

```typescript
const colors = [0xff0000, 0x00ff00, 0x0000ff];
const color = colors[Math.floor(Math.random() * colors.length)];
```

#### Smooth Animations
Use easing functions for natural motion:

```typescript
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

const easedProgress = easeOutCubic(progress);
```

### Mathematical Effects

#### Trigonometry for Circular Motion
```typescript
const angle = progress * Math.PI * 2;
const radius = 50 * globalScale;
particle.x = Math.cos(angle) * radius;
particle.y = Math.sin(angle) * radius;
```

#### Physics Simulation
```typescript
// Velocity integration
particle.x += particle.vx;
particle.y += particle.vy;

// Acceleration
particle.vx += particle.ax;
particle.vy += particle.ay;

// Damping
particle.vx *= damping;
particle.vy *= damping;
```

#### Noise and Randomness
```typescript
// Perlin noise for organic movement
const noiseX = noise(particle.x * 0.01, time * 0.005);
const noiseY = noise(particle.y * 0.01, time * 0.005);

particle.vx += noiseX * 0.1;
particle.vy += noiseY * 0.1;
```

## 🧪 Advanced Techniques

### Multi-layer Rendering
Create depth by using multiple containers:

```typescript
const backgroundLayer = new Container();
const midgroundLayer = new Container(); 
const foregroundLayer = new Container();

stage.addChild(backgroundLayer);
stage.addChild(midgroundLayer);
stage.addChild(foregroundLayer);
```

### Custom Shaders
For advanced effects, use PIXI.js filters:

```typescript
import { ColorMatrixFilter } from 'pixi.js';

const colorMatrix = new ColorMatrixFilter();
colorMatrix.hue(progress * 360); // Rainbow effect
container.filters = [colorMatrix];
```

### Audio-Reactive Animations
Access audio context for reactive effects:

```typescript
// This would require additional audio analysis setup
const audioLevel = getAudioLevel(); // Implement audio analysis
const reactiveScale = globalScale * (1 + audioLevel * 0.5);
```

### Procedural Generation
Create variations using seed-based randomness:

```typescript
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const variation = seededRandom(zoneIndex + Date.now());
```

## 📊 Animation Parameters

### Parameter Types

#### Number Parameters
```typescript
speed: {
  type: 'number',
  default: 1.0,
  min: 0.1,
  max: 5.0,
  step: 0.1
}
```

#### Boolean Parameters
```typescript
enableGravity: {
  type: 'boolean', 
  default: true
}
```

#### Color Parameters
```typescript
particleColor: {
  type: 'color',
  default: '#ffffff'
}
```

#### String Parameters
```typescript
pattern: {
  type: 'string',
  default: 'circular',
  options: ['circular', 'linear', 'random']
}
```

### Dynamic Configuration
Parameters can be changed in real-time through the admin panel and applied immediately to new animation instances.

## 🔍 Debugging Animations

### Console Logging
Add debug information:

```typescript
console.log('Animation started:', {
  key: 'yourAnimation',
  position: { x, y },
  config: cfg,
  globalScale: cfg?.globalScale
});
```

### Visual Debugging
Add helper graphics:

```typescript
// Show animation bounds
const bounds = new Graphics();
bounds.rect(-50, -50, 100, 100);
bounds.stroke({ color: 0xff0000, width: 1 });
container.addChild(bounds);
```

### Performance Monitoring
Track animation performance:

```typescript
const startTime = performance.now();
// Animation code...
const endTime = performance.now();
console.log(`Animation frame took: ${endTime - startTime}ms`);
```

## 🚀 Deployment Considerations

### Production Optimizations
- Minimize particle counts for mobile devices
- Use object pooling for frequently created animations
- Implement level-of-detail based on screen size
- Consider WebGL vs Canvas rendering performance

### Browser Compatibility
- Test on all target browsers
- Provide fallbacks for unsupported features
- Consider performance differences between devices

---

**Ready to create amazing animations? Start with the [simple particle example](#particle-system-example) and build up to more complex effects!** ✨