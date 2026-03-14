import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function IntegrityBadge() {
  const { t } = useTranslation();
  const { tabExitCount, windowBlurCount } = useSelector((s) => s.integrity);
  const totalAbuse = tabExitCount + windowBlurCount;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
      totalAbuse === 0 
        ? 'bg-emerald-500/10 border-emerald-500/30' 
        : 'bg-red-500/10 border-red-500/30'
    }`}>
      <span className="text-sm">{totalAbuse === 0 ? '🛡️' : '🚨'}</span>
      <span className={`text-xs font-bold ${totalAbuse === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {totalAbuse === 0 
          ? t('integrityClean') 
          : t('integrityTitle')}
      </span>
    </div>
  );
}
