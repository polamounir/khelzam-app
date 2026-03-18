import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 bg-exam-bg overflow-hidden relative pt-20">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] start-[-10%] w-[40%] h-[40%] bg-exam-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl space-y-12 animate-fade-in relative z-10">
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-exam-accent/10 border border-exam-accent/20 text-exam-accent text-sm font-bold uppercase tracking-widest mb-4">
            {t('welcomeTo') || 'Welcome to'} Khelzam
          </div>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-indigo-950 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-500">
            {t('landingTitle') || 'Professional Exam Experience'}
          </h1>
          <p className="text-exam-muted text-xl max-w-2xl mx-auto leading-relaxed">
            {t('landingDesc') || 'A secure, high-integrity platform for modern educational assessments. Experience seamless testing with real-time monitoring and comprehensive review features.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="exam-card border-exam-border/50 hover:border-exam-accent/50 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-2xl bg-exam-accent/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🔒
            </div>
            <h3 className="text-xl font-bold text-exam-text mb-2">{t('secureTitle') || 'Secure'}</h3>
            <p className="text-sm text-exam-muted leading-relaxed">
              {t('secureDesc') || 'Advanced integrity monitoring and device fingerprinting to ensure fair testing.'}
            </p>
          </div>
          <div className="exam-card border-exam-border/50 hover:border-exam-accent/50 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-2xl bg-exam-accent/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="text-xl font-bold text-exam-text mb-2">{t('analyticsTitle') || 'Analytics'}</h3>
            <p className="text-sm text-exam-muted leading-relaxed">
              {t('analyticsDesc') || 'Detailed insights and real-time progress tracking for both students and admins.'}
            </p>
          </div>
          <div className="exam-card border-exam-border/50 hover:border-exam-accent/50 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-2xl bg-exam-accent/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🏁
            </div>
            <h3 className="text-xl font-bold text-exam-text mb-2">{t('easyTitle') || 'Simple'}</h3>
            <p className="text-sm text-exam-muted leading-relaxed">
              {t('easyDesc') || 'Intuitive interface designed for a focused and distraction-free examination flow.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button 
            onClick={() => navigate('/exam')} 
            className="exam-btn-primary w-full sm:w-auto px-12 py-5 text-xl"
          >
            {t('getStarted') || 'Get Started'}
          </button>
          <button className="exam-btn-secondary w-full sm:w-auto px-12 py-5 text-xl">
            {t('learnMore') || 'Learn More'}
          </button>
        </div>
      </div>

      <footer className="absolute bottom-8 w-full text-center text-exam-muted text-sm font-medium tracking-wide">
        &copy; 2026 John Mounir. {t('allRightsReserved') || 'All Rights Reserved.'}
      </footer>
    </div>
    </>
  );
}
