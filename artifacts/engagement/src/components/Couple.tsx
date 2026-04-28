import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { eventConfig } from '../config/event';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Couple: React.FC = () => {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.couple-card');
    
    gsap.fromTo(cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      }
    );
  }, []);

  const isDev = import.meta.env.DEV;

  return (
    <section id="couple" className="py-24 px-6 overflow-hidden">
      <div 
        ref={containerRef}
        className={`max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}
      >
        <div className="couple-card relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden group shadow-xl">
          <img 
            src={eventConfig.images.couple1} 
            alt={eventConfig.groom}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-3xl font-serif text-foreground mb-1">{eventConfig.groom}</h3>
          </div>
          {isDev && (
            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg z-20">
              Replace Me
            </div>
          )}
        </div>

        <div className="couple-card relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden group shadow-xl md:translate-y-12">
          <img 
            src={eventConfig.images.couple2} 
            alt={eventConfig.bride}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-3xl font-serif text-foreground mb-1">{eventConfig.bride}</h3>
          </div>
          {isDev && (
            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg z-20">
              Replace Me
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
