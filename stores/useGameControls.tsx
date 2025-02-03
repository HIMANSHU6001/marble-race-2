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
      joystickData: { z: 0, x: 0 },
      setJoystickData: (data: { x: number; z: number }) => {
        set(() => ({ joystickData: data }));
      },
      setControl: (control: string, value: boolean) => {
        set(() => ({ [control]: value }));
      },
    };
  })
);

export default useGame;
