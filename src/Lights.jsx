import { useEffect, useRef } from "react";
import { useHelper } from "@react-three/drei";
import { CameraHelper, DirectionalLightHelper } from "three";
import { useFrame } from "@react-three/fiber";

export default function Lights() {
  const directionalLight = useRef();

  useFrame((state) => {
    directionalLight.current.position.z = state.camera.position.z - 3;
    directionalLight.current.target.position.z = state.camera.position.z - 4;
    directionalLight.current.target.updateMatrixWorld();
  });

  // Ensure helpers are correctly bound to the directional light and its shadow camera
  // useHelper(directionalLight, DirectionalLightHelper, 1, "red");

  // useEffect(() => {
  //   if (directionalLight.current) {
  //     const shadowCamera = directionalLight.current.shadow.camera;
  //     const helper = new CameraHelper(shadowCamera);
  //     directionalLight.current.add(helper);
  //   }
  // }, []);

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
