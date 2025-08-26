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
        app.destroy();
        return;
      }
      
      ref.current.appendChild(app.canvas);
      
      // Set up manual resize handling after initialization is complete
      const handleResize = () => {
        if (mounted && app.canvas && app.renderer) {
          try {
            app.renderer.resize(window.innerWidth, window.innerHeight);
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
        app.destroy();
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
  
  return <div ref={ref} className="fixed inset-0" />;
}