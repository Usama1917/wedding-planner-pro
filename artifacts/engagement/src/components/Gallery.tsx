import React, { useEffect, useRef } from 'react';
import { eventConfig } from '../config/event';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Gallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const images = [
    { src: eventConfig.images.gallery1, alt: "Gallery 1", className: "col-span-2 row-span-2 md:col-span-2 md:row-span-2" },
    { src: eventConfig.images.gallery2, alt: "Gallery 2", className: "col-span-1 row-span-1" },
    { src: eventConfig.images.gallery3, alt: "Gallery 3", className: "col-span-1 row-span-1" },
    { src: eventConfig.images.gallery4, alt: "Gallery 4", className: "col-span-2 row-span-1" },
    { src: eventConfig.images.gallery5, alt: "Gallery 5", className: "col-span-2 md:col-span-1 md:row-span-2" },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll('.gallery-item');
    
    gsap.fromTo(items,
      { y: 50, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.1,
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
    <section id="gallery" data-ring-section="gallery" className="py-24 px-4 md:px-8">
      <div 
        ref={containerRef}
        className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]"
      >
        {images.map((img, i) => (
          <div 
            key={i} 
            data-ring-anchor
            data-ring-avoid
            className={`gallery-item relative overflow-hidden rounded-xl group bg-muted ${img.className}`}
          >
            <img 
              src={img.src} 
              alt={img.alt} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
            
            {isDev && (
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                Replace Me
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
