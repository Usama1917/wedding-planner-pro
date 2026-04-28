import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useLanguage } from '../../contexts/LanguageContext';

type SmartTarget = {
  pos: THREE.Vector3;
  rot: THREE.Euler;
  scale: number;
};

// Singleton to track interactions globally for performance
const interactionState = {
  lastTime: Date.now(),
  isActive: true,
  ping() {
    this.lastTime = Date.now();
    this.isActive = true;
  }
};

if (typeof window !== 'undefined') {
  const ping = () => interactionState.ping();
  window.addEventListener('scroll', ping, { passive: true });
  window.addEventListener('mousemove', ping, { passive: true });
  window.addEventListener('pointerdown', ping, { passive: true });
  window.addEventListener('keydown', ping, { passive: true });
  window.addEventListener('touchstart', ping, { passive: true });
  window.addEventListener('focusin', ping, { passive: true });
}

export function useRingChoreography() {
  const groupRef = useRef<THREE.Group>(null);
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';
  
  const { size, viewport } = useThree();
  const isMobile = size.width < 768;
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const isFinePointer = typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : false;

  const targetRef = useRef<SmartTarget>({
    pos: new THREE.Vector3(0, 0, 0),
    rot: new THREE.Euler(Math.PI / 4, Math.PI / 6, 0),
    scale: isMobile ? 0.18 : 0.25
  });

  const pointerTarget = useRef(new THREE.Vector3());
  const magnetTarget = useRef<{pos: THREE.Vector3, active: boolean}>({ pos: new THREE.Vector3(), active: false });
  const orbitState = useRef({ active: false, anchorRect: null as DOMRect | null, startTime: 0, angleOffset: 0 });

  // Helper to convert screen space to world space
  const screenToWorld = (screenX: number, screenY: number, z: number = 0) => {
    const x = (screenX / window.innerWidth) * 2 - 1;
    const y = -(screenY / window.innerHeight) * 2 + 1;
    return new THREE.Vector3(x * viewport.width / 2, y * viewport.height / 2, z);
  };

  // Smart placement engine
  useEffect(() => {
    if (prefersReducedMotion) return;

    let lastEvalTime = 0;
    const evalInterval = 100; // ~10Hz

    const evalPlacement = () => {
      const now = Date.now();
      if (now - lastEvalTime < evalInterval) {
        requestAnimationFrame(evalPlacement);
        return;
      }
      lastEvalTime = now;

      // 1. Find active section (most visible)
      const sections = Array.from(document.querySelectorAll('[data-ring-section]'));
      let activeSection: Element | null = null;
      let maxVisibleArea = -1;
      
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      sections.forEach(sec => {
        const rect = sectionRects.get(sec) || sec.getBoundingClientRect();
        sectionRects.set(sec, rect); // cache
        const visibleHeight = Math.max(0, Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top));
        if (visibleHeight > maxVisibleArea) {
          maxVisibleArea = visibleHeight;
          activeSection = sec;
        }
      });

      if (!activeSection) {
        requestAnimationFrame(evalPlacement);
        return;
      }

      // Check for idle orbit
      const timeSinceInteraction = now - interactionState.lastTime;
      if (timeSinceInteraction > 5000 && !orbitState.current.active) {
        // Start orbit
        const anchors = Array.from(activeSection.querySelectorAll('[data-ring-anchor]'));
        const anchor = anchors[Math.floor(Math.random() * anchors.length)] || activeSection.querySelector('h1, h2, img, .card');
        if (anchor) {
          orbitState.current = {
            active: true,
            anchorRect: anchor.getBoundingClientRect(),
            startTime: now,
            angleOffset: Math.random() * Math.PI * 2
          };
        }
      } else if (timeSinceInteraction <= 5000) {
        orbitState.current.active = false;
      }

      if (!orbitState.current.active) {
        // Smart placement logic (empty space finding)
        const avoidElements = Array.from(document.querySelectorAll('[data-ring-avoid], h1, h2, h3, p, input, textarea, button, .card, img, [role="button"]'));
        const floatingControls = document.querySelector('.floating-controls');
        if (floatingControls) avoidElements.push(floatingControls);

        const avoidRects = avoidElements
          .filter(el => activeSection?.contains(el) || el === floatingControls)
          .map(el => el.getBoundingClientRect())
          .filter(rect => rect.width > 0 && rect.height > 0);

        const safeMargin = isMobile ? 40 : 80;
        const gridCols = isMobile ? 4 : 6;
        const gridRows = isMobile ? 4 : 6;

        const secRect = activeSection.getBoundingClientRect();
        const visibleTop = Math.max(0, secRect.top);
        const visibleBottom = Math.min(windowHeight, secRect.bottom);
        const visibleHeight = visibleBottom - visibleTop;

        let bestPoint = { x: windowWidth / 2, y: windowHeight / 2, score: -1 };

        if (visibleHeight > 100) {
          for (let i = 1; i < gridCols; i++) {
            for (let j = 1; j < gridRows; j++) {
              const cx = (windowWidth / gridCols) * i;
              const cy = visibleTop + (visibleHeight / gridRows) * j;

              // Distance to closest avoid rect
              let minDist = Infinity;
              for (const r of avoidRects) {
                // Approximate distance to rect
                const rx = Math.max(r.left, Math.min(cx, r.right));
                const ry = Math.max(r.top, Math.min(cy, r.bottom));
                const d = Math.hypot(cx - rx, cy - ry);
                if (d < minDist) minDist = d;
              }

              if (minDist < safeMargin) continue;

              // Score point
              const distToCenterY = Math.abs(cy - windowHeight / 2);
              const edgeBias = isRTL 
                ? (cx / windowWidth) // Prefer right in RTL
                : (1 - cx / windowWidth); // Prefer left in LTR

              const score = minDist * 2 - distToCenterY * 0.5 + edgeBias * 100;

              if (score > bestPoint.score) {
                bestPoint = { x: cx, y: cy, score };
              }
            }
          }
        }

        const newTarget = screenToWorld(bestPoint.x, bestPoint.y, 0);
        targetRef.current.pos.copy(newTarget);
        targetRef.current.rot.set(Math.PI / 6, isRTL ? -Math.PI / 6 : Math.PI / 6, 0);
      } else {
        // Orbit logic
        const anchorRect = orbitState.current.anchorRect;
        if (anchorRect) {
          const orbitRadiusPixels = Math.min(80, Math.max(24, Math.min(anchorRect.width, anchorRect.height) / 2));
          const cx = anchorRect.left + anchorRect.width / 2;
          const cy = anchorRect.top + anchorRect.height / 2;
          
          const orbitElapsed = (now - orbitState.current.startTime) / 1000;
          const speed = Math.PI * 2 / 15; // 15s per orbit
          const angle = orbitElapsed * speed + orbitState.current.angleOffset;

          const px = cx + Math.cos(angle) * orbitRadiusPixels;
          const py = cy + Math.sin(angle) * orbitRadiusPixels * 0.5; // slight tilt

          const newTarget = screenToWorld(px, py, Math.sin(angle) * 0.5); // Z wobble
          targetRef.current.pos.copy(newTarget);
          
          // Bank into the turn
          targetRef.current.rot.set(
            Math.PI / 4 + Math.cos(angle) * 0.2,
            Math.PI / 6 + Math.sin(angle) * 0.3,
            Math.cos(angle) * 0.1
          );
        }
      }

      requestAnimationFrame(evalPlacement);
    };

    const sectionRects = new Map<Element, DOMRect>();
    
    // Clear caches on scroll/resize
    const clearCaches = () => sectionRects.clear();
    window.addEventListener('scroll', clearCaches, { passive: true });
    window.addEventListener('resize', clearCaches, { passive: true });

    const rafId = requestAnimationFrame(evalPlacement);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', clearCaches);
      window.removeEventListener('resize', clearCaches);
    };
  }, [prefersReducedMotion, viewport, isMobile, isRTL]);

  useEffect(() => {
    if (prefersReducedMotion || !isFinePointer) return;
    const handlePointerMove = (e: PointerEvent) => {
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
      interactionState.ping();
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
      const y = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;
      magnetTarget.current = {
        pos: new THREE.Vector3(x * viewport.width / 2, y * viewport.height / 2, 0),
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

  useFrame((state) => {
    if (!groupRef.current) return;
    
    if (prefersReducedMotion) {
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(Math.PI / 6, 0, 0);
      groupRef.current.scale.setScalar(targetRef.current.scale);
      return;
    }

    const tPos = new THREE.Vector3().copy(targetRef.current.pos);
    const tRot = new THREE.Euler().copy(targetRef.current.rot);
    
    if (magnetTarget.current.active) {
      tPos.lerp(magnetTarget.current.pos, 0.1);
    } else if (isFinePointer && !orbitState.current.active) {
      tPos.x += pointerTarget.current.x * 0.1;
      tPos.y += pointerTarget.current.y * 0.1;
      tRot.y += pointerTarget.current.x * 0.2;
      tRot.x -= pointerTarget.current.y * 0.2;
    }
    
    if (!magnetTarget.current.active && !orbitState.current.active) {
      const idleY = Math.sin(state.clock.elapsedTime * 1.5) * 0.015;
      const idleRotY = state.clock.elapsedTime * 0.06;
      const idleRotX = Math.sin(state.clock.elapsedTime * 1.2) * 0.02;
      tPos.y += idleY;
      tRot.y += idleRotY;
      tRot.x += idleRotX;
    }

    // Velocity capping to prevent darting
    const maxDist = 0.5; // max units per frame
    const dist = groupRef.current.position.distanceTo(tPos);
    if (dist > maxDist) {
      tPos.copy(groupRef.current.position).lerp(tPos, maxDist / dist);
    }

    groupRef.current.position.lerp(tPos, orbitState.current.active ? 0.05 : 0.03);
    
    const currentQuat = new THREE.Quaternion().setFromEuler(groupRef.current.rotation);
    const targetQuat = new THREE.Quaternion().setFromEuler(tRot);
    currentQuat.slerp(targetQuat, orbitState.current.active ? 0.05 : 0.03);
    groupRef.current.rotation.setFromQuaternion(currentQuat);
    
    const currentScale = groupRef.current.scale.x;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(currentScale, targetRef.current.scale, 0.03));
  });

  return { groupRef };
}
