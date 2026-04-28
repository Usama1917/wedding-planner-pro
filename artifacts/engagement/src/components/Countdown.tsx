import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { eventConfig } from '../config/event';

export const Countdown: React.FC = () => {
  const { t, lang } = useLanguage();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(eventConfig.date).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: t.countdown.days, value: timeLeft.days },
    { label: t.countdown.hours, value: timeLeft.hours },
    { label: t.countdown.minutes, value: timeLeft.minutes },
    { label: t.countdown.seconds, value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" data-ring-section="countdown" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div data-ring-avoid className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
          {timeUnits.map((unit, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center p-6 bg-card/50 backdrop-blur-sm border border-card-border rounded-xl shadow-sm"
            >
              <span className="text-4xl md:text-5xl font-serif text-primary mb-2">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-sm md:text-base text-muted-foreground uppercase tracking-widest font-sans">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
