import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const burst: Anim = {
  key: 'burst',
  name: 'Burst',
  schema: { radius: { type: 'number', default: 60 }, lifeMs: { type: 'number', default: 600 } },
  run: ({ stage, x, y, cfg }) => {
    const c = new Container();
    const g = new Graphics();
    const globalScale = cfg?.globalScale ?? 1;
    const radius = (cfg?.radius ?? 60) * globalScale;
    g.circle(0,0, radius).fill(0xffffff).alpha = 0.8;
    c.x = x; c.y = y; c.addChild(g); stage.addChild(c);
    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / (cfg?.lifeMs ?? 600);
      g.scale.set((1 + t) * globalScale);
      g.alpha = Math.max(0, 0.8 - t);
      if (t < 1) requestAnimationFrame(tick); else c.destroy();
    };
    requestAnimationFrame(tick);
  }
};