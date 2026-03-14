import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="text-6xl mb-4">🔦</div>
      <h1 className="text-3xl font-bold text-exam-text mb-2">{t('notFound')}</h1>
      <p className="text-exam-muted mb-8 max-w-sm">
        {t('notFoundDesc')}
      </p>
      <button 
        onClick={() => navigate('/')}
        className="exam-btn-primary"
      >
        {t('goBack')}
      </button>
    </div>
  );
}
