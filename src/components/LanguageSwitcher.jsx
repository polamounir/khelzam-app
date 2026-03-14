import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLng);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-exam-border bg-exam-surface hover:bg-exam-card transition-colors text-xs font-medium text-exam-text"
    >
      <span className="text-sm">🌐</span>
      <span>{i18n.language === 'ar' ? t('switchToEnglish') : t('switchToArabic')}</span>
    </button>
  );
}
