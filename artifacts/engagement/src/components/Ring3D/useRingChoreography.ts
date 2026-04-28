import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getRingStops } from './ring-stops';
import { useLanguage } from '../../contexts/LanguageContext';

export function useRingChoreography() {
  const groupRef = useRef<THREE.Group>(null);
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';
  
  const { size, viewport } = useThree();
  const isMobile = size.width < 768;
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const isFinePointer = typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : false;

  const stops = getRingStops(isMobile, isRTL);
  
  // State for scroll
  const scrollProgress = useRef(0);
  const currentSectionIdx = useRef(0);
  
  // State for pointer
  const pointerTarget = useRef(new THREE.Vector3());
  const magnetTarget = useRef<{pos: THREE.Vector3, active: boolean}>({ pos: new THREE.Vector3(), active: false });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      // Calculate overall scroll progress
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = Math.max(0, Math.min(1, scrollY / maxScroll));

      // Find which section we're currently in or between
      const sectionElements = stops.map(stop => document.getElementById(stop.sectionId));
      
      for (let i = 0; i < sectionElements.length - 1; i++) {
        const el1 = sectionElements[i];
        const el2 = sectionElements[i + 1];
        
        if (!el1 || !el2) continue;
        
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        
        // Very basic interpolation between centers
        const center1 = rect1.top + rect1.height / 2;
        const center2 = rect2.top + rect2.height / 2;
        
        // Window center
        const windowCenter = window.innerHeight / 2;
        
        if (windowCenter >= center1 && windowCenter <= center2) {
          currentSectionIdx.current = i + ((windowCenter - center1) / (center2 - center1));
          break;
        } else if (windowCenter < center1 && i === 0) {
          currentSectionIdx.current = 0;
        } else if (windowCenter > center2 && i === sectionElements.length - 2) {
          currentSectionIdx.current = sectionElements.length - 1;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stops, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !isFinePointer) return;
    
    const handlePointerMove = (e: PointerEvent) => {
      // Normalize pointer coordinates to -1 to 1
      pointerTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [prefersReducedMotion, isFinePointer]);

  // Handle magnetic elements
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const magnets = document.querySelectorAll('[data-ring-magnet]');
    
    const handleMouseEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      
      // Convert screen coords to viewport coords
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
      const y = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;
      
      magnetTarget.current = {
        pos: new THREE.Vector3(x * viewport.width / 2, y * viewport.height / 2, 0.5),
        active: true
      };
      
      el.classList.add('ring-magnet-active');
    };
    
    const handleMouseLeave = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      magnetTarget.current.active = false;
      el.classList.remove('ring-magnet-active');
    };
    
    magnets.forEach(m => {
      m.addEventListener('mouseenter', handleMouseEnter);
      m.addEventListener('mouseleave', handleMouseLeave);
    });
    
    return () => {
      magnets.forEach(m => {
        m.removeEventListener('mouseenter', handleMouseEnter);
        m.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [viewport, prefersReducedMotion]);

  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    if (prefersReducedMotion) {
      // Static position for hero
      const stop = stops[0];
      groupRef.current.position.set(...stop.position);
      groupRef.current.rotation.set(...stop.rotation);
      groupRef.current.scale.setScalar(stop.scale);
      return;
    }

    // Interpolate scroll position
    const idx = currentSectionIdx.current;
    const lowerIdx = Math.floor(idx);
    const upperIdx = Math.min(lowerIdx + 1, stops.length - 1);
    const t = idx - lowerIdx;
    
    const stop1 = stops[lowerIdx];
    const stop2 = stops[upperIdx];
    
    // Target state based on scroll
    const targetPos = new THREE.Vector3().set(...stop1.position).lerp(new THREE.Vector3().set(...stop2.position), t);
    
    const rot1 = new THREE.Euler().set(...stop1.rotation);
    const rot2 = new THREE.Euler().set(...stop2.rotation);
    const targetRot = new THREE.Euler(
      THREE.MathUtils.lerp(rot1.x, rot2.x, t),
      THREE.MathUtils.lerp(rot1.y, rot2.y, t),
      THREE.MathUtils.lerp(rot1.z, rot2.z, t)
    );
    
    const targetScale = THREE.MathUtils.lerp(stop1.scale, stop2.scale, t);
    
    // Apply magnetic hover if active
    if (magnetTarget.current.active) {
      targetPos.lerp(magnetTarget.current.pos, 0.8);
    } else if (isFinePointer) {
      // Subtle parallax based on pointer
      targetPos.x += pointerTarget.current.x * 0.2;
      targetPos.y += pointerTarget.current.y * 0.2;
      
      // Tilt slightly toward pointer
      targetRot.y += pointerTarget.current.x * 0.2;
      targetRot.x -= pointerTarget.current.y * 0.2;
    }
    
    // Idle animation (bobbing and slow rotation)
    const idleY = Math.sin(state.clock.elapsedTime) * 0.05;
    const idleRotY = state.clock.elapsedTime * 0.2;
    
    if (!magnetTarget.current.active) {
      targetPos.y += idleY;
      targetRot.y += idleRotY;
    }

    // Smoothly interpolate current state to target state
    groupRef.current.position.lerp(targetPos, 0.05);
    
    // Use quaternion for smooth rotation interpolation
    const currentQuat = new THREE.Quaternion().setFromEuler(groupRef.current.rotation);
    const targetQuat = new THREE.Quaternion().setFromEuler(targetRot);
    currentQuat.slerp(targetQuat, 0.05);
    groupRef.current.rotation.setFromQuaternion(currentQuat);
    
    // Smooth scale
    const currentScale = groupRef.current.scale.x;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(currentScale, targetScale, 0.05));
  });

  return { groupRef };
}
