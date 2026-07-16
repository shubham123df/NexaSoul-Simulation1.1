import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface EnergyBridgeProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  unlocked?: boolean;
}

export function EnergyBridge({ start, end, color = "#00b7ff", unlocked = true }: EnergyBridgeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flowRef = useRef<THREE.Mesh>(null);

  const { curve } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
    mid.y += 6 + s.distanceTo(e) * 0.15;
    const c = new THREE.CatmullRomCurve3([s, mid, e]);
    return { curve: c, length: c.getLength() };
  }, [start, end]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.12, 8, false);
  }, [curve]);

  useFrame((state) => {
    if (flowRef.current) {
      const t = (state.clock.elapsedTime * 0.3) % 1;
      const pos = curve.getPointAt(t);
      flowRef.current.position.copy(pos);
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      flowRef.current.scale.setScalar(scale);
    }
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={unlocked ? 0.35 : 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {unlocked && (
        <mesh ref={flowRef}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
