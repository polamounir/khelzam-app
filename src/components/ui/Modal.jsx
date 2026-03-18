// src/components/ui/Modal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info', // info | warning | success | danger
}) {
  const iconMap = {
    info: <HelpCircle className="w-10 h-10 text-blue-400" />,
    warning: <AlertTriangle className="w-10 h-10 text-amber-400" />,
    success: <ShieldCheck className="w-10 h-10 text-emerald-400" />,
    danger: <AlertTriangle className="w-10 h-10 text-red-400" />,
  };

  const buttonClass = {
    info: 'bg-blue-600 hover:bg-blue-500',
    warning: 'bg-amber-600 hover:bg-amber-500',
    success: 'bg-emerald-600 hover:bg-emerald-500',
    danger: 'bg-red-600 hover:bg-red-500',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-exam-surface border border-exam-border rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-exam-card border border-exam-border flex items-center justify-center shadow-inner">
                  {iconMap[type]}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-exam-text mb-3">{title}</h2>
              <p className="text-exam-muted leading-relaxed mb-8">{message}</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-exam-border text-exam-text font-semibold hover:bg-exam-card transition-all"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${buttonClass[type]}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="absolute top-4 end-4 p-2 text-exam-muted hover:text-exam-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
