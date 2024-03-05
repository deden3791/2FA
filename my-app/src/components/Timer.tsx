import { useState, useEffect, useCallback, memo } from "react";
import { ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface TimerProps {
  resetFlag?: boolean;
}

const Timer = memo(({ resetFlag }: TimerProps) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const stopFunction = useCallback(() => {
    navigate("/unauthenticated");
  }, [navigate]);

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
