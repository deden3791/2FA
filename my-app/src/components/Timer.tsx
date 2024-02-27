import { useState, useEffect, memo } from "react";
import { ProgressBar } from "react-bootstrap";

interface TimerProps {
  stopFunction: Function;
  resetFlag?: boolean;
}

const Timer = memo(({ stopFunction, resetFlag }: TimerProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
  }, [resetFlag]);

  useEffect(() => {
    const incrementAmount = 0.5;

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + incrementAmount;

        if (newProgress >= 100) {
          stopFunction();
          return 0;
        }
        return newProgress;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [stopFunction]);

  return (
    <div className="progressBarContainer">
      <ProgressBar variant="success" now={progress} />
    </div>
  );
});

export default Timer;
