import { useState, useEffect, useCallback, memo } from "react";
import { ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface TimerProps {
  duration?: number;
  resetFlag?: boolean;
}

const PROGRESS_FINAL = 100;
const PROGRESS_INITIAL = 0;
const INCREMENT_AMOUNT = 2;
const NO_OF_INCREMENTS = (PROGRESS_FINAL - PROGRESS_INITIAL) / INCREMENT_AMOUNT;

const Timer = memo(({ resetFlag, duration=10_000 }: TimerProps) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<number>(PROGRESS_INITIAL);

  const stopFunction = useCallback(() => {
    navigate("/unauthenticated", {state: {time: "DNF - ran out of time"}});
  }, [navigate]);

  useEffect(() => {
    setProgress(0);
  }, [resetFlag]);

  useEffect(() => {
    const x: number = duration/NO_OF_INCREMENTS;

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + INCREMENT_AMOUNT;

        if (newProgress >= PROGRESS_FINAL) {
          stopFunction();
          return 0;
        }
        return newProgress;
      });
    }, x);
    return () => clearInterval(interval);
  }, [duration, stopFunction]);

  return (
    <div className="progressBarContainer">
      <ProgressBar variant="success" now={progress} />
    </div>
  );
});

export default Timer;
