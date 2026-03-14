import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ProgressBar({ answered, total }) {
  const { t } = useTranslation();
  const pct = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-exam-muted tracking-widest">
        <span>{t('progressLabel')}</span>
        <span>{answered} / {total}</span>
      </div>
      <div className="h-1.5 w-full bg-exam-surface rounded-full overflow-hidden border border-exam-border">
        <div 
          className="h-full bg-gradient-to-r from-exam-accent to-indigo-400 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
