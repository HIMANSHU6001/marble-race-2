// @ts-nocheck
import { Float, Text, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BoxGeometry,
  Euler,
  FrontSide,
  MeshStandardMaterial,
  Quaternion,
} from "three";

const boxGeometry = new BoxGeometry(1, 1, 1);
const floor1Material = new MeshStandardMaterial({
  color: "limegreen",
  metalness: 0,
  roughness: 0,
});
const floor2Material = new MeshStandardMaterial({
  color: "greenyellow",
  metalness: 0,
  roughness: 0,
});
const obstacleMaterial = new MeshStandardMaterial({
  color: "orangered",
  metalness: 0,
  roughness: 1,
});
const wallMaterial = new MeshStandardMaterial({
  color: "",
  metalness: 0,
  roughness: 0,
});

export const BlockStart = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          scale={0.5}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign="right"
          position={[0.75, 0.65, 0]}
          rotation-y={-0.25}
          font="./bebas-neue-v9-latin-regular.woff"
        >
          Marble Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        geometry={boxGeometry}
        position={[0, -0.3, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
        material={floor1Material}
      />
    </group>
  );
};

export const BlockSpinner = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef(null);
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
  );
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new Quaternion();
    rotation.setFromEuler(new Euler(0, time * speed, 0));
    if (obstacle.current) obstacle.current.setNextKinematicRotation(rotation);
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        position={[0, -0.3, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
        material={floor2Material}
      />
      <RigidBody
        type="kinematicPosition"
        restitution={0}
        friction={0}
        ref={obstacle}
      >
        <mesh
          geometry={boxGeometry}
          scale={[3.5, 0.3, 0.3]}
          receiveShadow
          castShadow
          material={obstacleMaterial}
        />
      </RigidBody>
    </group>
  );
};

export const BlockLimbo = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef(null);
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time * timeOffset * 0.3) + 1;
    if (obstacle.current)
      obstacle.current.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y,
        z: position[2],
      });
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        position={[0, -0.3, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
        material={floor2Material}
      />
      <RigidBody
        type="kinematicPosition"
        restitution={0}
        friction={0}
        ref={obstacle}
      >
        <mesh
          geometry={boxGeometry}
          scale={[3.5, 0.3, 0.3]}
          receiveShadow
          castShadow
          material={obstacleMaterial}
        />
      </RigidBody>
    </group>
  );
};

export const BlockAxe = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef(null);
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const z = Math.sin(time * timeOffset * 0.3) * 1.25;
    if (obstacle.current)
      obstacle.current.setNextKinematicTranslation({
        x: position[0] + z,
        y: position[1] + 0.5,
        z: position[2],
      });
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        position={[0, -0.3, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
        material={floor2Material}
      />
      <RigidBody
        type="kinematicPosition"
        restitution={0}
        friction={0}
        ref={obstacle}
      >
        <mesh
          geometry={boxGeometry}
          scale={[1.5, 1.5, 0.3]}
          receiveShadow
          castShadow
          material={obstacleMaterial}
        />
      </RigidBody>
    </group>
  );
};

export const BlockEnd = ({ position = [0, 0, 0] }) => {
  const gltf = useGLTF("./hamburger.glb");

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  return (
    <group position={position}>
      <Text
        position={[0, 0.25, 2]}
        font="./bebas-neue-v9-latin-regular.woff"
        scale={0.5}
      >
        FINISH
        <meshBasicMaterial toneMaooed={false} />
      </Text>
      <mesh
        geometry={boxGeometry}
        position={[0, -0.25, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
        material={floor1Material}
      />
      <RigidBody type="fixed" colliders="hull" restitution={0.2} friction={0}>
        <primitive object={gltf.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
};

const Bounds = ({ length }) => {
  return (
    <group position={[0, 0.7, -(length * 2) + 2]}>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.1, 1.2, length * 4]}
          castShadow
          position={[2, -0.3, 0]}
        />
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.1, 1.2, length * 4]}
          castShadow
          receiveShadow
          position={[-2, -0.3, 0]}
        />
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.2, 0.3]}
          position={[0,-0.3, -(length * 2)]}
          castShadow
        />
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -1, 0]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </group>
  );
};

const Level = ({
  count = 5,
  types = [BlockSpinner, BlockLimbo, BlockAxe],
  seed = 0,
}) => {
  const blocks = useMemo(() => {
    const blocks = [];
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }
    return blocks;
  }, [count, types, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => {
        return <Block key={index} position={[0, 0, -4 * (index + 1)]} />;
      })}
      <BlockEnd position={[0, 0, -4 * (count + 1)]} />
      <Bounds length={count + 2} />
    </>
  );
};

export default Level;
