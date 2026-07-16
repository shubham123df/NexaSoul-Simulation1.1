import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { World } from "./three/World";
import { LoadingScreen } from "./ui/LoadingScreen";
import { IntroSequence } from "./ui/IntroSequence";
import { HUD } from "./ui/HUD";
import { FinalScene } from "./ui/FinalScene";
import { useGameStore } from "./state/useStore";
import { ISLANDS } from "./data/islands";

function FinalSceneTrigger() {
  const completedMissions = useGameStore((s) => s.completedMissions);
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const lastInteraction = useGameStore((s) => s.lastInteraction);

  useEffect(() => {
    if (phase !== "exploring") return;

    const totalMissions = ISLANDS.reduce((sum, i) => sum + i.missions.length, 0);
    const completed = Object.keys(completedMissions).length;

    if (completed >= totalMissions) {
      const timer = window.setTimeout(() => setPhase("final"), 2000);
      return () => window.clearTimeout(timer);
    }

    const idleTimer = window.setTimeout(() => {
      setPhase("final");
    }, 35000);

    return () => window.clearTimeout(idleTimer);
  }, [completedMissions, lastInteraction, phase, setPhase]);

  return null;
}

function App() {
  const phase = useGameStore((s) => s.phase);
  const touch = useGameStore((s) => s.touch);

  useEffect(() => {
    const handler = () => touch();
    window.addEventListener("pointermove", handler);
    window.addEventListener("click", handler);
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("pointermove", handler);
      window.removeEventListener("click", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [touch]);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#051320]">
      {/* 3D Canvas — always mounted so the world is alive behind UI */}
      <Canvas
        camera={{ position: [0, 3, 50], fov: 60, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        style={{ position: "absolute", inset: 0 }}
      >
        <Suspense fallback={null}>
          <World />
          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette darkness={0.4} offset={0.3} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* UI Layers */}
      {phase === "loading" && <LoadingScreen />}
      {phase === "intro" && <IntroSequence />}
      {phase === "exploring" && <HUD />}
      {phase === "final" && <FinalScene />}

      <FinalSceneTrigger />
    </div>
  );
}

export default App;
