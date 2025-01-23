"use client";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import Experience from "@/components/Experience";
import Interface from "@/components/Interface";

import React from "react";

const page = () => {
  return (
    <KeyboardControls
      map={[
        { keys: ["KeyW", "ArrowUp"], name: "forward" },
        { keys: ["KeyS", "ArrowDown"], name: "backward" },
        { keys: ["KeyA", "ArrowLeft"], name: "leftward" },
        { keys: ["KeyD", "ArrowRight"], name: "rightward" },
        { keys: ["Space"], name: "jump" },
      ]}
    >
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [2.5, 4, 6],
        }}
      >
        <Experience />
      </Canvas>
      <Interface />
    </KeyboardControls>
  );
};

export default page;
