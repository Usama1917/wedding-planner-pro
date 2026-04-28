import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { eventConfig } from '../config/event';
import gsap from 'gsap';

export const Hero: React.FC = () => {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    gsap.fromTo(textRef.current.children,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out", delay: 0.5 }
    );
  }, [lang]);

  const scrollToNext = () => {
    document.getElementById('message')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" ref={containerRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${eventConfig.images.hero})` }}
      >
        <div className="absolute inset-0 bg-background/60 dark:bg-background/80 backdrop-blur-[2px]"></div>
      </div>

      <div ref={textRef} className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto pt-20">
        <motion.div 
          className="text-sm md:text-base tracking-[0.2em] uppercase text-primary mb-6 font-sans font-light"
        >
          {t.hero.subtitle}
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground mb-8 leading-tight drop-shadow-sm">
          {lang === 'ar' ? (
            <div className="flex flex-col gap-4">
              <span>{eventConfig.groom}</span>
              <span className="text-3xl md:text-5xl text-primary italic">&</span>
              <span>{eventConfig.bride}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <span>{eventConfig.groom}</span>
              <span className="text-3xl md:text-5xl text-primary italic">&amp;</span>
              <span>{eventConfig.bride}</span>
            </div>
          )}
        </h1>

        <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mb-8"></div>

        <div className="text-lg md:text-xl text-muted-foreground font-sans font-light mb-12 tracking-widest">
          {t.hero.date}
        </div>

        <button 
          onClick={scrollToNext}
          className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full border border-primary/30 hover:border-primary transition-colors duration-500"
        >
          <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          <span className="relative z-10 text-foreground font-sans tracking-widest text-sm">
            {t.hero.cta}
          </span>
        </button>
      </div>
    </section>
  );
};
