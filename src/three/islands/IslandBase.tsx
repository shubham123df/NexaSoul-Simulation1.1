import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface IslandBaseProps {
  position: [number, number, number];
  color: [number, number, number];
  radius?: number;
  unlocked?: boolean;
  hovered?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function IslandBase({
  position,
  color,
  radius = 8,
  unlocked = true,
  hovered = false,
  onClick,
  children,
}: IslandBaseProps) {
  const ref = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const c = new THREE.Color(color[0], color[1], color[2]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.15;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      const baseOp = unlocked ? (hovered ? 0.5 : 0.25) : 0.05;
      mat.opacity = baseOp + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  return (
    <group ref={ref} position={position} onClick={onClick}>
      {/* Island disc */}
      <mesh receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.1, 1.2, 32]} />
        <meshStandardMaterial
          color={c}
          transparent
          opacity={unlocked ? 0.85 : 0.3}
          emissive={c}
          emissiveIntensity={unlocked ? (hovered ? 0.6 : 0.3) : 0.05}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      {/* Glow ring */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.7, 0]}>
        <ringGeometry args={[radius * 1.05, radius * 1.4, 64]} />
        <meshBasicMaterial
          color={c}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Bottom cone */}
      <mesh position={[0, -3, 0]}>
        <coneGeometry args={[radius * 0.8, 6, 32]} />
        <meshStandardMaterial color={c} transparent opacity={0.2} emissive={c} emissiveIntensity={0.1} />
      </mesh>
      {children}
    </group>
  );
}
