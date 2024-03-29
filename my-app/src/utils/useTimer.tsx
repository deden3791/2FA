import { useState, useRef, useCallback } from "react";

export function useTimer() {
  const startTimeRef = useRef<number | null>(null);
  const [isTimerOn, setIsTimerOn] = useState<boolean>(false);
  const [countdownDuration, setCountdownDuration] = useState<number>(10_000);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const updateCountdownDuration = (value: number) => {
    setCountdownDuration(value);
  };

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
  }, []);

  const stopTimer = useCallback(() => {
    if (startTimeRef.current !== null) {
      const endTime = Date.now();
      const elapsed = endTime - (startTimeRef.current as number);
      setElapsedTime(elapsed);

      startTimeRef.current = null;
      return elapsed
    }
  }, []);

  return { 
    startTimer, stopTimer, 
    isTimerOn, setIsTimerOn,
    countdownDuration, updateCountdownDuration 
  };
}
