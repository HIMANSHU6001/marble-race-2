import Game from "@/types/game";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useGame = create(
  subscribeWithSelector((set) => {
    return {
      forward: false,
      backward: false,
      rightward: false,
      leftward: false,
      jump: false,
      setControl: (control: string, value: boolean) => {
        console.log(control, value);

        set(() => ({ [control]: value }));
      },
      blocksCount: 10,
      blocksSeed: 0,
      startTime: 0,
      endTime: 0,
      phase: "ready",
      start: () => {
        set((state: Game) => {
          if (state.phase === "ready") {
            return { phase: "playing", startTime: Date.now() };
          }
          return {};
        });
      },
      restart: () => {
        set((state: Game) => {
          if (state.phase === "playing" || state.phase === "end") {
            return { phase: "ready", blocksSeed: Math.random() };
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
    };
  })
);

export default useGame;
