import { useState, useEffect, memo } from "react";
import { ProgressBar } from "react-bootstrap";

interface TimerProps {
  stopFunction: Function;
}

const Timer = memo(({ stopFunction }: TimerProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log("timer")
    const incrementAmount = 5;

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + incrementAmount;

        if (newProgress >= 100) {
          stopFunction();
          return 0;
        }
        return newProgress;
      });
    }, 1000); // Update every 1000 milliseconds (1 second)
    return () => clearInterval(interval);
  }, [stopFunction]);

  return (
    <div className="progressBarContainer">
      <ProgressBar variant="success" now={progress} />
    </div>
  );
});

export default Timer;
