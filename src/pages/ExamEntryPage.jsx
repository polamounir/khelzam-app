import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchExamById, startExam, resetExam } from '../store/examSlice';
import { addToast } from '../store/uiSlice';
import { resetIntegrity } from '../store/integritySlice';
import { generateFingerprint } from '../utils/deviceFingerprint';
import Header from '../components/Header';

/**
 * ExamEntryPage - Refactored to focus solely on the entry form.
 * Handles both /exam (dual input) and /exam/:examId (name only).
 */
export default function ExamEntryPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { examData, loading, error, userName: savedName, status, alreadySubmittedData } = useSelector((s) => s.exam);
  const [name, setName] = useState(savedName || '');
  const [localExamId, setLocalExamId] = useState(examId || '');
  const [isStarting, setIsStarting] = useState(false);

  const handleReset = () => {
    dispatch(resetExam());
    dispatch(resetIntegrity());
    setName('');
    if (!examId) setLocalExamId('');
  };

  // Synchronize localExamId with URL param if it changes
  useEffect(() => {
    if (examId) setLocalExamId(examId);
  }, [examId]);

  // Auto-fetch exam details if ID is present
  useEffect(() => {
    const effectiveId = examId || localExamId;
    if (effectiveId && effectiveId.length >= 8) {
      dispatch(fetchExamById(effectiveId));
    }
  }, [dispatch, examId, localExamId]);

  const handleStart = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Field Validation
    const trimmedName = name.trim();
    if (!trimmedName) {
      dispatch(addToast({ message: t('nameRequired') || 'Name is required', type: 'warning' }));
      return;
    }

    const targetId = (examId || localExamId).trim();
    if (!targetId) {
      dispatch(addToast({ message: t('examIdRequired') || 'Exam ID is required', type: 'warning' }));
      return;
    }

    // Exam Availability Guards
    if (examData) {
      const now = new Date().getTime();
      const isFuture = examData.startDate && new Date(examData.startDate).getTime() > now;
      const isExpired = examData.endDate && new Date(examData.endDate).getTime() < now;

      if (isExpired) {
        dispatch(addToast({ message: t('examEnded') || 'This exam has already ended.', type: 'error' }));
        return;
      }
      if (isFuture) {
        dispatch(addToast({ message: t('examNotStarted') || 'This exam has not started yet.', type: 'warning' }));
        return;
      }
    }

    setIsStarting(true);
    const fingerprint = generateFingerprint();
    
    // Store in Redux
    dispatch(startExam({ 
      userName: trimmedName, 
      deviceFingerprint: fingerprint 
    }));
    
    // Navigate to Active Exam
    navigate(`/exam/${targetId}/active`);
  };

  const hasError = !!error;
  const examTitle = examData?.title || '';
  
  // Dynamic Button State
  const isPending = isStarting || (loading && !!(examId || localExamId));
  const isExpired = hasError && error?.toLowerCase().includes('ended');
  
  const getButtonText = () => {
    if (isPending) return t('loading') || 'Processing...';
    if (isExpired) return t('examEnded');
    return t('startExam');
  };

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 bg-exam-bg transition-colors duration-500 overflow-hidden relative pt-20">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] start-[-5%] w-[40%] h-[40%] bg-exam-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-5%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in z-10">
        <div className="exam-card border-exam-border/40 shadow-2xl bg-exam-surface/80 backdrop-blur-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-exam-accent to-exam-accent-hover text-white text-2xl sm:text-3xl mb-4 sm:6 shadow-xl shadow-exam-accent/20">
              {examTitle ? '📝' : '🔍'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-exam-text tracking-tight mb-2">
              {examTitle || t('joinExam') || 'Join Exam'}
            </h1>
            <p className="text-exam-muted text-sm font-medium">
              {examTitle 
                ? (t('readyToStart') || 'Enter your name to begin the assessment.') 
                : (t('enterExamDetails') || 'Provide the ID and your name to access the portal.')}
            </p>
          </div>

          {status === 'submitted' && alreadySubmittedData ? (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center text-4xl shadow-inner">
                  ✅
                </div>
                <h2 className="text-xl font-bold text-exam-text">
                  {t('alreadySubmitted') || 'Already Submitted'}
                </h2>
                <p className="text-exam-muted text-sm px-2">
                  {alreadySubmittedData.message ||   t('duplicateSubmission') }
                </p>
                <div className="pt-4 border-t border-exam-border/20">
                  <p className="text-xs font-black uppercase tracking-widest text-exam-muted mb-1">
                    {t('submissionId') || 'Submission ID'}
                  </p>
                  <code className="text-exam-accent font-mono text-sm">
                    {alreadySubmittedData.submissionId}
                  </code>
                </div>
              </div>

              <button
                onClick={() => navigate(`/results/${alreadySubmittedData.submissionId}`)}
                className="exam-btn-primary w-full py-4 text-lg font-black tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-exam-accent/30 flex items-center justify-center gap-3"
              >
                📊 {t('viewMySubmission') || 'View My Submission'}
              </button>
              
              <button
                onClick={handleReset}
                className="text-exam-muted text-xs font-bold uppercase tracking-widest hover:text-exam-text transition-colors duration-200 mt-4"
              >
                {t('notYou') || 'Not you? Reset'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleStart} className="space-y-6">
              {/* Reset button if some data exists but not submitted */}
              {(name || (localExamId && !examId)) && (
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={handleReset}
                    className="text-[10px] font-black uppercase tracking-widest text-exam-muted hover:text-exam-accent transition-colors"
                  >
                    {t('clearForm') || 'Clear Form'}
                  </button>
                </div>
              )}
              {/* Exam ID Input - only show if not in URL */}
              {!examId && (
                <div className="space-y-2">
                  <label htmlFor="exam-id" className="block text-sm font-bold text-exam-text px-1">
                    {t('examId')}
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-4 rtl:left-auto rtl:right-4 flex items-center text-exam-muted group-focus-within:text-exam-accent transition-colors duration-200">
                      🔑
                    </span>
                    <input
                      id="exam-id"
                      type="text"
                      className="exam-input ltr:pl-11 rtl:pl-4 rtl:pr-11 ltr:pr-4 py-4 "
                      placeholder={t('examIdPlaceholder') || 'Enter ID...'}
                      value={localExamId}
                      onChange={(e) => setLocalExamId(e.target.value)}
                      autoComplete="off"
                      disabled={isPending}
                    />
                  </div>
                </div>
              )}

              {/* Student Name Input */}
              <div className="space-y-2">
                <label htmlFor="student-name" className="block text-sm font-bold text-exam-text px-1">
                  {t('yourFullName')}
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-4 rtl:left-auto rtl:right-4 flex items-center text-exam-muted group-focus-within:text-exam-accent transition-colors duration-200">
                    👤
                  </span>
                  <input
                    id="student-name"
                    type="text"
                    className="exam-input ltr:pl-11 rtl:pl-4 rtl:pr-11 ltr:pr-4 py-4"
                    placeholder={t('namePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    disabled={isStarting}
                  />
                </div>
              </div>

              {/* Inline Error Messenger */}
              {hasError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-4 animate-slide-up">
                  <span className="text-xl">⚠️</span>
                  <p className="text-sm font-bold text-red-500 leading-tight py-1">
                    {isExpired ? t('examEnded') : error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || isExpired}
                className="exam-btn-primary w-full py-4 text-lg font-black tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-exam-accent/30"
              >
                {getButtonText()}
              </button>
            </form>
          )}
        </div>

        <footer className="mt-12 text-center text-[10px] text-exam-muted font-black uppercase tracking-[0.4em] opacity-40">
          &copy; 2026 John Mounir &bull; Khelzam Examination Gateway
        </footer>
      </div>
    </div>
    </>
  );
}
