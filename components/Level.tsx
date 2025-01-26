// @ts-nocheck
import { Float, shaderMaterial, Text, useGLTF } from "@react-three/drei";
import { useFrame, extend, useThree, dispose } from "@react-three/fiber";
import { CuboidCollider, RigidBody, useRapier } from "@react-three/rapier";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BoxGeometry,
  Color,
  DoubleSide,
  Euler,
  FrontSide,
  MeshStandardMaterial,
  Quaternion,
} from "three";
import portalVertexShader from "@/public/shaders/portal/vertex.glsl";
import portalFragmentShader from "@/public/shaders/portal/fragment.glsl";
import portalBorderVertexShader from "@/public/shaders/portalBorder/vertex.glsl";
import portalBorderFragmentShader from "@/public/shaders/portalBorder/fragment.glsl";
import useGameMechanics from "@/stores/useGameMechanics";
import _ from "lodash";
import { count } from "console";

const boxGeometry = new BoxGeometry(1, 1, 1);
const transparentMaterial = new MeshStandardMaterial({
  transparent: true,
  opacity: 0,
});
const floor1Material = new MeshStandardMaterial({
  color: "#686868",
  metalness: 0,
  roughness: 0,
});
const floor2Material = new MeshStandardMaterial({
  color: "#151515",
  metalness: 0,
  roughness: 0,
});
const obstacleMaterial = new MeshStandardMaterial({
  color: "orangered",
  metalness: 0,
  roughness: 1,
});
const wallMaterial = new MeshStandardMaterial({
  color: "grey",
  metalness: 0,
  roughness: 0,
});

// TRAPS
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

export const BlockAxe = ({ position = [0, 0, 0], death, restart }) => {
  const gltf = useGLTF("/models/axe.glb");
  gltf.nodes.Cube004.material = new MeshStandardMaterial({
    color: "red",
    metalness: 0,
    roughness: 0,
    side: DoubleSide,
  });

  const obstacle = useRef(null);
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new Quaternion();
    rotation.setFromEuler(new Euler(0, 0, Math.sin(time * 2)));
    if (obstacle.current) obstacle.current.setNextKinematicRotation(rotation);
  });
  const handleCollisionEnter = (event) => {
    const other = event.colliderObject;
    if (other && other.name === "marble") {
      death();
      restart();
    }
  };
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
        colliders="hull"
        type="kinematicPosition"
        restitution={0}
        friction={0}
        position={[0, 2, 0]}
        ref={obstacle}
        onCollisionEnter={handleCollisionEnter}
      >
        <primitive object={gltf.scene} scale={3.8} rotation-y={Math.PI * 0.5} />
      </RigidBody>
    </group>
  );
};

export const BlockLaser = ({ position = [0, 0, 0], death, restart }) => {
  const obstacle = useRef(null);
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const z = Math.sin(time * timeOffset * 0.3) + 1;
    if (obstacle.current)
      obstacle.current.setNextKinematicTranslation({
        x: position[0],
        y: position[1],
        z: position[2] + z,
      });
  });
  const handleCollisionEnter = (event) => {
    const other = event.colliderObject;
    if (other && other.name === "marble") {
      death();
      restart();
    }
  };
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
        onCollisionEnter={handleCollisionEnter}
      >
        <mesh geometry={boxGeometry} scale={[3.8, 0.03, 0.03]}>
          <meshBasicMaterial color={[6, 0, 0]} />
        </mesh>
      </RigidBody>
    </group>
  );
};

export const BlockLaserLimbo = ({ position = [0, 0, 0], death, restart }) => {
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

  const handleCollisionEnter = (event) => {
    const other = event.colliderObject;
    if (other && other.name === "marble") {
      death();
      restart();
    }
  };

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
        onCollisionEnter={handleCollisionEnter}
      >
        <mesh geometry={boxGeometry} scale={[3.8, 0.03, 0.03]}>
          <meshBasicMaterial color={[6, 0, 0]} />
        </mesh>
      </RigidBody>
    </group>
  );
};

