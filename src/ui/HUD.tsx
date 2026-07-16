import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../state/useStore";
import { ISLANDS, TOTAL_XP } from "../data/islands";
import type { IslandData } from "../data/islands";

function TopBar() {
  const xp = useGameStore((s) => s.xp);
  const level = useGameStore((s) => s.level);
  const currentIslandIndex = useGameStore((s) => s.currentIslandIndex);
  const island = ISLANDS[currentIslandIndex];

  return (
    <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 pointer-events-none no-select">
      {/* Left: Logo + Island name */}
      <div className="glass rounded-2xl px-4 py-2.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#00b7ff] flex items-center justify-center" style={{ boxShadow: "0 0 12px rgba(0,183,255,0.4)" }}>
          <div className="w-3 h-3 rounded-full bg-[#a8ff00]" style={{ boxShadow: "0 0 8px rgba(168,255,0,0.6)" }} />
        </div>
        <div>
          <p className="font-display font-bold text-sm text-white leading-none">NexaSoul</p>
          <p className="text-[10px] text-white/50 mt-0.5">{island.name}</p>
        </div>
      </div>

      {/* Center: XP + Level */}
      <div className="hidden md:flex glass rounded-2xl px-6 py-2.5 items-center gap-6">
        <div className="text-center">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Level</p>
          <p className="font-display font-bold text-lg text-[#00b7ff] text-glow-blue leading-none">{level}</p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">XP</p>
          <p className="font-display font-bold text-lg text-[#a8ff00] text-glow-green leading-none">{xp.toLocaleString()}</p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Year</p>
          <p className="font-display font-bold text-lg text-white leading-none">{island.year}</p>
        </div>
      </div>

      {/* Right: Progress percentage */}
      <div className="glass rounded-2xl px-4 py-2.5">
        <p className="text-[10px] text-white/50 uppercase tracking-wider text-right">Progress</p>
        <p className="font-display font-bold text-sm text-white leading-none mt-0.5">
          {Math.round((xp / TOTAL_XP) * 100)}%
        </p>
      </div>
    </div>
  );
}

