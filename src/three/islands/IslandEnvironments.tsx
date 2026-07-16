import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Hologram } from "../Hologram";

// Shared animated building component
function NeonBuilding({
  position,
  height,
  color,
  width = 1,
  delay = 0,
}: {
  position: [number, number, number];
  height: number;
  color: string;
  width?: number;
  delay?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    ref.current.scale.y = height * (0.95 + Math.sin(t * 1.2) * 0.05);
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.3 + Math.sin(t * 2) * 0.15;
  });
  return (
    <mesh ref={ref} position={[position[0], position[1] + height / 2, position[2]]}>
      <boxGeometry args={[width, height, width]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.7}
        metalness={0.6}
        roughness={0.2}
      />
    </mesh>
  );
}

function FloatingDrone({ radius, speed, color, y = 4 }: { radius: number; speed: number; color: string; y?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.set(Math.cos(t) * radius, y + Math.sin(t * 2) * 0.5, Math.sin(t) * radius);
    ref.current.rotation.y = t + Math.PI / 2;
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <pointLight color={color} intensity={1} distance={5} />
    </group>
  );
}

// ===== ISLAND 1: FOUNDATION VALLEY =====
export function FoundationIsland(_props: { unlocked: boolean; hovered: boolean; onClick: () => void }) {
  return (
    <group>
      {/* Holographic books */}
      <Hologram position={[-3, 2, 2]} color="#00b7ff" speed={0.5}>
        <boxGeometry args={[1.2, 0.15, 0.9]} />
        <meshBasicMaterial color="#00b7ff" transparent opacity={0.5} />
      </Hologram>
      <Hologram position={[3, 2.5, -1]} color="#00b7ff" speed={0.7}>
        <boxGeometry args={[1, 0.15, 0.8]} />
        <meshBasicMaterial color="#00b7ff" transparent opacity={0.5} />
      </Hologram>
      {/* HTML cube */}
      <mesh position={[0, 3, 0]} rotation={[0.3, 0.5, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#00b7ff" emissive="#00b7ff" emissiveIntensity={0.4} transparent opacity={0.6} metalness={0.5} />
      </mesh>
      {/* CSS crystal */}
      <mesh position={[-2.5, 3, -2]} rotation={[0.4, 0, 0.2]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#5fd4ff" emissive="#00b7ff" emissiveIntensity={0.5} transparent opacity={0.6} metalness={0.6} />
      </mesh>
      {/* JS lightning */}
      <mesh position={[2.5, 4, 1.5]}>
        <cylinderGeometry args={[0.05, 0.3, 2, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
      <FloatingDrone radius={5} speed={0.5} color="#00b7ff" y={5} />
    </group>
  );
}

// ===== ISLAND 2: BUILDER CITY =====
export function BuilderIsland(_props: { unlocked: boolean; hovered: boolean; onClick: () => void }) {
  const buildings = [
    { pos: [-2, 0, 1] as [number, number, number], h: 3, c: "#00b7ff" },
    { pos: [0, 0, -1] as [number, number, number], h: 4, c: "#5fd4ff" },
    { pos: [2, 0, 1] as [number, number, number], h: 2.5, c: "#8ee000" },
    { pos: [-1, 0, -2.5] as [number, number, number], h: 3.5, c: "#00b7ff" },
    { pos: [1.5, 0, -2] as [number, number, number], h: 5, c: "#a8ff00" },
  ];
  return (
    <group>
      {buildings.map((b, i) => (
        <NeonBuilding key={i} position={b.pos} height={b.h} color={b.c} width={0.8} delay={i * 0.5} />
      ))}
      <FloatingDrone radius={6} speed={0.4} color="#a8ff00" y={6} />
      <FloatingDrone radius={4} speed={0.6} color="#00b7ff" y={7} />
    </group>
  );
}

// ===== ISLAND 3: HACKATHON ARENA =====
export function HackathonIsland(_props: { unlocked: boolean; hovered: boolean; onClick: () => void }) {
  const timerRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (timerRef.current) {
      timerRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });
  return (
    <group>
      {/* Stadium ring */}
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4, 5.5, 32]} />
        <meshBasicMaterial color="#9b6bff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Countdown timer */}
      <mesh ref={timerRef} position={[0, 5, 0]}>
        <torusGeometry args={[1.5, 0.1, 8, 32]} />
        <meshBasicMaterial color="#9b6bff" transparent opacity={0.7} />
      </mesh>
      {/* Trophy */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1.5, 8]} />
        <meshStandardMaterial color="#ffd24a" emissive="#ffd24a" emissiveIntensity={0.5} metalness={0.8} roughness={0.1} />
      </mesh>
      <FloatingDrone radius={5} speed={0.8} color="#9b6bff" y={6} />
      <FloatingDrone radius={4} speed={1.0} color="#00b7ff" y={5} />
    </group>
  );
}

// ===== ISLAND 4: OPEN SOURCE PLANET =====
export function OpenSourceIsland(_props: { unlocked: boolean; hovered: boolean; onClick: () => void }) {
  const orbitRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      orbitRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });
  const repos = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return { x: Math.cos(angle) * 3, y: Math.sin(angle * 2) * 1.5, z: Math.sin(angle) * 3 };
  });
  return (
    <group>
      {/* Central galaxy core */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#00b7ff" transparent opacity={0.5} />
      </mesh>
      <pointLight position={[0, 3, 0]} color="#00b7ff" intensity={3} distance={15} />
      {/* Orbiting repositories */}
      <group ref={orbitRef}>
        {repos.map((r, i) => (
          <mesh key={i} position={[r.x, r.y + 3, r.z]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>
      <FloatingDrone radius={6} speed={0.5} color="#00d4ff" y={7} />
    </group>
  );
}

// ===== ISLAND 5: FULL STACK CITY =====
export function FullStackIsland(_props: { unlocked: boolean; hovered: boolean; onClick: () => void }) {
  return (
    <group>
      {/* Node.js tower */}
      <NeonBuilding position={[0, 0, 0]} height={6} color="#00b7ff" width={1.2} />
      {/* Express highway */}
      <mesh position={[0, 0.1, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 1]} />
        <meshBasicMaterial color="#00b7ff" transparent opacity={0.3} />
      </mesh>
      {/* MongoDB vault */}
      <mesh position={[-3, 1.5, -2]}>
        <cylinderGeometry args={[1, 1.2, 3, 16]} />
        <meshStandardMaterial color="#8ee000" emissive="#8ee000" emissiveIntensity={0.3} transparent opacity={0.7} metalness={0.5} />
      </mesh>
      {/* Deployment rocket */}
      <mesh position={[3, 4, 1]} rotation={[0.3, 0, -0.4]}>
        <coneGeometry args={[0.3, 1.5, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#00b7ff" emissiveIntensity={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[3, 3, 1]}>
        <coneGeometry args={[0.15, 0.5, 8]} />
        <meshBasicMaterial color="#a8ff00" transparent opacity={0.6} />
      </mesh>
      <FloatingDrone radius={5} speed={0.5} color="#00b7ff" y={7} />
    </group>
  );
}

// ===== ISLAND 6: AI RESEARCH LAB =====
export function AIIsland(_props: { unlocked: boolean; hovered: boolean; onClick: () => void }) {
  const brainRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      brainRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05);
    }
  });
  return (
    <group>
      {/* AI brain */}
      <mesh ref={brainRef} position={[0, 3.5, 0]}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshStandardMaterial color="#00b7ff" emissive="#a8ff00" emissiveIntensity={0.4} wireframe transparent opacity={0.6} />
      </mesh>
      {/* Inner core */}
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#a8ff00" transparent opacity={0.4} />
      </mesh>
      <pointLight position={[0, 3.5, 0]} color="#a8ff00" intensity={2} distance={10} />
      {/* Terminals */}
      {[-2.5, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 2, -2]} rotation={[0, i === 0 ? 0.3 : -0.3, 0]}>
          <boxGeometry args={[1, 0.8, 0.1]} />
          <meshStandardMaterial color="#00b7ff" emissive="#00b7ff" emissiveIntensity={0.3} transparent opacity={0.5} />
        </mesh>
      ))}
      <FloatingDrone radius={5} speed={0.6} color="#a8ff00" y={6} />
    </group>
  );
}

