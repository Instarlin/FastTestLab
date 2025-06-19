import { useNavigation } from "react-router";
import { useEffect, useRef, useState } from "react";

const PROGRESS_MAX = 90;
const PROGRESS_STEP = 2;
const INTERVAL_MS = 100;
const RESET_DELAY_MS = 500;

export function useDelayedLoader() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (navigation.state !== "idle") {
      clearTimers();
      setProgress(0);

      intervalRef.current = window.setInterval(() => {
        setProgress((prev) => (prev < PROGRESS_MAX ? prev + PROGRESS_STEP : prev));
      }, INTERVAL_MS);
    } else {
      clearTimers();
      setProgress(100);

      timeoutRef.current = window.setTimeout(() => setProgress(0), RESET_DELAY_MS);
    }

    return clearTimers;
  }, [navigation.state]);

  return progress;
}
