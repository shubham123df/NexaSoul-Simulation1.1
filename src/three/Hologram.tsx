import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HologramProps {
  position?: [number, number, number];
  color?: string;
  scale?: number;
  speed?: number;
  children?: React.ReactNode;
}

export function Hologram({ position = [0, 0, 0], color = "#00b7ff", scale = 1, speed = 1, children }: HologramProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {children}
      <mesh>
        <ringGeometry args={[0.9, 1.0, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function HoloText({ text, position = [0, 0, 0], color = "#00b7ff", size = 0.3 }: {
  text: string;
  position?: [number, number, number];
  color?: string;
  size?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
    }
  });
  return (
    <group ref={ref} position={position}>
      {text.split("").map((_ch, i) => (
        <mesh key={i} position={[i * size * 0.6 - (text.length * size * 0.6) / 2, 0, 0]}>
          <boxGeometry args={[size * 0.4, size * 0.6, size * 0.05]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
