import { AnimatePresence, motion } from "framer-motion";
import { useDelayedLoader } from "~/hooks/useDelayedLoader";

export function LoadIndicator() {
  const progress = useDelayedLoader();
  const isVisible = progress > 0 && progress < 100;
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scaleX: 0, originX: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="absolute z-50 top-0 left-0 !m-0 p-0 w-full h-1 bg-blue-500 rounded-3xl my-4"
        />
      )}
    </AnimatePresence>
  );
}
