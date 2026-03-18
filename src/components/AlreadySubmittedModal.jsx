import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function AlreadySubmittedModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" dir="auto">
      <div 
        className="bg-exam-surface border border-exam-border rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-slide-up text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-amder-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
          <span className="text-3xl text-amber-500">🚫</span>
        </div>
        
        <h3 className="text-xl font-extrabold text-exam-text mb-2">
          {t('alreadySubmittedTitle')}
        </h3>
        
        <p className="text-sm text-exam-muted mb-6 leading-relaxed">
          {t('alreadySubmittedDesc')}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/exam')}
            className="exam-btn-primary w-full py-3 text-base"
          >
            {t('backToHome')}
          </button>
          <button
            onClick={onClose}
            className="exam-btn-secondary w-full py-3 text-base"
          >
            {t('cancel') || 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