function MiniMap() {
  const currentIslandIndex = useGameStore((s) => s.currentIslandIndex);
  const unlockedIslands = useGameStore((s) => s.unlockedIslands);
  const goToIsland = useGameStore((s) => s.goToIsland);
  const touch = useGameStore((s) => s.touch);

  return (
    <div className="fixed top-20 right-4 md:right-8 z-30 glass rounded-2xl p-3 pointer-events-auto no-select">
      <p className="text-[10px] text-white/50 uppercase tracking-wider mb-2 px-1">World Map</p>
      <div className="relative w-40 h-28 md:w-48 md:h-36">
        {ISLANDS.map((island, i) => {
          // Map world positions to minimap
          const allX = ISLANDS.map((s) => s.position[0]);
          const allZ = ISLANDS.map((s) => s.position[2]);
          const minX = Math.min(...allX);
          const maxX = Math.max(...allX);
          const minZ = Math.min(...allZ);
          const maxZ = Math.max(...allZ);
          const nx = ((island.position[0] - minX) / (maxX - minX || 1)) * 90 + 5;
          const nz = ((island.position[2] - minZ) / (maxZ - minZ || 1)) * 80 + 5;
          const isUnlocked = unlockedIslands.has(island.id);
          const isCurrent = i === currentIslandIndex;
          return (
            <button
              key={island.id}
              className="absolute w-3 h-3 rounded-full transition-all"
              style={{
                left: `${nx}%`,
                top: `${nz}%`,
                background: isCurrent ? "#a8ff00" : isUnlocked ? "#00b7ff" : "#334455",
                boxShadow: isCurrent ? "0 0 10px rgba(168,255,0,0.8)" : isUnlocked ? "0 0 6px rgba(0,183,255,0.5)" : "none",
                transform: "translate(-50%, -50%)",
                opacity: isUnlocked ? 1 : 0.4,
              }}
              onClick={() => {
                if (isUnlocked) {
                  touch();
                  goToIsland(i);
                }
              }}
            />
          );
        })}
        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
          {ISLANDS.slice(0, -1).map((island, i) => {
            const allX = ISLANDS.map((s) => s.position[0]);
            const allZ = ISLANDS.map((s) => s.position[2]);
            const minX = Math.min(...allX);
            const maxX = Math.max(...allX);
            const minZ = Math.min(...allZ);
            const maxZ = Math.max(...allZ);
            const next = ISLANDS[i + 1];
            const x1 = ((island.position[0] - minX) / (maxX - minX || 1)) * 90 + 5;
            const y1 = ((island.position[2] - minZ) / (maxZ - minZ || 1)) * 80 + 5;
            const x2 = ((next.position[0] - minX) / (maxX - minX || 1)) * 90 + 5;
            const y2 = ((next.position[2] - minZ) / (maxZ - minZ || 1)) * 80 + 5;
            return (
              <line key={i} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke="#00b7ff" strokeWidth="1" />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function MissionLog({ island }: { island: IslandData }) {
  const completedMissions = useGameStore((s) => s.completedMissions);
  const completeMission = useGameStore((s) => s.completeMission);
  const touch = useGameStore((s) => s.touch);

  return (
    <div className="fixed left-4 md:left-8 top-20 z-30 glass rounded-2xl p-4 w-64 md:w-72 pointer-events-auto no-select max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Current Island</p>
          <p className="font-display font-bold text-sm text-[#00b7ff] text-glow-blue">{island.name}</p>
        </div>
        <span className="text-[10px] text-[#a8ff00] font-display font-semibold px-2 py-0.5 rounded-full border border-[#a8ff00]/30">
          Year {island.year}
        </span>
      </div>
      <p className="text-xs text-white/60 mb-4 leading-relaxed">{island.description}</p>

      <p className="text-[10px] text-white/50 uppercase tracking-wider mb-2">Missions</p>
      <div className="space-y-2">
        {island.missions.map((mission) => {
          const done = completedMissions[mission.id];
          return (
            <button
              key={mission.id}
              onClick={() => {
                touch();
                completeMission(mission.id, mission.xp, island.id);
              }}
              className={`w-full text-left p-2.5 rounded-xl transition-all ${
                done
                  ? "glass glass-green"
                  : "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00b7ff]/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className={`text-xs font-medium ${done ? "text-[#a8ff00]" : "text-white/80"}`}>
                  {mission.title}
                </p>
                {done && <span className="text-[#a8ff00] text-xs">✓</span>}
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-white/40">{mission.badge}</p>
                <p className="text-[10px] text-[#00b7ff]">+{mission.xp} XP</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BottomBar() {
  const currentIslandIndex = useGameStore((s) => s.currentIslandIndex);
  const goToIsland = useGameStore((s) => s.goToIsland);
  const unlockedIslands = useGameStore((s) => s.unlockedIslands);
  const touch = useGameStore((s) => s.touch);
  const completedMissions = useGameStore((s) => s.completedMissions);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center px-4 pb-4 pointer-events-none no-select">
      <div className="glass rounded-2xl px-3 py-2.5 flex items-center gap-1 md:gap-2 pointer-events-auto max-w-full overflow-x-auto">
        {ISLANDS.map((island, i) => {
          const isUnlocked = unlockedIslands.has(island.id);
          const isCurrent = i === currentIslandIndex;
          const allDone = island.missions.every((m) => completedMissions[m.id]);
          return (
            <button
              key={island.id}
              onClick={() => {
                if (isUnlocked) {
                  touch();
                  goToIsland(i);
                }
              }}
              disabled={!isUnlocked}
              className={`flex flex-col items-center gap-1 px-2 md:px-3 py-1.5 rounded-xl transition-all min-w-[60px] ${
                isCurrent
                  ? "bg-[#00b7ff]/20 border border-[#00b7ff]/50"
                  : isUnlocked
                    ? "hover:bg-white/10"
                    : "opacity-30"
              }`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: allDone ? "#a8ff00" : isCurrent ? "#00b7ff" : isUnlocked ? "#0078d7" : "#334455",
                  boxShadow: allDone ? "0 0 8px rgba(168,255,0,0.6)" : "none",
                }}
              />
              <p className={`text-[9px] md:text-[10px] font-medium leading-none ${isCurrent ? "text-white" : "text-white/50"}`}>
                {island.name.split(" ")[0]}
              </p>
              <p className="text-[8px] text-white/30 leading-none">Y{island.year}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AutoDemoIndicator() {
  const autoDemo = useGameStore((s) => s.autoDemo);
  const touch = useGameStore((s) => s.touch);

  return (
    <AnimatePresence>
      {autoDemo && (
        <motion.div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="glass rounded-full px-6 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#a8ff00] animate-pulse" />
            <p className="text-xs text-white/70 font-display tracking-wider">CINEMATIC DEMO MODE</p>
            <button
              className="text-xs text-[#00b7ff] underline pointer-events-auto ml-2"
              onClick={touch}
            >
              Interact to exit
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HUD() {
  const currentIslandIndex = useGameStore((s) => s.currentIslandIndex);
  const phase = useGameStore((s) => s.phase);
  const island = ISLANDS[currentIslandIndex];

  if (phase !== "exploring") return null;

  return (
    <>
      <TopBar />
      <MissionLog island={island} />
      <MiniMap />
      <BottomBar />
      <AutoDemoIndicator />
    </>
  );
}
