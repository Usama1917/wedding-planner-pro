import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const GoldRing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!containerRef.current || !ringRef.current) return;

    // Initial entrance animation
    gsap.fromTo(ringRef.current, 
      { scale: 0.8, opacity: 0, rotationX: 45, rotationY: 45 },
      { scale: 1, opacity: 1, rotationX: 0, rotationY: 0, duration: 2.5, ease: "power3.out" }
    );

    // Scroll linked animations
    const sections = ['#hero', '#message', '#countdown', '#details', '#rsvp', '#footer'];
    
    sections.forEach((section, index) => {
      const el = document.querySelector(section);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        animation: gsap.to(ringRef.current, {
          rotation: index * 45,
          scale: index % 2 === 0 ? 1 : 0.85,
          y: Math.sin(index) * 20,
          ease: "none"
        })
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-4xl mx-auto flex items-center justify-center opacity-30 dark:opacity-20">
        <svg 
          ref={ringRef}
          width="400" 
          height="400" 
          viewBox="0 0 400 400" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] dark:drop-shadow-[0_0_40px_rgba(212,175,55,0.6)]"
        >
          <circle cx="200" cy="200" r="140" stroke="url(#goldGradient)" strokeWidth="6" className="opacity-80"/>
          <circle cx="200" cy="200" r="130" stroke="url(#goldGradient)" strokeWidth="2" className="opacity-50"/>
          <ellipse cx="200" cy="60" rx="15" ry="25" fill="url(#diamondGradient)" transform="rotate(45 200 60)" />
          <ellipse cx="200" cy="60" rx="15" ry="25" fill="url(#diamondGradient)" transform="rotate(-45 200 60)" />
          
          <defs>
            <linearGradient id="goldGradient" x1="60" y1="60" x2="340" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F9F1CC" />
              <stop offset="25%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#AA7B18" />
              <stop offset="75%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#F9F1CC" />
            </linearGradient>
            <linearGradient id="diamondGradient" x1="185" y1="35" x2="215" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
