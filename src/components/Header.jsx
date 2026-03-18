import React from 'react';
import { Link } from 'react-router-dom';
import SettingsMenu from './SettingsMenu';

export default function Header({ children }) {
  return (
    <header className="fixed top-0 inset-x-0 z-[100] bg-exam-bg/95 backdrop-blur-md border-b border-exam-border/40">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
          <Link 
            to="/" 
            className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-exam-accent to-exam-accent-hover flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-exam-accent/30">
              K
            </div>
            <span className="text-xl font-extrabold tracking-tight text-exam-text hidden lg:block">
              Khelzam
            </span>
          </Link>

          {children}
        </div>
        
        <div className="flex items-center flex-shrink-0 ms-4">
          <SettingsMenu />
        </div>
      </div>
    </header>
  );
}
