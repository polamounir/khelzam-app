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
            className="relative w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                  {iconMap[type]}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
              <p className="text-slate-400 leading-relaxed mb-8">{message}</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-800 text-slate-300 font-semibold hover:bg-slate-900 transition-all"
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
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
