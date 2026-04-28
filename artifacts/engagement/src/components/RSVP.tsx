import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { eventConfig } from '../config/event';

export const RSVP: React.FC = () => {
  const { t, lang } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(() => {
    return localStorage.getItem('rsvp-submitted') === 'true';
  });

  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('rsvp-submitted', 'true');
    setIsSubmitted(true);

    const waMessage = lang === 'ar' 
      ? `مرحباً، أود تأكيد حضوري لحفل الخطوبة.${formData.name ? `%0Aالاسم: ${formData.name}` : ''}${formData.message ? `%0Aالرسالة: ${formData.message}` : ''}`
      : `Hello, I'd like to confirm my attendance for the engagement.${formData.name ? `%0AName: ${formData.name}` : ''}${formData.message ? `%0AMessage: ${formData.message}` : ''}`;
    
    window.open(`https://wa.me/${eventConfig.rsvpWhatsAppNumber}?text=${waMessage}`, '_blank');
  };

  return (
    <section id="rsvp" data-ring-section="rsvp" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 data-ring-anchor className="text-3xl md:text-5xl font-serif text-foreground mb-4">
            {t.rsvp.title}
          </h2>
          <p className="text-muted-foreground font-light text-lg">
            {t.rsvp.subtitle}
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-card border border-card-border rounded-2xl p-10 text-center shadow-lg animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-foreground mb-2">{t.rsvp.successTitle}</h3>
            <p className="text-muted-foreground">{t.rsvp.successMessage}</p>
          </div>
        ) : (
          <form data-ring-avoid onSubmit={handleSubmit} className="space-y-8 bg-card/50 backdrop-blur-md border border-card-border p-8 md:p-12 rounded-2xl shadow-xl">
            <div>
              <label htmlFor="name" className="block text-sm font-sans uppercase tracking-widest text-muted-foreground mb-2">
                {t.rsvp.name} <span className="lowercase text-xs opacity-60">({lang === 'ar' ? 'اختياري' : 'Optional'})</span>
              </label>
              <input 
                type="text" 
                id="name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-background border-b border-border px-0 py-3 focus:outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-sans uppercase tracking-widest text-muted-foreground mb-2">
                {t.rsvp.message}
              </label>
              <textarea 
                id="message" 
                rows={6}
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-background border-b border-border px-0 py-3 focus:outline-none focus:border-primary transition-colors text-foreground resize-none text-lg font-light leading-relaxed"
                placeholder={lang === 'ar' ? 'اكتب رسالة لأسامة وشهد...' : 'Write a message for Osama & Shahd...'}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 rounded-full font-sans uppercase tracking-widest text-sm hover:opacity-90 transition-opacity mt-8"
            >
              {t.rsvp.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
