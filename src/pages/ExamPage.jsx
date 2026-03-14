import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { submitExam, expireExam, fetchExamById, setSubmitting } from '../store/examSlice';
import { addToast } from '../store/uiSlice';
import { useConfirm } from '../hooks/useConfirm';
import { useExamIntegrity } from '../hooks/useExamIntegrity';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { submitExamAnswers } from '../api';
import { clearExamState } from '../utils/localStorageHelpers';
import CountdownTimer from '../components/CountdownTimer';
import IntegrityBadge from '../components/IntegrityBadge';
import ProgressBar from '../components/ProgressBar';
import QuestionRenderer from '../components/QuestionRenderer';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const confirm = useConfirm();
  const autoSubmitted = useRef(false);
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);

  const { examData, answers, status, userName, deviceFingerprint } = useSelector((s) => s.exam);
  const integrity = useSelector((s) => s.integrity);

  // Guard: redirect to entry page if accessed without a name
  useEffect(() => {
    if (!userName) {
      navigate(`/exam/${examId}`, { replace: true });
    }
  }, [userName, examId, navigate]);

  // Re-fetch data if missing (e.g. on direct navigation or refresh)
  useEffect(() => {
    if (!examData && examId) {
      dispatch(fetchExamById(examId));
    }
  }, [dispatch, examData, examId]);

  // Start integrity monitoring
  useExamIntegrity(status === 'active');

  const { isExpired } = useCountdownTimer(examData?.endDate);

  const handleSubmit = React.useCallback(async (isAutoSubmit = false) => {
    if (!examData) return;

    if (!isAutoSubmit) {
      const confirmed = await confirm({
        title: t('readyToSubmit') || 'Ready to submit?',
        message: t('confirmSubmit'),
        confirmText: t('submitExam'),
        cancelText: t('cancel') || 'Cancel',
        type: 'warning'
      });
      if (!confirmed) return;
    }

    setIsSubmittingInternal(true);
    dispatch(setSubmitting());

    const payload = {
      userName,
      deviceFingerprint,
      tabExitCount: integrity.tabExitCount,
      tabReturnCount: integrity.tabReturnCount,
      integrityEvents: integrity.events.map(ev => ({
        type: ev.type.replace('window_', ''), 
        timestamp: ev.timestamp
      })),
      answers,
    };

    try {
      const response = await submitExamAnswers(examId, payload);
      
      clearExamState();
      
      if (isAutoSubmit) {
        dispatch(expireExam(response.result));
      } else {
        dispatch(submitExam(response.result));
      }
      
      navigate(`/exam/${examId}/submitted`, { replace: true });
      dispatch(addToast({ 
        message: t('examSubmitted') || 'Exam submitted successfully!', 
        type: 'success' 
      }));
    } catch (err) {
      console.error('[ExamPage] Submission failed:', err);
      
      // Check for specific error messages and localize them
      let errorMessage = t('submitError') || 'An error occurred during submission. Please try again.';
      const msg = err.message ? err.message.toLowerCase() : '';
      if (msg.includes('duplicate')) {
        errorMessage = t('duplicateSubmission') || err.message;
      } else if (msg.includes('not started')) {
        errorMessage = t('examNotStarted') || err.message;
      } else if (msg.includes('already ended')) {
        errorMessage = t('examEnded') || err.message;
      } else if (err.message) {
        // Fallback to the raw error message
        errorMessage = err.message;
      }

      dispatch(addToast({ 
        message: errorMessage, 
        type: 'error' 
      }));
      setIsSubmittingInternal(false);
    }
  }, [examData, userName, deviceFingerprint, integrity, answers, examId, dispatch, navigate, t, confirm]);

  // Auto-submit when timer expires
  useEffect(() => {
    if (isExpired && !autoSubmitted.current && status === 'active') {
      autoSubmitted.current = true;
      handleSubmit(true);
    }
  }, [isExpired, status, handleSubmit]);

  if (!examData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-exam-bg text-exam-text font-mono">
        {t('loadingExam')}
      </div>
    );
  }

  const { title, questions, endDate } = examData;
  const answeredCount = Object.keys(answers).filter((k) => {
    const a = answers[k];
    return a !== undefined && a !== '' && !(Array.isArray(a) && a.length === 0);
  }).length;

  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen flex flex-col bg-exam-bg">
      <header className="sticky top-0 z-50 bg-exam-surface/95 backdrop-blur border-b border-exam-border shadow-md shadow-black/20">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-exam-text truncate">{title}</h1>
              <p className="text-xs text-exam-muted font-mono truncate">
                👤 {userName}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <LanguageSwitcher />
              <IntegrityBadge />
              <CountdownTimer endDate={endDate} />
            </div>
          </div>

          <div className="mt-3">
            <ProgressBar answered={answeredCount} total={questions.length} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-8">
        {examData.image && (
          <div className="exam-card p-0 overflow-hidden border-none shadow-2xl">
            <img 
              src={examData.image} 
              alt={title}
              className="w-full h-auto max-h-[300px] object-cover"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}

        {questions && questions.length > 0 ? (
          questions.map((q, i) => (
            <QuestionRenderer key={q.id || i} question={q} index={i} />
          ))
        ) : (
          <div className="text-center py-12 text-exam-muted">
             {t('noQuestionsFound')}
          </div>
        )}

        <div className="exam-card border-exam-accent/30 bg-exam-accent/5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📬</span>
            <div>
              <p className="font-semibold text-exam-text">{t('readyToSubmit')}</p>
              <p className="text-xs text-exam-muted mt-0.5">
                {unansweredCount > 0
                  ? t(unansweredCount === 1 ? 'unansweredSingle' : 'unansweredPlural', { count: unansweredCount })
                  : t('allAnswered')}
              </p>
            </div>
          </div>

          <button
            id="submit-exam-btn"
            onClick={() => handleSubmit(false)}
            disabled={isSubmittingInternal}
            className="exam-btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmittingInternal ? t('submitting') || 'Submitting...' : t('submitExam')}
          </button>
        </div>
      </main>
    </div>
  );
}
