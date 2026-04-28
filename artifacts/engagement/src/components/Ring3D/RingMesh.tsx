import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles, ContactShadows } from '@react-three/drei';
import { useRingChoreography } from './useRingChoreography';

export const RingMesh: React.FC = () => {
  const { groupRef } = useRingChoreography();
  
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  // Geometry: Torus with slightly flat inner edge (D-shape)
  // standard torus is circular cross-section, but we can approximate a D-shape by scaling it or using a custom shape.
  // We'll stick to a smooth torus for a classic look, but make it nicely proportioned.
  const geometry = useMemo(() => new THREE.TorusGeometry(1, 0.25, 64, 128), []);
  
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#E6B23A',
    metalness: 1.0,
    roughness: 0.12,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.5,
  }), []);

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} material={material} castShadow receiveShadow>
        {/* Soft rim light relative to the ring */}
        <pointLight position={[-2, 2, 2]} intensity={2} color="#F9F1CC" distance={10} />
      </mesh>
      
      {!prefersReducedMotion && (
        <Sparkles 
          count={30} 
          scale={3} 
          size={1.5} 
          speed={0.2} 
          opacity={0.3} 
          color="#F9F1CC" 
          noise={1}
        />
      )}
      
      <ContactShadows 
        position={[0, -1.5, 0]} 
        opacity={0.4} 
        scale={5} 
        blur={2} 
        far={4} 
        resolution={256}
        color="#000000"
      />
    </group>
  );
};
