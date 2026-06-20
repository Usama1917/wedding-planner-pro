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
    <section id="couple" data-ring-section="couple" className="py-24 px-6 overflow-hidden">
      <div 
        ref={containerRef}
        className="max-w-4xl mx-auto flex items-center justify-center"
      >
        <figure data-ring-anchor className="couple-card w-full max-w-md group">
          <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl ${lang === 'ar' ? '[direction:rtl]' : ''}`}>
            <img
              src={eventConfig.images.couple}
              alt={`${eventConfig.groom} & ${eventConfig.bride}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent opacity-70 group-hover:opacity-45 transition-opacity duration-500"></div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            {isDev && (
              <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg z-20">
                Replace Me
              </div>
            )}
          </div>
          <figcaption className="mt-8 text-center">
            <h3 className="text-4xl sm:text-5xl font-serif text-foreground">
              {eventConfig.groom} &amp; {eventConfig.bride}
            </h3>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
