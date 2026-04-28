import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { eventConfig } from '../config/event';
import { MapPin, CalendarDays } from 'lucide-react';

export const EventDetails: React.FC = () => {
  const { t, lang } = useLanguage();

  const handleSaveDate = () => {
    // Generate basic .ics file
    const dateStr = eventConfig.date.replace(/[-:]/g, '').split('.')[0];
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${dateStr}
SUMMARY:Engagement of ${eventConfig.groom} & ${eventConfig.bride}
LOCATION:${eventConfig.venue}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'engagement.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="details" className="py-24 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-12">
          {t.details.title}
        </h2>

        <div className="grid md:grid-cols-2 gap-12 max-w-2xl mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CalendarDays size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-serif text-foreground">{t.details.dateLabel}</h3>
            <p className="text-muted-foreground font-light text-lg">
              {lang === 'ar' ? '١٠ يوليو ٢٠٢٦' : 'July 10, 2026'}<br />
              {lang === 'ar' ? '٧:٠٠ مساءً' : '7:00 PM'}
            </p>
            <button 
              onClick={handleSaveDate}
              className="mt-4 px-6 py-2 border border-primary text-primary rounded-full text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {t.details.saveDate}
            </button>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MapPin size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-serif text-foreground">{t.details.venueLabel}</h3>
            <p className="text-muted-foreground font-light text-lg">
              {eventConfig.venue}
            </p>
            <a 
              href={eventConfig.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-6 py-2 border border-primary text-primary rounded-full text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors inline-block"
            >
              {t.details.openLocation}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
