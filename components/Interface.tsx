import React, { useEffect, useState } from "react";
import useGame from "@/stores/useGame";
import { useRef } from "react";
import { addEffect } from "@react-three/fiber";
import shrink from "@/public/icons/shrink.svg";
import expand from "@/public/icons/expand.svg";
import Image from "next/image";

const Interface = () => {
  const time = useRef<HTMLDivElement>(null);

  const restart = useGame((state: any) => state.restart);
  const phase = useGame((state: any) => state.phase);

  const forward = useGame((state: any) => state.forward);
  const backward = useGame((state: any) => state.backward);
  const rightward = useGame((state: any) => state.rightward);
  const leftward = useGame((state: any) => state.leftward);
  const jump = useGame((state: any) => state.jump);
  const setControl = useGame((state: any) => state.setControl);

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState() as {
        phase: string;
        startTime: number;
        endTime: number;
      };
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

  const [src, setSrc] = useState(expand);

  return (
    <div className="fixed top-0 left-0 w-full h-full font-bebas-neue not-italic">
      <button
        onClick={(e) => {
          if (document.fullscreenElement) document.exitFullscreen();
          else document.body.requestFullscreen();
          setSrc((prev: any) => (prev === expand ? shrink : expand));
        }}
        className="absolute z-10 top-1 left-1 bg-black bg-opacity-20 p-1 text-center text-white"
      >
        <Image src={src} alt="shrink" />
      </button>

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
          className="absolute z-10 flex justify-center top-[40%] left-0 w-full text-white text-[80px] bg-black bg-opacity-20 pt-[10px] text-center cursor-pointer"
        >
          Restart
        </div>
      )}

      {/* controls */}
      <div className="absolute bottom-[10%] left-0 w-full hidden md:block">
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

      {/* Mobile controls */}
      <div
        onContextMenu={(e) => e.preventDefault()}
        className="absolute left-0 w-full h-screen grid grid-cols-2 md:hidden"
      >
        <div
          onClick={() => setControl("jump", true)}
          onTouchStart={() => setControl("backward", true)}
          onTouchEnd={() => setControl("backward", false)}
        ></div>
        <div
          onClick={() => setControl("jump", true)}
          onTouchStart={() => setControl("forward", true)}
          onTouchEnd={() => setControl("forward", false)}
        ></div>
      </div>
    </div>
  );
};

export default Interface;
