import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCountdownTimer } from '../hooks/useCountdownTimer';

export default function CountdownTimer({ endDate }) {
  const { t } = useTranslation();
  const { timeLeft, isWarning, isDanger } = useCountdownTimer(endDate);

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
      isDanger ? 'bg-red-500/10 border-red-500/30 animate-pulse' : 
      isWarning ? 'bg-amber-500/10 border-amber-500/30' : 
      'bg-exam-surface border-exam-border'
    }`}>
      <span className="text-sm">⏱️</span>
      <div className="flex flex-col">
        <span className={`text-xs font-mono font-bold leading-none ${
          isDanger ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-exam-text'
        }`}>
          {timeLeft}
        </span>
        <span className="text-[10px] uppercase font-bold text-exam-muted leading-none mt-0.5">
          {t('remaining')}
        </span>
      </div>
    </div>
  );
}
