import React, { useEffect, useState } from "react";
import useGameControls from "@/stores/useGameControls";
import useGameMechanics from "@/stores/useGameMechanics";
import { useRef } from "react";
import { addEffect } from "@react-three/fiber";
import shrink from "@/public/icons/shrink.svg";
import expand from "@/public/icons/expand.svg";
import jump_icon from "@/public/icons/Jump.svg";
import Image from "next/image";
import dynamic from "next/dynamic";

const Nipple = dynamic(() => import("react-nipple"), { ssr: false });

const Interface = () => {
  const time = useRef<HTMLDivElement>(null);

  const lives = useGameMechanics((state: any) => state.lives);
  const level = useGameMechanics((state: any) => state.level);

  const forward = useGameControls((state: any) => state.forward);
  const backward = useGameControls((state: any) => state.backward);
  const rightward = useGameControls((state: any) => state.rightward);
  const leftward = useGameControls((state: any) => state.leftward);
  const jump = useGameControls((state: any) => state.jump);

  const joystickData = useGameControls((state: any) => state.joystickData);
  const setJoystickData = useGameControls(
    (state: any) => state.setJoystickData
  );

  const setControl = useGameControls((state: any) => state.setControl);

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGameMechanics.getState() as {
        phase: string;
        startTime: number;
        endTime: number;
      };
      let ela: number | string = 0;
      if (state.phase === "playing") ela = Date.now() - state.startTime;
      else if (state.phase === "end") ela = state.endTime - state.startTime;
      ela /= 1000;
      ela = ela.toFixed(2);
      if (time.current) time.current.textContent = ela.toString();
    });

    return () => {
      unsubscribeEffect();
    };
  }, []);

  const [src, setSrc] = useState(expand);

  const handleJoystickMove = (evt: any, data: { angle: any }) => {
    const { angle } = data;
    setJoystickData({ z: Math.sin(angle.radian), x: Math.cos(angle.radian) });
  };

  const handleJoystickEnd = () => {
    setJoystickData({ z: 0, x: 0 });
  };

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

      <div className="absolute z-10 top-1 right-1 bg-black bg-opacity-20 px-2 text-xl text-center text-white">
        <div>Lives: {lives}</div>
        <div>Level: {level}</div>
      </div>

      <div
        ref={time}
        className="absolute top-[15%] left-0 w-full text-white text-[6vh] bg-black bg-opacity-20 pt-1 text-center"
      >
        0.00
      </div>

      {lives === 0 && (
        <div className="absolute z-10 flex justify-center top-[40%] left-0 w-full text-white text-[80px] bg-black bg-opacity-50 pt-[10px] text-center">
          GAME OVER
        </div>
      )}

      {/* controls */}
      <div className="absolute bottom-[10%] left-0 w-full hidden md:block">
        <div className="flex justify-center">
          <div
            className={`w-10 h-10 m-1 border-2 border-white bg-white ${
              forward && lives > 0 ? "bg-opacity-100" : "bg-opacity-25"
            }`}
          ></div>
        </div>

        <div className="flex justify-center">
          <div
            className={`w-10 h-10 m-1 border-2 border-white bg-white ${
              leftward && lives > 0 ? "bg-opacity-100" : "bg-opacity-25"
            }`}
          ></div>
          <div
            className={`w-10 h-10 m-1 border-2 border-white bg-white ${
              backward && lives > 0 ? "bg-opacity-100" : "bg-opacity-25"
            }`}
          ></div>
          <div
            className={`w-10 h-10 m-1 border-2 border-white bg-white ${
              rightward && lives > 0 ? "bg-opacity-100" : "bg-opacity-25"
            }`}
          ></div>
        </div>
        <div className="flex justify-center">
          <div
            className={`w-36 h-10 m-1 border-2 border-white bg-white large ${
              jump && lives > 0 ? "bg-opacity-100" : "bg-opacity-25"
            }`}
          ></div>
        </div>
      </div>

      {/* Mobile controls */}
      <div
        onClick={() => setControl("jump", true)}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute right-5 bottom-5 px-5 py-10 md:hidden rounded-full bg-black bg-opacity-50"
      >
        <Image src={jump_icon} alt="jump" />
      </div>
      <div className="md:hidden">
        <Nipple
          options={{
            mode: "static",
            position: { bottom: "50px", left: "50px" },
            size: 100,
          }}
          style={{
            width: 100,
            height: 100,
            position: "absolute",
            bottom: "50px",
            left: "50px",
          }}
          onMove={handleJoystickMove}
          onEnd={handleJoystickEnd}
        />
      </div>
    </div>
  );
};

export default Interface;