// END BLOCK
export const BlockEnd = ({ position = [0, 0, 0] }) => {
  const gltf = useGLTF("/models/finish.glb");
  const { nodes } = gltf;

  const portalRef = useRef();

  const nextLevel = useGameMechanics((state) => state.nextLevel);
  const end = useGameMechanics((state) => state.end);

  const PortalMaterial = shaderMaterial(
    {
      uTime: 0,
      uColorStart: new Color(0xeeeeee),
      uColorEnd: new Color(0x000000),
    },
    portalVertexShader,
    portalFragmentShader
  );

  extend({ PortalMaterial });

  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.uniforms.uTime.value = state.clock.elapsedTime * 2;
    }
  });

  const { scene } = useThree();
  const { world } = useRapier();

  const handleLevelComplete = useCallback(
    _.debounce(() => {
      end();
      nextLevel();
    }, 300),
    []
  );

  return (
    <group position={position}>
      <Text
        position={[0, 0.25, 2]}
        font="./bebas-neue-v9-latin-regular.woff"
        scale={0.5}
      >
        FINISH
        <meshBasicMaterial toneMapped={true} />
      </Text>
      <mesh
        geometry={boxGeometry}
        position={[0, -0.25, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
        material={floor1Material}
      />

      <RigidBody
        type="fixed"
        restitution={0.2}
        friction={0}
        colliders="trimesh"
      >
        <mesh position-y={1.2}>
          <torusGeometry args={[1, 0.05]} />
          <meshBasicMaterial color={[0, 1, 10]} />
        </mesh>
      </RigidBody>

      <RigidBody
        colliders="trimesh"
        type="fixed"
        restitution={0}
        onCollisionEnter={handleLevelComplete}
      >
        <mesh
          geometry={nodes.PortalInside.geometry}
          position-y={1.4}
          position-z={-0.5}
          scale-y={0.5}
          rotation-x={Math.PI * 0.5}
          material={transparentMaterial}
        />
      </RigidBody>

      <mesh
        geometry={nodes.PortalLight.geometry}
        position-y={1.2}
        rotation-x={Math.PI * 0.5}
      >
        <portalMaterial ref={portalRef} toneMapped={false} />
      </mesh>
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
          position={[0, -0.3, -(length * 2)]}
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

const LifeObject = ({ length, increaseLife }) => {
  const { world } = useRapier();
  const lifeObj = useRef();
  const lifeObjMesh = useRef();
  const position = [
    (Math.random() - 0.5) * 3.5,
    0.1,
    -(Math.random() + 1) * length,
  ];

  const handleLifeCollision = (event) => {
    const other = event.colliderObject;
    if (other && other.name === "marble") {
      console.log("Life collected");
      world.removeRigidBody(lifeObj.current);
      lifeObj.current = null;
      lifeObjMesh.current.visible = false;
      increaseLife();
    }
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time) + 1;
    if (lifeObj.current) {
      lifeObj.current.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y,
        z: position[2],
      });
      lifeObj.current.setNextKinematicRotation(
        new Quaternion().setFromEuler(new Euler(0, time * 1.5, 0))
      );
    }
  });
  return (
    <RigidBody
      type="kinematicPosition"
      position={position}
      ref={lifeObj}
      onCollisionEnter={handleLifeCollision}
    >
      <mesh ref={lifeObjMesh} rotation-x={0.5} scale-y={1.25}>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </RigidBody>
  );
};

const Level = ({
  count = 5,
  types = [BlockSpinner, BlockLimbo, BlockAxe, BlockLaser, BlockLaserLimbo],
  seed = 0,
  level,
}) => {
  const blocks = useMemo(() => {
    const blocks = [];
    for (let i = 0; i < count; i++) {
      blocks.push(types[Math.floor(Math.random() * types.length)]);
    }

    return blocks;
  }, [count, types, seed, level]);

  const death = useGameMechanics((state) => state.death);
  const restart = useGameMechanics((state) => state.restart);
  const increaseLife = useGameMechanics((state) => state.increaseLife);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => {
        return (
          <Block
            key={index}
            position={[0, 0, -4 * (index + 1)]}
            death={death}
            restart={restart}
          />
        );
      })}
      <LifeObject length={count + 2} increaseLife={increaseLife} />
      <BlockEnd position={[0, 0, -4 * (count + 1)]} />
      <Bounds length={count + 2} />
    </>
  );
};

export default Level;
