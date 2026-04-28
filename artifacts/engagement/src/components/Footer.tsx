import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { eventConfig } from '../config/event';

export const Footer: React.FC = () => {
  const { t, lang } = useLanguage();

  return (
    <footer id="footer" className="py-24 text-center relative overflow-hidden">
      <div className="max-w-2xl mx-auto px-6 relative z-10">
        <p className="text-muted-foreground font-light italic mb-6 text-xl">
          {t.footer.closing}
        </p>
        <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8">
          {lang === 'ar' ? (
            `${eventConfig.groom} و ${eventConfig.bride}`
          ) : (
            `${eventConfig.groom} & ${eventConfig.bride}`
          )}
        </h2>
        {eventConfig.hashtag && (
          <p className="text-primary font-sans tracking-widest text-sm uppercase">
            {eventConfig.hashtag}
          </p>
        )}
      </div>
    </footer>
  );
};
