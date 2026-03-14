import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { shortFingerprint } from '../utils/deviceFingerprint';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function SubmittedPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { userName, deviceFingerprint, submittedAt, examData, submissionResult } = useSelector((s) => s.exam);

  // Use real results from backend if available, otherwise fallback to placeholders
  const finalScore = submissionResult?.score ?? 0;
  const totalPoints = submissionResult?.totalPossibleScore ?? (examData?.questions?.reduce((s, q) => s + (q.score || 0), 0) ?? 0);
  const scorePct = submissionResult?.percentage ? parseFloat(submissionResult.percentage) : (totalPoints > 0 ? Math.round((finalScore / totalPoints) * 100) : 0);
  
  const grade =
    scorePct >= 90 ? 'A' : scorePct >= 80 ? 'B' : scorePct >= 70 ? 'C' : scorePct >= 60 ? 'D' : 'F';
  
  const gradeColor =
    grade === 'A' ? '#10b981'
    : grade === 'B' ? '#6366f1'
    : grade === 'C' ? '#f59e0b'
    : grade === 'D' ? '#f97316'
    : '#ef4444';
  
  const gradeLabel = 
    scorePct >= 90 ? t('outstanding') : 
    scorePct >= 80 ? t('good') : 
    scorePct >= 70 ? t('average') : 
    scorePct >= 60 ? t('belowAverage') : 
    t('needsImprovement');

  const formatTs = (iso) => {
    const raw = iso || submissionResult?.submittedAt || submittedAt;
    if (!raw) return '—';
    return new Date(raw).toLocaleString(i18n.language, {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 py-10 bg-[#0a0e1a] text-[#e2e8f0]">
      <div className="absolute top-4 right-4 ltr:right-4 rtl:left-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-2xl space-y-5 animate-fade-in text-start">
        {/* Success Banner */}
        <div className="exam-card text-center" style={{ borderColor: '#10b9814d', backgroundColor: '#10b9810d' }}>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{t('examSubmitted')}</h1>
          <p className="text-slate-400 text-sm">{t('responsesRecorded')}</p>
          <p className="text-xs font-mono text-slate-500 mt-2">
            {t('submittedAt', { time: formatTs() })}
          </p>
        </div>

        {/* Final Score Card */}
        <div className="exam-card text-center">
          <p className="text-xs font-mono mb-4 text-slate-500 uppercase tracking-widest">
            {t('finalScore')}
            <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {submissionResult ? t('provisional') : 'PROVISIONAL'}
            </span>
          </p>

          <div className="relative inline-flex items-center justify-center mb-4">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#1a2235" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={gradeColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - scorePct / 100)}`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold font-mono" style={{ color: gradeColor }}>{finalScore}</span>
              <span className="text-xs font-mono text-slate-500">/ {totalPoints}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl font-black font-mono" style={{ color: gradeColor }}>{grade}</span>
            <div className="text-start">
              <p className="text-lg font-bold text-white">{scorePct}%</p>
              <p className="text-xs text-slate-400">{gradeLabel}</p>
            </div>
          </div>

          <p className="text-xs font-mono mt-4 text-slate-500 italic">
            {t('officialResult')}
          </p>
        </div>

        {/* Submission Summary */}
        <div className="exam-card">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> {t('submissionSummary')}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/40">
              <span className="text-slate-400 text-sm">{t('studentName')}</span>
              <span className="text-white font-semibold">{userName || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/40">
              <span className="text-slate-400 text-sm">{t('exam')}</span>
              <span className="text-white font-semibold">{examData?.title || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/40">
              <span className="text-slate-400 text-sm">{t('deviceFingerprint')}</span>
              <span className="text-indigo-400 font-mono text-sm">{shortFingerprint(deviceFingerprint)}</span>
            </div>
          </div>
        </div>


        <p className="text-center text-slate-500 text-xs font-mono">
          {t('closeSafely')}
        </p>
      </div>
    </div>
  );
}
