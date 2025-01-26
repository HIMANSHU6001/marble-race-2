import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface Game {
  status: "alive" | "dead";
  level: number;
  blocksCount: number;
  blocksSeed: number;
  lives: number;
  phase: string;
  startTime: number;
  endTime?: number;
  start: () => void;
  end: () => void;
  increaseLife: () => void;
}

const useGame = create(
  subscribeWithSelector((set) => {
    return {
      level: 1,
      lives: 10,
      blocksCount: 1,
      blocksSeed: 0,
      startTime: 0,
      endTime: 0,
      status: "alive",
      phase: "ready",
      death: () => {
        set((state: Game) => {
          if (state.status === "alive") {
            return { status: "dead", lives: state.lives - 1 };
          }
          return {};
        });
      },
      start: () => {
        set((state: Game) => {
          if (state.phase === "ready") {
            return { phase: "playing", startTime: Date.now(), status: "alive" };
          }
          return {};
        });
      },
      restart: () => {
        set((state: Game) => {
          if (state.phase === "playing" || state.phase === "end") {
            return { phase: "ready" };
          }
          return {};
        });
      },
      nextLevel: () => {
        set((state: Game) => {
          if (state.phase === "end") {
            if (state.level < 3) {
              return {
                level: state.level + 1,
                blocksSeed: Math.random(),
                blocksCount: state.blocksCount + 5,
                startTime: Date.now(),
                phase: "ready",
              };
            }
            return {
              level: state.level + 1,
              blocksSeed: Math.random(),
              startTime: Date.now(),
              phase: "ready",
            };
          }
          return {};
        });
      },
      end: () => {
        set((state: Game) => {
          if (state.phase === "playing") {
            return { phase: "end", endTime: Date.now() };
          }
          return {};
        });
      },
      increaseLife: () => {
        set((state: Game) => {
          if (state.phase === "playing" || state.phase === "end") {
            return { lives: state.lives + 1 };
          }
          return {};
        });
      },
    };
  })
);

export default useGame;
