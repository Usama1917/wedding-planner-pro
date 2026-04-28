import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
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

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true" style={{ background: 'transparent' }}>
      <Canvas
        gl={{ 
          alpha: true, 
          antialias: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ pointerEvents: 'none', background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" background={false} environmentIntensity={isDark ? 1.2 : 1.6} />
          
          <ambientLight intensity={isDark ? 0.3 : 0.4} />
          
          {/* Key directional light (warm white) */}
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fffcf5" />
          
          {/* Fill light (cool, low intensity) */}
          <directionalLight position={[-5, 0, 5]} intensity={0.3} color="#e0f0ff" />

          {/* Rim / back light (warm) */}
          <directionalLight position={[0, 5, -5]} intensity={isDark ? 0.6 : 0.8} color="#f9f1cc" />
          
          <RingMesh />

          {!isMobile && !prefersReducedMotion && (
            <EffectComposer disableNormalPass>
              <Bloom 
                luminanceThreshold={0.9} 
                mipmapBlur 
                intensity={0.1} 
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