// ===== ISLAND 7: LEADERSHIP TOWER =====
export function LeadershipIsland(_props: { unlocked: boolean; hovered: boolean; onClick: () => void }) {
  const floors = 7;
  return (
    <group>
      {Array.from({ length: floors }).map((_, i) => (
        <mesh key={i} position={[0, 1 + i * 1.2, 0]}>
          <cylinderGeometry args={[1.5 - i * 0.1, 1.6 - i * 0.1, 0.8, 16]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#ffd24a" : "#8ee000"}
            emissive={i % 2 === 0 ? "#ffd24a" : "#8ee000"}
            emissiveIntensity={0.3 + (i / floors) * 0.3}
            transparent
            opacity={0.7}
            metalness={0.5}
          />
        </mesh>
      ))}
      {/* Crown */}
      <mesh position={[0, 1 + floors * 1.2 + 0.5, 0]}>
        <coneGeometry args={[0.8, 1.5, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffd24a" emissiveIntensity={0.6} metalness={0.8} />
      </mesh>
      <pointLight position={[0, 8, 0]} color="#ffd24a" intensity={2} distance={15} />
    </group>
  );
}

// ===== ISLAND 8: NATIONAL NETWORK =====
export function NetworkIsland(_props: { unlocked: boolean; hovered: boolean; onClick: () => void }) {
  const linesRef = useRef<THREE.Group>(null);
  const nodes = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        x: (Math.random() - 0.5) * 6,
        y: Math.random() * 2 + 1,
        z: (Math.random() - 0.5) * 6,
      })),
    [],
  );
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.15;
      });
    }
  });
  return (
    <group>
      {nodes.map((n, i) => (
        <mesh key={i} position={[n.x, n.y, n.z]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#00b7ff" transparent opacity={0.8} />
        </mesh>
      ))}
      <group ref={linesRef}>
        {nodes.map((n, i) =>
          nodes.slice(i + 1).map((m, j) => {
            if (Math.random() > 0.3) return null;
            const dist = Math.sqrt((n.x - m.x) ** 2 + (n.y - m.y) ** 2 + (n.z - m.z) ** 2);
            if (dist > 4) return null;
            const mid = [(n.x + m.x) / 2, (n.y + m.y) / 2, (n.z + m.z) / 2] as [number, number, number];
            const dir = new THREE.Vector3(m.x - n.x, m.y - n.y, m.z - n.z);
            const len = dir.length();
            return (
              <mesh key={`${i}-${j}`} position={mid} scale={[1, 1, len]}>
                <boxGeometry args={[0.03, 0.03, 1]} />
                <meshBasicMaterial color="#a8ff00" transparent opacity={0.3} />
              </mesh>
            );
          }),
        )}
      </group>
      <pointLight position={[0, 3, 0]} color="#00b7ff" intensity={2} distance={12} />
    </group>
  );
}

// ===== ISLAND 9: LEGACY CITADEL =====
export function LegacyIsland(_props: { unlocked: boolean; hovered: boolean; onClick: () => void }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  return (
    <group>
      <group ref={ref}>
        {/* Central citadel */}
        <mesh position={[0, 4, 0]}>
          <cylinderGeometry args={[2.5, 3.5, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#00b7ff" emissiveIntensity={0.3} transparent opacity={0.5} metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Spires */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 3, 5, Math.sin(angle) * 3]}>
              <coneGeometry args={[0.5, 3, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#a8ff00" emissiveIntensity={0.4} metalness={0.8} />
            </mesh>
          );
        })}
        {/* Top beacon */}
        <mesh position={[0, 10, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </group>
      <pointLight position={[0, 10, 0]} color="#ffffff" intensity={3} distance={20} />
      <pointLight position={[0, 4, 0]} color="#00b7ff" intensity={2} distance={15} />
    </group>
  );
}


