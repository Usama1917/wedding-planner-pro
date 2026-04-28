import React, { createContext, useContext, useState, useEffect } from 'react';
import { i18n, Language } from '../config/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof i18n.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('app-lang');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app-lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = i18n[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
