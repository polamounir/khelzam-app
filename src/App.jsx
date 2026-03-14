// src/App.jsx
import React from 'react';
import { ModalProvider } from './hooks/useConfirm';
import ToastContainer from './components/ui/Toast';
import ExamEntryPage from './pages/ExamEntryPage';
import ExamPage from './pages/ExamPage';
import SubmittedPage from './pages/SubmittedPage';
import NotFoundPage from './pages/NotFoundPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <ModalProvider>
        <ToastContainer />
        <Routes>
        {/* Default: redirect to a demo exam */}
        <Route path="/" element={<Navigate to="/exam" replace />} />

        {/* Exam entry (name + fingerprint gate) */}
        <Route path="/exam/:examId" element={<ExamEntryPage />} />

        {/* Active exam */}
        <Route path="/exam/:examId/active" element={<ExamPage />} />

        {/* Post-submission confirmation */}
        <Route path="/exam/:examId/submitted" element={<SubmittedPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </ModalProvider>
    </BrowserRouter>
  );
}
