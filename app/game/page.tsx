"use client";
import Interface from "@/components/Interface";
import React from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "@/components/Experience";

const Page = () => {
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

export default Page;
