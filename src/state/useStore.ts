import { create } from "zustand";
import type { IslandId } from "../data/islands";
import { ISLANDS } from "../data/islands";

export type Phase = "loading" | "intro" | "exploring" | "final";

interface GameState {
  phase: Phase;
  loadingProgress: number;
  currentIslandIndex: number;
  activeIslandId: IslandId | null;
  completedMissions: Record<string, boolean>;
  unlockedIslands: Set<IslandId>;
  xp: number;
  level: number;
  orbStage: "blue" | "bright" | "purple" | "golden" | "white";
  autoDemo: boolean;
  lastInteraction: number;

  setLoadingProgress: (p: number) => void;
  setPhase: (p: Phase) => void;
  setActiveIsland: (id: IslandId | null) => void;
  completeMission: (missionId: string, xp: number, islandId: IslandId) => void;
  unlockIsland: (id: IslandId) => void;
  nextIsland: () => void;
  goToIsland: (index: number) => void;
  touch: () => void;
  setAutoDemo: (v: boolean) => void;
  resetExperience: () => void;
}

const LEVEL_PER_XP = 500;

function computeOrbStage(xp: number): GameState["orbStage"] {
  if (xp >= 4000) return "white";
  if (xp >= 2500) return "golden";
  if (xp >= 1500) return "purple";
  if (xp >= 600) return "bright";
  return "blue";
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: "loading",
  loadingProgress: 0,
  currentIslandIndex: 0,
  activeIslandId: null,
  completedMissions: {},
  unlockedIslands: new Set<IslandId>(["foundation"]),
  xp: 0,
  level: 1,
  orbStage: "blue",
  autoDemo: false,
  lastInteraction: Date.now(),

  setLoadingProgress: (p) => set({ loadingProgress: p }),
  setPhase: (p) => set({ phase: p }),
  setActiveIsland: (id) => {
    if (id) {
      const idx = ISLANDS.findIndex((i) => i.id === id);
      set({ activeIslandId: id, currentIslandIndex: idx >= 0 ? idx : 0 });
    } else {
      set({ activeIslandId: null });
    }
  },
  completeMission: (missionId, xp, islandId) => {
    const state = get();
    if (state.completedMissions[missionId]) return;
    const newCompleted = { ...state.completedMissions, [missionId]: true };
    const newXp = state.xp + xp;
    const newLevel = Math.floor(newXp / LEVEL_PER_XP) + 1;
    const newUnlocked = new Set(state.unlockedIslands);
    const island = ISLANDS.find((i) => i.id === islandId);
    if (island) {
      const allDone = island.missions.every((m) => newCompleted[m.id]);
      if (allDone) {
        const next = ISLANDS[island.index + 1];
        if (next) newUnlocked.add(next.id);
      }
    }
    set({
      completedMissions: newCompleted,
      xp: newXp,
      level: newLevel,
      orbStage: computeOrbStage(newXp),
      unlockedIslands: newUnlocked,
    });
  },
  unlockIsland: (id) => {
    const newUnlocked = new Set(get().unlockedIslands);
    newUnlocked.add(id);
    set({ unlockedIslands: newUnlocked });
  },
  nextIsland: () => {
    const idx = get().currentIslandIndex;
    const next = Math.min(idx + 1, ISLANDS.length - 1);
    const newUnlocked = new Set(get().unlockedIslands);
    newUnlocked.add(ISLANDS[next].id);
    set({ currentIslandIndex: next, activeIslandId: ISLANDS[next].id, unlockedIslands: newUnlocked });
  },
  goToIsland: (index) => {
    const clamped = Math.max(0, Math.min(index, ISLANDS.length - 1));
    const newUnlocked = new Set(get().unlockedIslands);
    newUnlocked.add(ISLANDS[clamped].id);
    set({ currentIslandIndex: clamped, activeIslandId: ISLANDS[clamped].id, unlockedIslands: newUnlocked });
  },
  touch: () => set({ lastInteraction: Date.now(), autoDemo: false }),
  setAutoDemo: (v) => set({ autoDemo: v }),
  resetExperience: () =>
    set({
      phase: "loading",
      loadingProgress: 0,
      currentIslandIndex: 0,
      activeIslandId: null,
      completedMissions: {},
      unlockedIslands: new Set<IslandId>(["foundation"]),
      xp: 0,
      level: 1,
      orbStage: "blue",
      autoDemo: false,
      lastInteraction: Date.now(),
    }),
}));
