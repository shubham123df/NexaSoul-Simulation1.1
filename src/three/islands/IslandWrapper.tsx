import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { IslandData } from "../../data/islands";
import { useGameStore } from "../../state/useStore";
import { IslandBase } from "./IslandBase";
import {
  FoundationIsland,
  BuilderIsland,
  HackathonIsland,
  OpenSourceIsland,
  FullStackIsland,
  AIIsland,
  LeadershipIsland,
  NetworkIsland,
  LegacyIsland,
} from "./IslandEnvironments";

interface IslandWrapperProps {
  island: IslandData;
}

export function IslandWrapper({ island }: IslandWrapperProps) {
  const [hovered, setHovered] = useState(false);
  const unlocked = useGameStore((s) => s.unlockedIslands.has(island.id));
  const setActiveIsland = useGameStore((s) => s.setActiveIsland);
  const touch = useGameStore((s) => s.touch);
  const phase = useGameStore((s) => s.phase);

  const labelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (labelRef.current) {
      labelRef.current.lookAt(state.camera.position);
    }
  });

  const handleClick = () => {
    if (phase !== "exploring") return;
    touch();
    if (unlocked) setActiveIsland(island.id);
  };

  const envProps = { unlocked, hovered, onClick: handleClick };

  return (
    <group>
      <IslandBase
        position={island.position}
        color={island.color}
        radius={8}
        unlocked={unlocked}
        hovered={hovered}
        onClick={handleClick}
      >
        {island.id === "foundation" && <FoundationIsland {...envProps} />}
        {island.id === "builder" && <BuilderIsland {...envProps} />}
        {island.id === "hackathon" && <HackathonIsland {...envProps} />}
        {island.id === "opensource" && <OpenSourceIsland {...envProps} />}
        {island.id === "fullstack" && <FullStackIsland {...envProps} />}
        {island.id === "ai" && <AIIsland {...envProps} />}
        {island.id === "leadership" && <LeadershipIsland {...envProps} />}
        {island.id === "network" && <NetworkIsland {...envProps} />}
        {island.id === "legacy" && <LegacyIsland {...envProps} />}
      </IslandBase>

      {/* Floating label */}
      <group ref={labelRef} position={[island.position[0], island.position[1] + 12, island.position[2]]}>
        <mesh>
          <planeGeometry args={[6, 1.2]} />
          <meshBasicMaterial color={unlocked ? "#051320" : "#0a2030"} transparent opacity={0.6} />
        </mesh>
        {/* Island name as glowing bars (simplified 3D text) */}
        <mesh position={[0, 0.2, 0.01]}>
          <planeGeometry args={[5.5, 0.4]} />
          <meshBasicMaterial color={unlocked ? "#00b7ff" : "#445566"} transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, -0.25, 0.01]}>
          <planeGeometry args={[4, 0.25]} />
          <meshBasicMaterial color={unlocked ? "#a8ff00" : "#334455"} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Hover sensor */}
      <mesh
        position={[island.position[0], island.position[1] + 3, island.position[2]]}
        visible={false}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <sphereGeometry args={[10, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
