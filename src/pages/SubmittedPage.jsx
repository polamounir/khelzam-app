import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { shortFingerprint } from '../utils/deviceFingerprint';
import { resetExam } from '../store/examSlice';
import { resetIntegrity } from '../store/integritySlice';
import Header from '../components/Header';

export default function SubmittedPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { userName, deviceFingerprint, submittedAt, examData, submissionResult, status, alreadySubmittedData } = useSelector((s) => s.exam);
  const dispatch = useDispatch();

  // Guard: if accessed without a submission, go back to home
  useEffect(() => {
    if (status !== 'submitted' && !submissionResult) {
      navigate('/', { replace: true });
    }
  }, [status, submissionResult, navigate]);

  const handleStartNew = () => {
    dispatch(resetExam());
    dispatch(resetIntegrity());
    navigate('/');
  };

  if (!submissionResult && status !== 'submitted') return null;

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
    <>
      <Header />
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-start p-4 py-10 bg-exam-bg text-exam-text pt-20">
      <div className="w-full max-w-2xl space-y-5 animate-fade-in text-start">
        {/* Success Banner */}
        <div className="exam-card text-center border-emerald-500/30 bg-emerald-500/5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
            ✅
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-exam-text mb-1">
            {alreadySubmittedData?.message || t('examSubmitted')}
          </h1>
          <p className="text-exam-muted text-xs sm:text-sm">{t('responsesRecorded')}</p>
          <p className="text-[10px] sm:text-xs font-mono text-exam-muted mt-2 opacity-70">
            {t('submittedAt', { time: formatTs() })}
          </p>
        </div>

        {/* Final Score Card */}
        <div className="exam-card text-center">
          <p className="text-[10px] sm:text-xs font-mono mb-4 text-exam-muted uppercase tracking-widest">
            {t('finalScore')}
            <span className="ms-2 px-1.5 py-0.5 rounded text-[10px] bg-exam-accent/10 text-exam-accent border border-exam-accent/20">
              {submissionResult ? t('provisional') : 'PROVISIONAL'}
            </span>
          </p>

          <div className="relative inline-flex items-center justify-center mb-4">
            <svg width="100" height="100" viewBox="0 0 120 120" className="sm:w-[120px] sm:h-[120px]">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className="text-exam-border" strokeWidth="10" />
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
              <span className="text-2xl sm:text-3xl font-bold font-mono" style={{ color: gradeColor }}>{finalScore}</span>
              <span className="text-[10px] sm:text-xs font-mono text-exam-muted">/ {totalPoints}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl sm:text-4xl font-black font-mono" style={{ color: gradeColor }}>{grade}</span>
            <div className="text-start">
              <p className="text-base sm:text-lg font-bold text-exam-text">{scorePct}%</p>
              <p className="text-[10px] sm:text-xs text-exam-muted">{gradeLabel}</p>
            </div>
          </div>

          <p className="text-xs font-mono mt-4 text-exam-muted italic opacity-70">
            {t('officialResult')}
          </p>
        </div>

        {/* Submission Summary */}
        <div className="exam-card">
          <h2 className="text-base font-bold text-exam-text mb-4 flex items-center gap-2">
            <span>📋</span> {t('submissionSummary')}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-exam-border/40">
              <span className="text-exam-muted text-sm">{t('studentName')}</span>
              <span className="text-exam-text font-semibold">{userName || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-exam-border/40">
              <span className="text-exam-muted text-sm">{t('exam')}</span>
              <span className="text-exam-text font-semibold">{examData?.title || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-exam-border/40">
              <span className="text-exam-muted text-sm">{t('deviceFingerprint')}</span>
              <span className="text-exam-accent font-mono text-sm">{shortFingerprint(deviceFingerprint)}</span>
            </div>
          </div>
        </div>


        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <button
            onClick={handleStartNew}
            className="exam-btn-primary w-full py-4 text-lg"
          >
            🏁 {t('startNewExam') || 'Start New Exam'}
          </button>
          <button
            onClick={() => window.print()}
            className="exam-btn-secondary w-full py-4 text-lg"
          >
            🖨️ {t('printResult') || 'Print Result'}
          </button>
        </div>

        <p className="text-center text-exam-muted text-xs font-mono opacity-60">
          {t('closeSafely')}
        </p>
      </div>
    </div>
    </>
  );
}
