import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { RingMesh } from './RingMesh';
import { GoldRing as SVGFallback } from '../GoldRing';

export const Ring3D: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  
  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!hasWebGL) {
    return <SVGFallback />;
  }

  // Sample theme to adjust lighting slightly if needed, but environment mostly handles it.
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <Environment preset={isDark ? "sunset" : "studio"} background={false} />
          
          <ambientLight intensity={isDark ? 0.3 : 0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fff" />
          
          <RingMesh />

          {!isMobile && !prefersReducedMotion && (
            <EffectComposer disableNormalPass>
              <Bloom 
                luminanceThreshold={1.2} 
                mipmapBlur 
                intensity={0.4} 
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
