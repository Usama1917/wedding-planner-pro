import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Sparkles } from '@react-three/drei';
import { useRingChoreography } from './useRingChoreography';

export const RingMesh: React.FC = () => {
  const { groupRef } = useRingChoreography();
  
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Custom LatheGeometry for a comfort-fit band
  const geometry = useMemo(() => {
    const points = [];
    const width = 0.5; // Band width
    const thickness = 0.15; // Wall thickness
    const radius = 1.0; // Inner radius
    
    const segments = 24; // Points along the profile
    
    // Outer dome
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = (t - 0.5) * width;
      // Gentle convex curve
      const x = radius + thickness + Math.cos((t - 0.5) * Math.PI) * 0.05;
      points.push(new THREE.Vector2(x, y));
    }
    
    // Inner concave (comfort fit)
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = (0.5 - t) * width;
      // Gentle convex curve inwards (making the hole slightly larger at edges, smaller in center)
      const x = radius + Math.cos((t - 0.5) * Math.PI) * 0.02;
      points.push(new THREE.Vector2(x, y));
    }
    
    // Smooth corners could be added, but high tessellation + slight curve usually works well
    points.push(points[0]); // Close path

    const geo = new THREE.LatheGeometry(points, 192);
    // Rotate to match standard Torus orientation
    geo.rotateX(Math.PI / 2);
    return geo;
  }, []);
  
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#D4AF37', // Rich warm yellow gold
    metalness: 1.0,
    roughness: 0.12, // Mirror-bright
    clearcoat: 0.3,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.6, // Strong reflections
  }), []);

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} material={material} />
      
      {!prefersReducedMotion && (
        <Sparkles 
          count={isMobile ? 6 : 12} 
          scale={2.5} 
          size={0.6} 
          speed={0.1} 
          opacity={0.2} 
          color="#E8B33A" 
          noise={1}
        />
      )}
    </group>
  );
};
