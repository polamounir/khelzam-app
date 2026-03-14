// src/hooks/useCountdownTimer.js
import { useState, useEffect } from 'react';

/**
 * useCountdownTimer
 * Returns a live countdown to the given endDate (ISO string).
 * Returns { hours, minutes, seconds, totalSeconds, isExpired, formattedTime }
 */
export function useCountdownTimer(endDate) {
  const getRemaining = () => {
    const now = Date.now();
    const end = new Date(endDate).getTime();
    return Math.max(0, Math.floor((end - now) / 1000));
  };

  const [totalSeconds, setTotalSeconds] = useState(getRemaining);

  useEffect(() => {
    if (!endDate) return;

    const interval = setInterval(() => {
      setTotalSeconds(getRemaining());
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate]);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const isExpired = totalSeconds === 0;

  // Visual warning states
  const isWarning = totalSeconds > 0 && totalSeconds <= 300; // < 5 min
  const isDanger = totalSeconds > 0 && totalSeconds <= 60;   // < 1 min

  const pad = (n) => String(n).padStart(2, '0');
  const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return { 
    hours, 
    minutes, 
    seconds, 
    totalSeconds, 
    isExpired, 
    formattedTime, 
    timeLeft: formattedTime, // Alias for component compatibility
    isWarning,
    isDanger
  };
}
