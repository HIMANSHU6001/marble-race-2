import { useKeyboardControls } from "@react-three/drei";
import React, { useEffect } from "react";
import useGame from "@/stores/useGame";
import { useRef } from "react";
import { addEffect } from "@react-three/fiber";

const Interface = () => {
  const time = useRef<HTMLDivElement>(null);

  const restart = useGame((state) => state.restart);
  const phase = useGame((state) => state.phase);
  const startTime = useGame((state) => state.startTime);

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const jump = useKeyboardControls((state) => state.jump);

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();
      let ela = 0;
      if (state.phase === "playing") ela = Date.now() - state.startTime;
      else if (state.phase === "end") ela = state.endTime - state.startTime;
      ela /= 1000;
      ela = parseFloat(ela.toFixed(2));
      if (time.current) time.current.textContent = ela.toString();
    });

    return () => {
      unsubscribeEffect();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none font-bebas-neue  not-italic">
      <div
        ref={time}
        className="absolute top-[15%] left-0 w-full text-white text-[6vh] bg-black bg-opacity-20 pt-1 text-center"
      >
        0.00
      </div>

      {phase === "end" && (
        <div
          onClick={() => {
            restart();
          }}
          className="absolute flex justify-center top-[40%] left-0 w-full text-white text-[80px] bg-black bg-opacity-20 pt-[10px] text-center cursor-pointer"
        >
          Restart
        </div>
      )}

      {/* controls */}
      <div className="absolute bottom-[10%] left-0 w-full">
        <div className="flex justify-center">
          <div
            className={`w-10 h-10 m-1 border-2 border-white bg-white ${
              forward ? "bg-opacity-100" : "bg-opacity-25"
            }`}
          ></div>
        </div>

        <div className="flex justify-center">
          <div
            className={`w-10 h-10 m-1 border-2 border-white bg-white ${
              leftward ? "bg-opacity-100" : "bg-opacity-25"
            }`}
          ></div>
          <div
            className={`w-10 h-10 m-1 border-2 border-white bg-white ${
              backward ? "bg-opacity-100" : "bg-opacity-25"
            }`}
          ></div>
          <div
            className={`w-10 h-10 m-1 border-2 border-white bg-white ${
              rightward ? "bg-opacity-100" : "bg-opacity-25"
            }`}
          ></div>
        </div>
        <div className="flex justify-center">
          <div
            className={`w-36 h-10 m-1 border-2 border-white bg-white large ${
              jump ? "bg-opacity-100" : "bg-opacity-25"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Interface;
