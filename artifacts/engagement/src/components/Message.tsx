import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Message: React.FC = () => {
  const { t } = useLanguage();
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    
    gsap.fromTo(textRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0, 
        opacity: 1, 
        duration: 1.2, 
        stagger: 0.2, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <section id="message" data-ring-section="message" className="min-h-[70dvh] flex items-center justify-center py-24 px-6 relative">
      <div className="max-w-2xl mx-auto text-center" ref={textRef}>
        <h2 data-ring-anchor className="text-3xl md:text-4xl font-serif text-foreground mb-8">
          {t.message.title}
        </h2>
        <div className="flex justify-center mb-8">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary opacity-60">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="currentColor"/>
          </svg>
        </div>
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light">
          {t.message.text}
        </p>
      </div>
    </section>
  );
};
