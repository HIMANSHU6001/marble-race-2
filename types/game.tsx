type Game = {
  forward: boolean;
  backward: boolean;
  leftward: boolean;
  rightward: boolean;
  jump: boolean;
  setControl: (control: string, value: boolean) => void;
  blocksCount: number;
  blocksSeed: number;
  startTime: number;
  endTime: number;
  start: () => void;
  restart: () => void;
  end: () => void;
  phase: string;
};

export default Game;
