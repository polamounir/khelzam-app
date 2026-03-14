// src/hooks/useExamIntegrity.js
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { recordExit, recordReturn } from '../store/integritySlice';

/**
 * useExamIntegrity
 * Monitors tab visibility and window focus/blur events.
 * Dispatches integrity events to Redux store with timestamps.
 *
 * @param {boolean} active - Only tracks when the exam is active
 */
export function useExamIntegrity(active = true) {
  const dispatch = useDispatch();
  const isActive = useRef(active);

  useEffect(() => {
    isActive.current = active;
  }, [active]);

  useEffect(() => {
    if (!active) return;

    // --- visibilitychange: tab switching or minimizing ---
    const handleVisibilityChange = () => {
      if (!isActive.current) return;
      if (document.visibilityState === 'hidden') {
        dispatch(recordExit({ type: 'tab_exit' }));
      } else {
        dispatch(recordReturn({ type: 'tab_return' }));
      }
    };

    // --- blur/focus: window losing/gaining focus ---
    const handleBlur = () => {
      if (!isActive.current) return;
      dispatch(recordExit({ type: 'window_blur' }));
    };

    const handleFocus = () => {
      if (!isActive.current) return;
      dispatch(recordReturn({ type: 'window_focus' }));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [active, dispatch]);
}
