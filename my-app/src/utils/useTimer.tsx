import { useState, useRef, useCallback } from 'react';


export function useTimer() {
  const startTimeRef = useRef<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const startTimer = useCallback(() => {
    if (startTimeRef.current === null) { // Prevent restarting if already started
      startTimeRef.current = Date.now();
    }
  }, []);


  const stopTimer = useCallback(() => {
    if (startTimeRef.current !== null) {
      const endTime = Date.now();
      const elapsed = endTime - (startTimeRef.current as number);
      setElapsedTime(elapsed);
      
      startTimeRef.current = null;
      console.log(`Elapsed time: ${elapsed}ms`);
    }
  }, []);

  return { startTimer, stopTimer };
}
