import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { submitExam, expireExam, fetchExamById, setSubmitting, setReviewMode, resetExam } from '../store/examSlice';
import { addToast } from '../store/uiSlice';
import { resetIntegrity } from '../store/integritySlice';
import { useConfirm } from '../hooks/useConfirm';
import { useExamIntegrity } from '../hooks/useExamIntegrity';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { submitExamAnswers } from '../api';
import { clearExamState } from '../utils/localStorageHelpers';
import Header from '../components/Header';
import CountdownTimer from '../components/CountdownTimer';
// import IntegrityBadge from '../components/IntegrityBadge';
import ProgressBar from '../components/ProgressBar';
import QuestionRenderer from '../components/QuestionRenderer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AlreadySubmittedModal from '../components/AlreadySubmittedModal';


export default function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const confirm = useConfirm();
  const autoSubmitted = useRef(false);
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);

  const { examData, answers, status, userName, deviceFingerprint, flaggedQuestions, reviewMode, error: sliceError, loading } = useSelector((s) => s.exam);
  const integrity = useSelector((s) => s.integrity);

  const handleReturnToEntry = () => {
    dispatch(resetExam());
    dispatch(resetIntegrity());
    navigate('/exam');
  };

  // Guard: redirect to entry page if accessed without a name
  useEffect(() => {
    if (!userName) {
      navigate(`/exam/${examId}`, { replace: true });
    }
  }, [userName, examId, navigate]);

  // Re-fetch data if missing (e.g. on direct navigation or refresh)
  useEffect(() => {
    if (!examData && examId && !sliceError) {
      dispatch(fetchExamById(examId));
    }
  }, [dispatch, examData, examId, sliceError]);

  // Start integrity monitoring
  // useExamIntegrity(status === 'active');

  const { isExpired } = useCountdownTimer(examData?.endDate);

  const handleSubmit = React.useCallback(async (isAutoSubmit = false) => {
    if (!examData) return;

    if (!isAutoSubmit && !reviewMode) {
      dispatch(setReviewMode(true));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!isAutoSubmit) {
      const confirmed = await confirm({
        title: t('finalSubmission') || 'Final Submission',
        message: t('confirmSubmitFinal') || 'Are you sure you want to submit? You cannot change your answers after this.',
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
      tabExitCount: 0,
      tabReturnCount: 0,
      integrityEvents: [],
      answers,
    };

    try {
      const response = await submitExamAnswers(examId, payload);
      
      clearExamState();
      
      if (isAutoSubmit) {
        dispatch(expireExam(response));
      } else {
        dispatch(submitExam(response));
      }
      
      navigate(`/exam/${examId}/submitted`, { replace: true });
      dispatch(addToast({ 
        message: response.message || t('examSubmitted') || '000 Exam submitted successfully!', 
        type: 'success' 
      }));
    } catch (err) {
      console.error('[ExamPage] Submission failed:', err);
      
      // Check for specific error messages and localize them
      let errorMessage = t('submitError') || 'An error occurred during submission. Please try again.';
      const msg = err.message ? err.message.toLowerCase() : '';
      
      if (msg.includes('duplicate') || msg.includes('already submitted')) {
        setShowSubmittedModal(true);
        setIsSubmittingInternal(false);
        return; // Skip toast
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
  }, [examData, userName, deviceFingerprint, integrity, answers, examId, dispatch, navigate, t, confirm, reviewMode]);

  // Auto-submit when timer expires
  useEffect(() => {
    if (isExpired && !autoSubmitted.current && status === 'active') {
      autoSubmitted.current = true;
      handleSubmit(true);
    }
  }, [isExpired, status, handleSubmit]);

  if (sliceError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-exam-bg text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-4xl">⚠️</div>
        <div className="space-y-2 max-w-sm">
          <h1 className="text-2xl font-bold text-exam-text">{t('error') || 'Error'}</h1>
          <p className="text-exam-muted">{sliceError}</p>
        </div>
        <button onClick={handleReturnToEntry} className="exam-btn-primary px-8">
          {t('backToEntry') || 'Return to Entry'}
        </button>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-exam-bg space-y-6">
        <LoadingSpinner />
        {!loading && (
          <button onClick={handleReturnToEntry} className="exam-btn-secondary">
             {t('backToEntry') || 'Return to Entry'}
          </button>
        )}
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
    <>
      <AlreadySubmittedModal 
        isOpen={showSubmittedModal} 
        onClose={() => setShowSubmittedModal(false)} 
      />
      
      <Header>
        <div className="hidden md:block w-px h-6 bg-exam-border/40 mx-2" />
        <div className="flex items-center justify-between flex-1 gap-4 min-w-0">
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-exam-text truncate">{title}</h1>
            <p className="text-xs text-exam-muted font-mono truncate hidden sm:block">
              👤 {userName}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            {/* <IntegrityBadge /> */}
            <CountdownTimer endDate={endDate} />
          </div>
        </div>
      </Header>

      <div className="min-h-screen flex flex-col bg-exam-bg pt-20">
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-8">
          <div className="sticky top-[88px] z-30 bg-exam-bg/95 backdrop-blur-sm py-3 mb-6">
            <ProgressBar answered={answeredCount} total={questions.length} />
          </div>

          {examData.image && !imageError && (
            <div className="exam-card p-0 overflow-hidden border-none shadow-2xl mb-8">
              <img 
                src={examData.image} 
                alt={title}
                className="w-full h-auto max-h-[300px] object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          )}

          {reviewMode ? (
            <div className="space-y-6 animate-fade-in">
              <div className="exam-card border-exam-accent bg-exam-accent/5">
                <h2 className="text-xl font-bold text-exam-text mb-4 flex items-center gap-2">
                  <span>📋</span> {t('reviewYourAnswers') || 'Review Your Answers'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-exam-surface border border-exam-border text-center">
                    <p className="text-2xl font-bold text-exam-text">{questions.length}</p>
                    <p className="text-xs text-exam-muted uppercase font-bold">{t('totalQuestions') || 'Total'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-exam-surface border border-exam-border text-center">
                    <p className="text-2xl font-bold text-exam-success">{answeredCount}</p>
                    <p className="text-xs text-exam-muted uppercase font-bold">{t('answered')}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-exam-surface border border-exam-border text-center">
                    <p className="text-2xl font-bold text-amber-500">{flaggedQuestions.length}</p>
                    <p className="text-xs text-exam-muted uppercase font-bold">{t('flagged') || 'Flagged'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {questions.map((q, i) => {
                  const isAnswered = !!answers[q.id];
                  const isFlagged = flaggedQuestions.includes(q.id);
                  return (
                    <div 
                      key={q.id || i}
                      onClick={() => {
                        dispatch(setReviewMode(false));
                        setTimeout(() => {
                          const el = document.getElementById(`q-container-${q.id || i}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                      }}
                      className="exam-card py-3 px-4 flex items-center justify-between cursor-pointer hover:border-exam-accent transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded flex items-center justify-center bg-exam-surface text-xs font-bold text-exam-muted group-hover:text-exam-accent">
                          {i + 1}
                        </span>
                        <p className="text-sm font-medium text-exam-text truncate max-w-[200px] sm:max-w-md">
                          {q.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isFlagged && <span title="Flagged">🚩</span>}
                        <span className={`w-2 h-2 rounded-full ${isAnswered ? 'bg-exam-success' : 'bg-red-500'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => dispatch(setReviewMode(false))}
                  className="exam-btn-secondary flex-1 py-4"
                >
                  {t('backToQuestions') || 'Back to Questions'}
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmittingInternal}
                  className="exam-btn-primary flex-[2] py-4 text-lg"
                >
                  {isSubmittingInternal ? t('submitting') : t('confirmAndSubmit') || 'Confirm & Submit'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {questions && questions.length > 0 ? (
                questions.map((q, i) => (
                  <div id={`q-container-${q.id || i}`} key={q.id || i}>
                    <QuestionRenderer question={q} index={i} />
                  </div>
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
                    <p className="font-semibold text-exam-text">{reviewMode ? t('finalSubmission') : t('readyToSubmit')}</p>
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
                  {isSubmittingInternal ? t('submitting') : t('goToReview') || 'Go to Review'}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
