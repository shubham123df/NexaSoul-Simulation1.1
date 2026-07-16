import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "../state/useStore";

const STAGE_COLORS: Record<string, string> = {
  blue: "#00b7ff",
  bright: "#5fd4ff",
  purple: "#9b6bff",
  golden: "#ffd24a",
  white: "#ffffff",
};

export function PlayerOrb() {
  const ref = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const orbStage = useGameStore((s) => s.orbStage);
  const phase = useGameStore((s) => s.phase);

  const color = STAGE_COLORS[orbStage];

  const trailPositions = useMemo(() => new Float32Array(60 * 3), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = 2 + Math.sin(t * 0.8) * 0.4;
    ref.current.position.x = Math.sin(t * 0.5) * 0.6;
    ref.current.rotation.y = t * 0.5;

    if (coreRef.current) {
      const s = 1 + Math.sin(t * 2) * 0.08;
      coreRef.current.scale.setScalar(s);
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(t * 1.5) * 0.15;
      glowRef.current.scale.setScalar(s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.2 + Math.sin(t * 1.5) * 0.05;
    }
  });

  if (phase === "loading") return null;

  return (
    <group ref={ref} position={[0, 2, 0]}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      <mesh ref={glowRef} scale={2.5}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight color={color} intensity={2} distance={12} />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[trailPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.1} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
}
