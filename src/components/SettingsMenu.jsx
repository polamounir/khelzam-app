import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function SettingsMenu() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="relative inline-block text-start" ref={menuRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-exam-surface px-4 py-2 text-sm font-semibold text-exam-text shadow-sm ring-1 ring-inset ring-exam-border hover:bg-exam-card transition-all duration-200"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="text-lg">⚙️</span>
          <svg className={`-me-1 h-5 w-5 text-exam-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div 
          className="absolute end-0 z-50 mt-2 w-64 origin-top-end rounded-2xl bg-exam-surface/90 backdrop-blur-xl shadow-2xl ring-1 ring-exam-border focus:outline-none animate-slide-up border border-exam-border overflow-hidden" 
          role="menu" 
          aria-orientation="vertical" 
          aria-labelledby="menu-button" 
          tabIndex="-1"
        >
          <div className="py-2" role="none">
            {/* Theme Toggle */}
            <div className="px-4 py-3 flex items-center justify-between hover:bg-exam-accent/5 transition-colors group">
              <span className="text-sm font-bold text-exam-text">{t('themeSettings')}</span>
              <button 
                onClick={toggleTheme}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-exam-accent focus:ring-offset-2 ${theme === 'dark' ? 'bg-exam-accent' : 'bg-exam-border'}`}
                role="switch" 
                aria-checked={theme === 'dark'}
              >
                <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white ring-0 transition-transform duration-300 ease-in-out shadow-lg flex items-center justify-center text-[10px] ${theme === 'dark' ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'}`}>
                  {theme === 'dark' ? '🌙' : '☀️'}
                </span>
              </button>
            </div>

            <div className="h-px bg-exam-border mx-4 my-1 opacity-50"/>

            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="text-exam-text block w-full px-4 py-3 text-sm text-start font-bold hover:bg-exam-accent/10 hover:text-exam-accent transition-all duration-200 group"
              role="menuitem"
              tabIndex="-1"
            >
              <span className="flex items-center gap-3">
                <span className="text-lg group-hover:scale-110 transition-transform">🌐</span>
                {i18n.language.startsWith('ar') ? t('switchToEnglish') : t('switchToArabic')}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
