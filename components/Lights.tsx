// @ts-nocheck
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Lights() {
  const directionalLight = useRef();

  useFrame((state) => {
    directionalLight.current.position.z = state.camera.position.z - 3;
    directionalLight.current.target.position.z = state.camera.position.z - 4;
    directionalLight.current.target.updateMatrixWorld();
  });

  return (
    <>
      <directionalLight
        ref={directionalLight}
        castShadow
        position={[4, 4, -1]}
        intensity={4.5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={30}
        shadow-camera-bottom={-5}
        shadow-camera-left={-2.5}
      />
      <ambientLight intensity={1.5} />
    </>
  );
}
