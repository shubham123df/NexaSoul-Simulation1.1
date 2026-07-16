import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../state/useStore";

export function LoadingScreen() {
  const loadingProgress = useGameStore((s) => s.loadingProgress);
  const setLoadingProgress = useGameStore((s) => s.setLoadingProgress);
  const setPhase = useGameStore((s) => s.setPhase);
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number; color: string }[]>([]);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Generate particles for logo assembly
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      delay: Math.random() * 1.5,
      color: i < 30 ? "#00b7ff" : "#a8ff00",
    }));
    setParticles(newParticles);

    // Simulate loading progress
    let progress = 0;
    const interval = window.setInterval(() => {
      progress += Math.random() * 8 + 2;
      if (progress >= 100) {
        progress = 100;
        window.clearInterval(interval);
        window.setTimeout(() => setShowText(true), 600);
        window.setTimeout(() => setPhase("intro"), 2400);
      }
      setLoadingProgress(Math.min(progress, 100));
    }, 80);

    return () => {
      window.clearInterval(interval);
    };
  }, [setLoadingProgress, setPhase]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#051320] overflow-hidden no-select">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#051320] via-[#0a2540] to-[#051320]" />

      {/* Radial glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,183,255,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Assembling particles */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-[280px] h-[120px] flex items-center justify-center">
          {/* Logo icon - circular */}
          <motion.div
            className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-[#00b7ff]"
            initial={{ rotate: 0, opacity: 0, scale: 0 }}
            animate={{ rotate: 360, opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ boxShadow: "0 0 30px rgba(0,183,255,0.6)" }}
          >
            <div className="absolute inset-2 rounded-full border border-[#a8ff00] opacity-60" />
          </motion.div>

          {/* NEX text */}
          <motion.div
            className="absolute left-16 top-1/2 -translate-y-1/2 font-display font-bold text-4xl tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{ color: "#00b7ff", textShadow: "0 0 20px rgba(0,183,255,0.6)" }}
          >
            NEX
          </motion.div>

          {/* SOUL text */}
          <motion.div
            className="absolute left-[150px] top-1/2 -translate-y-1/2 font-display font-bold text-4xl tracking-tight"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            style={{ color: "#a8ff00", textShadow: "0 0 20px rgba(168,255,0,0.6)" }}
          >
            SOUL
          </motion.div>

          {/* Flying particles */}
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ backgroundColor: p.color, left: "50%", top: "50%" }}
              initial={{ x: p.x, y: p.y, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: [0, 1, 0] }}
              transition={{ delay: p.delay, duration: 1.5, ease: "easeOut" }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-64 h-1 rounded-full bg-[#0a2540] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #00b7ff, #a8ff00)",
              boxShadow: "0 0 10px rgba(0,183,255,0.5)",
            }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        <AnimatePresence>
          {showText && (
            <motion.p
              className="mt-6 font-display text-sm tracking-widest text-white/70"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              ENTERING THE NEXASOUL UNIVERSE
            </motion.p>
          )}
        </AnimatePresence>

        {!showText && (
          <p className="mt-6 font-display text-sm tracking-widest text-white/40">
            {Math.round(loadingProgress)}%
          </p>
        )}
      </div>
    </div>
  );
}
