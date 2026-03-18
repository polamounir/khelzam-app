import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ModalProvider } from './hooks/useConfirm';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import ToastContainer from './components/ui/Toast';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages for performance (Code Splitting)
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const ExamEntryPage = React.lazy(() => import('./pages/ExamEntryPage'));
const ExamPage = React.lazy(() => import('./pages/ExamPage'));
const SubmittedPage = React.lazy(() => import('./pages/SubmittedPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <BrowserRouter>
      <ModalProvider>
        <ErrorBoundary>
          <ToastContainer />
          <Suspense 
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-exam-bg">
                <LoadingSpinner />
              </div>
            }
          >
            <main>
              <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Dual input form (name + examId) */}
                <Route path="/exam" element={<ExamEntryPage />} />

                {/* Name-only form (pre-filled examId) */}
                <Route path="/exam/:examId" element={<ExamEntryPage />} />

                {/* Active exam */}
                <Route path="/exam/:examId/active" element={<ExamPage />} />

                {/* Post-submission confirmation */}
                <Route path="/exam/:examId/submitted" element={<SubmittedPage />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </Suspense>
        </ErrorBoundary>
      </ModalProvider>
    </BrowserRouter>
  );
}
