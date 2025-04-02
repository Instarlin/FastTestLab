import { useNavigation } from "react-router";
import { useEffect, useRef, useState } from "react";

export function useDelayedLoader() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (navigation.state !== "idle") {
      setProgress(0);
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + 1 + Math.random() * 2;
          return prev;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);

      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);

      return () => clearTimeout(timeout);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [navigation.state]);

  return progress;
}
