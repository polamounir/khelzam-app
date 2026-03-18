import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setAnswer, toggleFlag } from '../store/examSlice';
import { useState } from 'react';

export default function QuestionRenderer({ question, index }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const answers = useSelector((s) => s.exam.answers);
  const flaggedQuestions = useSelector((s) => s.exam.flaggedQuestions);
  
  // Safety check
  if (!question) return null;

  const { id, type, text, options, score } = question;
  const currentAnswer = answers[id];
  const isFlagged = flaggedQuestions.includes(id);

  
  const typeLabels = {
    mcq: t('mcq'),
    truefalse: t('trueFalse'),
    multiselect: t('multiSelect'),
    multichoice: t('multiSelect'),
  };

  const isAnswered = currentAnswer !== undefined && 
                     currentAnswer !== '' && 
                     !(Array.isArray(currentAnswer) && currentAnswer.length === 0);

  const handleOptionChange = (opt) => {
    const normalizedType = (type || 'mcq').toLowerCase();
    if (normalizedType === 'multiselect' || normalizedType === 'multichoice') {
      const prev = Array.isArray(currentAnswer) ? currentAnswer : [];
      const next = prev.includes(opt) 
        ? prev.filter(a => a !== opt) 
        : [...prev, opt];
      dispatch(setAnswer({ questionId: id, answer: next }));
    } else {
      dispatch(setAnswer({ questionId: id, answer: opt }));
    }
  };

  return (
    <div 
      className="exam-card animate-slide-up" 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-exam-accent/10 border border-exam-accent/20 text-exam-accent text-sm font-bold">
            {index + 1}
          </span>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-exam-muted block">
              {typeLabels[(type || 'mcq').toLowerCase()] || t('mcq')}
            </span>
            {/* The Question Prompt */}
            <h3 className="text-xl font-bold text-exam-text leading-tight block">
              {text || "--- Missing Question Text ---"}
            </h3>
            
            {question.image && !imageError && (
              <div className="mt-4 overflow-hidden rounded-xl border border-exam-border bg-black/20">
                <img 
                  src={question.image} 
                  alt={t('questionAlt', { num: index + 1 })}
                  className="w-full h-auto object-cover max-h-[400px] hover:scale-[1.02] transition-transform duration-500"
                  onError={() => setImageError(true)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <button 
            onClick={() => dispatch(toggleFlag(id))}
            className={`p-2 rounded-lg border transition-all ${
              isFlagged 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-500' 
                : 'bg-exam-surface border-exam-border text-exam-muted hover:text-exam-text'
            }`}
            title={t('flagQuestion') || 'Flag for review'}
          >
            {isFlagged ? '🚩' : '🏳️'}
          </button>
          <span className="px-2 py-1 rounded-md bg-exam-surface border border-exam-border text-[10px] font-bold text-exam-muted uppercase">
            {t(score === 1 ? 'pts' : 'ptsPlural', { count: score })}
          </span>
        </div>
      </div>
 
      <div className="space-y-3">
        {options && options.length > 0 ? (
          options.map((opt, i) => {
            const normalizedType = (type || 'mcq').toLowerCase();
            const isMulti = normalizedType === 'multiselect' || normalizedType === 'multichoice';
            const isSelected = isMulti 
              ? Array.isArray(currentAnswer) && currentAnswer.includes(opt)
              : currentAnswer === opt;

            return (
              <label
                key={i}
                className={`option-${isMulti ? 'checkbox' : 'radio'} ${isSelected ? 'selected' : ''}`}
              >
                <input
                  type={isMulti ? 'checkbox' : 'radio'}
                  name={`q-${id}`}
                  checked={isSelected}
                  onChange={() => handleOptionChange(opt)}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected ? 'border-exam-accent bg-exam-accent' : 'border-exam-border'
                }`}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                  )}
                </div>
                <span className={`text-base transition-colors ${isSelected ? 'text-exam-text font-semibold' : 'text-exam-muted'}`}>
                  {opt}
                </span>
              </label>
            );
          })
        ) : (
          <p className="text-exam-danger text-sm">{t('noOptions')}</p>
        )}
      </div>
      
      <div className="mt-6 flex items-center gap-2 pt-4 border-t border-exam-border/30">
        <span className={`w-2 h-2 rounded-full transition-colors ${isAnswered ? 'bg-exam-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-exam-surface border border-exam-border'}`}></span>
        <span className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${isAnswered ? 'text-exam-success' : 'text-exam-muted'}`}>
          {isAnswered ? t('answered') : t('answered_label')}
        </span>
      </div>
    </div>
  );
}
