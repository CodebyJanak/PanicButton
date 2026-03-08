import { useEffect, useRef, useCallback } from 'react';

export default function useAutoRefresh({ enabled, intervalSeconds = 300, onRefresh }) {
  const timerRef   = useRef(null);
  const secondsRef = useRef(intervalSeconds);

  const start = useCallback(() => {
    clearInterval(timerRef.current);
    secondsRef.current = intervalSeconds;
    timerRef.current = setInterval(() => {
      secondsRef.current -= 1;
      if (secondsRef.current <= 0) {
        secondsRef.current = intervalSeconds;
        onRefresh();
      }
    }, 1000);
  }, [intervalSeconds, onRefresh]);

  useEffect(() => {
    if (enabled) { start(); }
    else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [enabled, start]);

  const getCountdown = () => secondsRef.current;
  const reset = () => { secondsRef.current = intervalSeconds; };

  return { getCountdown, reset };
}
