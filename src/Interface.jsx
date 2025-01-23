import { useKeyboardControls } from "@react-three/drei";
import React, { useEffect } from "react";
import useGame from "./stores/useGame";
import { useRef } from "react";
import { addEffect } from "@react-three/fiber";

const Interface = () => {
  const time = useRef("0.00");

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
      ela = ela.toFixed(2);
      if (time.current) time.current.textContent = ela;
    });

    return () => {
      unsubscribeEffect();
    };
  }, []);

  return (
    <div className="interface">
      <div ref={time} className="time">
        0.00
      </div>

      {phase === "end" && (
        <div
          onClick={() => {
            restart();
          }}
          className="restart"
        >
          Restart
        </div>
      )}

      {/* controls */}
      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? "active" : ""}`}></div>
        </div>

        <div className="raw">
          <div className={`key ${leftward ? "active" : ""}`}></div>
          <div className={`key ${backward ? "active" : ""}`}></div>
          <div className={`key ${rightward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? "active" : ""}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Interface;
