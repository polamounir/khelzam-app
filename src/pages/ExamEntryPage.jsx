import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchExamById, startExam } from '../store/examSlice';
import { addToast } from '../store/uiSlice';
import { generateFingerprint } from '../utils/deviceFingerprint';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function ExamEntryPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { examData, loading, error, userName: savedName } = useSelector((s) => s.exam);
  const [name, setName] = useState(savedName || '');
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (examId) {
      dispatch(fetchExamById(examId));
    }
  }, [dispatch, examId]);

  const handleStart = async () => {
    if (!name.trim()) {
      dispatch(addToast({ 
        message: t('nameRequired') || 'Name is required', 
        type: 'warning' 
      }));
      return;
    }
    if (name.trim().length < 2) {
      dispatch(addToast({ 
        message: t('nameTooShort') || 'Name is too short', 
        type: 'warning' 
      }));
      return;
    }

    setIsStarting(true);
    const fingerprint = generateFingerprint();
    
    dispatch(startExam({ 
      userName: name.trim(), 
      deviceFingerprint: fingerprint 
    }));
    
    navigate(`/exam/${examId}/active`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-exam-bg text-exam-text font-mono">
      {t('loadingExam') || 'Loading exam...'}
    </div>
  );

  // Robust check for examData structure
  const hasData = examData && typeof examData === 'object' && !Array.isArray(examData) && examData.title;

  if (error || !hasData) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#0a0e1a] text-[#e2e8f0]">
      <div className="exam-card max-w-md w-full border-[#2d3a52] bg-[#1a2235] p-6 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-red-500 mb-2">{t('examNotFound') || 'Exam Not Found'}</h1>
        <p className="text-slate-400 mb-4">{t('examNotFoundDesc', { examId }) || `The exam ID "${examId}" does not exist or failed to load.`}</p>
        <button onClick={() => navigate('/')} className="exam-btn-secondary w-full border-[#2d3a52] text-[#e2e8f0] hover:bg-[#111827]">
          {t('goBack') || 'Go Back'}
        </button>
      </div>
    </div>
  );

  const { title, description, questions = [], startDate, endDate } = examData;
  const totalQuestions = Array.isArray(questions) ? questions.length : 0;
  const totalScore = Array.isArray(questions) ? questions.reduce((sum, q) => sum + (q.score || 0), 0) : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12 bg-exam-bg">
      <div className="absolute top-4 right-4 ltr:right-4 rtl:left-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-exam-accent/10 border border-exam-accent/20 text-exam-accent text-xs font-bold uppercase tracking-wider mb-2">
            {t('exam')}
          </div>
          <h1 className="text-3xl font-extrabold text-exam-text tracking-tight sm:text-4xl">
            {title}
          </h1>
          
          {examData.image && (
            <div className="relative w-full max-w-lg mx-auto aspect-video rounded-2xl overflow-hidden border border-exam-border shadow-2xl shadow-black/40 bg-exam-surface group">
              <img 
                src={examData.image} 
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => e.target.style.display = 'none'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-exam-bg/80 to-transparent opacity-60" />
            </div>
          )}

          <p className="text-exam-muted text-lg max-w-lg mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="exam-card flex items-center gap-4 py-4">
            <div className="w-12 h-12 rounded-xl bg-exam-surface flex items-center justify-center text-xl border border-exam-border">
              📝
            </div>
            <div>
              <p className="text-xl font-bold text-exam-text">{totalQuestions}</p>
              <p className="text-xs text-exam-muted uppercase font-semibold">{t('questions')}</p>
            </div>
          </div>
          <div className="exam-card flex items-center gap-4 py-4">
            <div className="w-12 h-12 rounded-xl bg-exam-surface flex items-center justify-center text-xl border border-exam-border">
              🔟
            </div>
            <div>
              <p className="text-xl font-bold text-exam-text">{totalScore}</p>
              <p className="text-xs text-exam-muted uppercase font-semibold">{t('totalPts')}</p>
            </div>
          </div>
        </div>

        <div className="exam-card space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-exam-accent text-lg">🗓️</span>
              <h2 className="font-bold text-exam-text">{t('examWindow')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-exam-surface border border-exam-border">
                <p className="text-[10px] text-exam-muted uppercase font-bold mb-1">{t('opens')}</p>
                <p className="text-sm font-mono text-exam-text">
                  {startDate ? new Date(startDate).toLocaleString() : '—'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-exam-surface border border-exam-border">
                <p className="text-[10px] text-exam-muted uppercase font-bold mb-1">{t('closes')}</p>
                <p className="text-sm font-mono text-exam-text">
                  {endDate ? new Date(endDate).toLocaleString() : '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex gap-3">
              <span className="text-2xl pt-0.5">⚠️</span>
              <div>
                <p className="font-bold text-amber-400 text-sm mb-1">{t('integrityTitle')}</p>
                <p className="text-xs text-amber-200/70 leading-relaxed">
                  {t('integrityDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label htmlFor="student-name" className="block text-sm font-bold text-exam-text mb-2">
                {t('yourFullName')}
              </label>
              <input
                id="student-name"
                type="text"
                className="exam-input"
                placeholder={t('namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isStarting}
              />
            </div>

            <button
              onClick={handleStart}
              disabled={isStarting || !name.trim()}
              className="exam-btn-primary w-full py-4 text-lg"
            >
              {isStarting ? t('starting') : t('startExam')}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-exam-muted font-mono">
          {t('idLabel', { id: examId })}
        </p>
      </div>
    </div>
  );
}
