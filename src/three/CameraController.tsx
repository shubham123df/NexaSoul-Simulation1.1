import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "../state/useStore";
import { ISLANDS } from "../data/islands";

export function CameraController() {
  const { camera, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 8, 30));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));
  const mouseInfluence = useRef(new THREE.Vector2(0, 0));
  const demoIndex = useRef(0);
  const demoTimer = useRef(0);

  const phase = useGameStore((s) => s.phase);
  const currentIslandIndex = useGameStore((s) => s.currentIslandIndex);
  const autoDemo = useGameStore((s) => s.autoDemo);
  const lastInteraction = useGameStore((s) => s.lastInteraction);
  const setAutoDemo = useGameStore((s) => s.setAutoDemo);
  const goToIsland = useGameStore((s) => s.goToIsland);

  useEffect(() => {
    if (phase === "intro") {
      targetPos.current.set(0, 6, 40);
      targetLook.current.set(0, 2, 0);
    }
  }, [phase]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Auto-demo trigger after 10s idle
    if (phase === "exploring" && !autoDemo && Date.now() - lastInteraction > 10000) {
      setAutoDemo(true);
    }

    if (phase === "loading") {
      camera.position.lerp(new THREE.Vector3(0, 3, 50), delta * 0.5);
      currentLook.current.lerp(new THREE.Vector3(0, 2, 0), delta);
      camera.lookAt(currentLook.current);
      return;
    }

    if (phase === "intro") {
      // Slow forward push through the portal
      const introT = Math.min(t * 0.15, 1);
      camera.position.lerp(new THREE.Vector3(0, 6 - introT * 2, 40 - introT * 10), delta * 0.8);
      targetLook.current.set(0, 2, 0);
      currentLook.current.lerp(targetLook.current, delta * 2);
      camera.lookAt(currentLook.current);
      return;
    }

    if (phase === "final") {
      const finalPos = new THREE.Vector3(0, 45, -90);
      camera.position.lerp(finalPos, delta * 0.6);
      currentLook.current.lerp(new THREE.Vector3(0, 20, -140), delta * 1.5);
      camera.lookAt(currentLook.current);
      return;
    }

    // Exploring phase
    let islandIdx = currentIslandIndex;
    let isDemo = autoDemo;

    if (isDemo) {
      demoTimer.current += delta;
      if (demoTimer.current > 6) {
        demoTimer.current = 0;
        demoIndex.current = (demoIndex.current + 1) % ISLANDS.length;
        goToIsland(demoIndex.current);
      }
      islandIdx = demoIndex.current;
    }

    const island = ISLANDS[islandIdx];
    const [ix, iy, iz] = island.position;

    // Offset camera relative to island
    const baseOffset = new THREE.Vector3(0, 10, 28);
    // Slight orbit
    const orbit = isDemo ? t * 0.08 : 0;
    const ox = Math.sin(orbit) * 6;
    const oz = Math.cos(orbit) * 6;

    targetPos.current.set(ix + ox + baseOffset.x, iy + baseOffset.y, iz + oz + baseOffset.z);
    targetLook.current.set(ix, iy + 1, iz);

    // Mouse parallax
    mouseInfluence.current.x += (pointer.x * 2 - mouseInfluence.current.x) * delta * 2;
    mouseInfluence.current.y += (pointer.y * 1 - mouseInfluence.current.y) * delta * 2;

    const desiredPos = targetPos.current.clone();
    desiredPos.x += mouseInfluence.current.x * 2;
    desiredPos.y += mouseInfluence.current.y * 1.5;

    camera.position.lerp(desiredPos, delta * 1.2);
    currentLook.current.lerp(targetLook.current, delta * 2.5);
    camera.lookAt(currentLook.current);
  });

  return null;
}
