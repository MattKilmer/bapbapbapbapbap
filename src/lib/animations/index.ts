import type { Application, Container } from 'pixi.js';
export type AnimCtx = {
  app: Application; stage: Container; zoneIndex: number; x: number; y: number; cfg?: any
};
export type Anim = {
  key: string; name: string; schema?: any; run: (ctx: AnimCtx) => void
};

// Utility function to check if PIXI objects are still valid
export function isValidPixiContext(app: Application, stage: Container): boolean {
  return app && app.renderer && stage && !stage.destroyed;
}

// Mobile detection and performance scaling utility
export function getMobilePerformanceConfig() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  return {
    isMobile,
    // Reduce particle counts and complexity on mobile
    particleScale: isMobile ? 0.3 : 1.0,
    complexityScale: isMobile ? 0.4 : 1.0,
    maxParticles: isMobile ? 20 : 120
  };
}

import { burst } from './burst';
import { ripple } from './ripple';
import { confetti } from './confetti';
import { waves } from './waves';
import { spiral } from './spiral';
import { pulse } from './pulse';
import { lightning } from './lightning';
import { flower } from './flower';
import { tornado } from './tornado';
import { firework } from './firework';
import { snowflake } from './snowflake';
import { matrix } from './matrix';
import { galaxy } from './galaxy';
import { geometric } from './geometric';
import { plasma } from './plasma';
import { crystal } from './crystal';

export const animations: Record<string, Anim> = {
  [burst.key]: burst,
  [ripple.key]: ripple,
  [confetti.key]: confetti,
  [waves.key]: waves,
  [spiral.key]: spiral,
  [pulse.key]: pulse,
  [lightning.key]: lightning,
  [flower.key]: flower,
  [tornado.key]: tornado,
  [firework.key]: firework,
  [snowflake.key]: snowflake,
  [matrix.key]: matrix,
  [galaxy.key]: galaxy,
  [geometric.key]: geometric,
  [plasma.key]: plasma,
  [crystal.key]: crystal,
};