import * as THREE from "three";
import { ISLANDS } from "../data/islands";
import { Starfield } from "./Starfield";
import { FloatingParticles } from "./Particles";
import { EnergyBridge } from "./EnergyBridge";
import { PlayerOrb } from "./PlayerOrb";
import { CameraController } from "./CameraController";
import { IslandWrapper } from "./islands/IslandWrapper";

function AuroraSky() {
  return (
    <mesh scale={[800, 800, 800]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#051320"
        side={THREE.BackSide}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

export function World() {
  return (
    <>
      <CameraController />
      <AuroraSky />
      <Starfield count={1200} />

      {/* Ambient + directional lighting */}
      <ambientLight intensity={0.3} color="#0044aa" />
      <directionalLight position={[50, 80, 30]} intensity={0.4} color="#00b7ff" />
      <pointLight position={[0, 40, -80]} intensity={2} color="#a8ff00" distance={200} />
      <fog attach="fog" args={["#051320", 60, 280]} />

      {/* Floating ambient particles */}
      <FloatingParticles count={300} radius={120} size={0.15} color="#00b7ff" speed={0.03} />
      <FloatingParticles count={150} radius={100} size={0.12} color="#a8ff00" speed={0.04} />

      {/* Energy bridges between consecutive islands */}
      {ISLANDS.slice(0, -1).map((island, i) => {
        const next = ISLANDS[i + 1];
        return (
          <EnergyBridge
            key={`bridge-${island.id}`}
            start={island.position}
            end={next.position}
            color={i % 2 === 0 ? "#00b7ff" : "#a8ff00"}
            unlocked={true}
          />
        );
      })}

      {/* All islands */}
      {ISLANDS.map((island) => (
        <IslandWrapper key={island.id} island={island} />
      ))}

      {/* Player orb */}
      <PlayerOrb />
    </>
  );
}
