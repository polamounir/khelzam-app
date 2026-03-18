import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 font-mono text-exam-accent animate-fade-in p-8">
      <div className="relative w-16 h-16">
        {/* Outer track */}
        <div className="absolute inset-0 rounded-full border-4 border-exam-accent/10"></div>
        {/* Inner spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-exam-accent border-t-transparent animate-spin"></div>
        {/* Center pulse dot */}
        <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-exam-accent animate-pulse"></div>
      </div>
      <p className="text-sm font-semibold tracking-widest uppercase opacity-80 animate-pulse">
        Loading...
      </p>
    </div>
  );
}
