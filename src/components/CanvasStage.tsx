'use client';
import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';

export function CanvasStage() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const app = new Application();
    let mounted = true;
    
    app.init({ background: '#000000', antialias: true }).then(() => {
      // Check if component is still mounted and ref is valid
      if (!mounted || !ref.current) {
        try {
          app.destroy();
        } catch (destroyError) {
          console.warn('Error destroying PIXI app during unmount:', destroyError);
        }
        return;
      }
      
      ref.current.appendChild(app.canvas);
      
      // Set up manual resize handling after initialization is complete
      const handleResize = () => {
        if (mounted && app.canvas && app.renderer && ref.current) {
          try {
            const rect = ref.current.getBoundingClientRect();
            app.renderer.resize(rect.width, rect.height);
          } catch (error) {
            console.warn('Error resizing PIXI app:', error);
          }
        }
      };
      
      // Initial resize
      handleResize();
      
      // Listen for window resize events
      window.addEventListener('resize', handleResize);
      
      // Store resize cleanup function
      (app as any).__resizeCleanup = () => {
        window.removeEventListener('resize', handleResize);
      };
      
      (window as any).__pixiApp = app; // simple sharing
    }).catch((error) => {
      console.error('Failed to initialize PIXI app:', error);
      if (mounted) {
        try {
          app.destroy();
        } catch (destroyError) {
          console.warn('Error destroying failed PIXI app:', destroyError);
        }
      }
    });
    
    return () => {
      mounted = false;
      // Clean up resize listener
      if ((app as any).__resizeCleanup) {
        (app as any).__resizeCleanup();
      }
      // Clear the global reference
      if ((window as any).__pixiApp === app) {
        (window as any).__pixiApp = null;
      }
      // Destroy the app safely
      try {
        app.destroy();
      } catch (error) {
        console.warn('Error destroying PIXI app:', error);
      }
    };
  }, []);
  
  return <div ref={ref} className="absolute inset-0" />;
}