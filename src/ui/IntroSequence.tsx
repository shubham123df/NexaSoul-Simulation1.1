import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../state/useStore";

const INTRO_LINES = [
  "Every Developer Starts Somewhere...",
  "The portal opens.",
  "Welcome to NexaSoul.",
];

export function IntroSequence() {
  const setPhase = useGameStore((s) => s.setPhase);
  const [lineIndex, setLineIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    INTRO_LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setLineIndex(i + 1), i * 1800 + 500));
    });
    timers.push(window.setTimeout(() => setShowButton(true), INTRO_LINES.length * 1800 + 500));
    timers.push(window.setTimeout(() => setPhase("exploring"), 5000));
    return () => timers.forEach(clearTimeout);
  }, [setPhase]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none no-select">
      <div className="absolute inset-0 bg-gradient-to-b from-[#051320]/80 via-transparent to-[#051320]/80" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
        <AnimatePresence mode="wait">
          {INTRO_LINES.slice(0, lineIndex + 1).map((line, i) => (
            i === lineIndex && lineIndex <= INTRO_LINES.length && (
              <motion.h1
                key={i}
                className="font-display font-bold text-3xl md:text-5xl text-white text-glow-white max-w-2xl"
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {line}
              </motion.h1>
            )
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
            <motion.div
              className="mt-4 rounded-full border border-[#00b7ff]/30 bg-white/10 px-6 py-3 text-base font-display text-white/80"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Beginning automatically in 5 seconds
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
