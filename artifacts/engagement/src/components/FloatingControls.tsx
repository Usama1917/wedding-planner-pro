import React, { useState, useEffect } from 'react';
import { Moon, Sun, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const FloatingControls: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 
             (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex gap-3 floating-controls">
      <button 
        onClick={toggleLang}
        className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors"
        aria-label="Toggle Language"
      >
        <Languages size={18} />
      </button>
      <button 
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
};
