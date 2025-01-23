"use client";
import { Canvas } from "@react-three/fiber";
import Experience from "@/components/Experience";
import Interface from "@/components/Interface";

import React from "react";

const page = () => {
  return (
    <>
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
    </>
  );
};

export default page;
