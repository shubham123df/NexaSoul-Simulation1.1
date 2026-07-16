import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../state/useStore";

const TRANSFORMATION_STAGES = [
  "Learner",
  "Builder",
  "Collaborator",
  "Leader",
  "Innovator",
  "Mentor",
  "Legacy",
];

export function FinalScene() {
  const phase = useGameStore((s) => s.phase);
  const resetExperience = useGameStore((s) => s.resetExperience);
  const [stage, setStage] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    if (phase !== "final") return;
    const timers: number[] = [];
    TRANSFORMATION_STAGES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStage(i + 1), i * 800 + 500));
    });
    timers.push(window.setTimeout(() => setShowFinal(true), TRANSFORMATION_STAGES.length * 800 + 500));
    timers.push(window.setTimeout(() => resetExperience(), 40000));
    return () => timers.forEach(clearTimeout);
  }, [phase, resetExperience]);

  if (phase !== "final") return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none no-select px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-[#051320]/60 via-transparent to-[#051320]/80" />

      {/* Transformation stages */}
      <div className="relative z-10 flex flex-col items-center gap-3 mb-12">
        {TRANSFORMATION_STAGES.map((s, i) => (
          <AnimatePresence key={s}>
            {i < stage && (
              <motion.div
                initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="font-display font-bold text-xl md:text-2xl"
                style={{
                  color: i === TRANSFORMATION_STAGES.length - 1 ? "#ffffff" : i < 2 ? "#00b7ff" : i < 5 ? "#a8ff00" : "#ffffff",
                  textShadow: i === TRANSFORMATION_STAGES.length - 1 ? "0 0 30px rgba(255,255,255,0.6)" : "",
                }}
              >
                {s}
                {i < TRANSFORMATION_STAGES.length - 1 && i === stage - 1 && (
                  <span className="text-white/30 ml-3">↓</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Final message */}
      <AnimatePresence>
        {showFinal && (
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white text-glow-white mb-3">
              Don't Just Learn.
            </h1>
            <h2 className="font-display font-bold text-2xl md:text-4xl gradient-text mb-3">
              Build. Connect. Conquer.
            </h2>
            <p className="font-display text-lg md:text-xl text-white/70">
              Welcome to NexaSoul.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join CTA */}
      <AnimatePresence>
        <motion.div
          className="relative z-10 mt-4 md:mt-6 glass rounded-[2rem] px-8 py-7 md:px-12 md:py-10 flex flex-col md:flex-row items-center justify-center gap-7 pointer-events-auto max-w-5xl w-full md:w-auto"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
            <p className="text-[11px] md:text-[12px] uppercase tracking-[0.45em] text-[#a8ff00] mb-3">Join the club</p>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white">NexaSoul Community</h3>
            <p className="text-base md:text-lg text-white/80 mt-2 leading-relaxed">
              Scan the code to join the next showcase, live sessions, and updates.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#00b7ff]/40 bg-[#051320]/90 p-4 md:p-6 shadow-[0_0_40px_rgba(0,183,255,0.35)]">
            <img
              src="/qr-whatsapp.png"
              alt="NexaSoul WhatsApp QR code"
              className="w-40 h-40 md:w-56 md:h-56 object-contain rounded-2xl"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
