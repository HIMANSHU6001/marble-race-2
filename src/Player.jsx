import {
  useKeyboardControls,
  DeviceOrientationControls,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRapier, RigidBody } from "@react-three/rapier";
import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import useGame from "./stores/useGame";

const Player = () => {
  const body = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { rapier, world } = useRapier();
  useEffect(() => {
    const handleOrientation = (event) => {
      const { beta, gamma } = event;
      setTilt({
        x: gamma / 90,
        y: beta / 90,
      });
    };
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            console.log("Permission granted for device orientation");
          } else {
            console.log("Permission denied");
          }
        })
        .catch(console.error);
    }

    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  useEffect(() => {
    console.log(tilt);
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    if (body.current) {
      impulse.x = tilt.y * 0.2;
      torque.z = -tilt.y * 0.2;
      body.current.applyImpulse(impulse);
    }
  }, [tilt]);

  const jump = () => {
    const origin = body.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const rapierWorld = world;

    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);
    if (hit.timeOfImpact < 0.15 && body.current)
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  };

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 0, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const blocksCount = useGame((state) => state.blocksCount);
  const restart = useGame((state) => state.restart);

  useEffect(() => {
    const unsubscribePhase = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === "ready") {
          reset();
        }
      }
    );

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      }
    );

    const unsubscribeAny = subscribeKeys(() => {
      start();
    });

    return () => {
      unsubscribePhase();
      unsubscribeJump();
      unsubscribeAny();
    };
  }, []);

  const [smoothCameraPosition] = useState(() => new Vector3(10, 10, 10));
  const [smoothCameraTarget] = useState(() => new Vector3());

  useFrame((state, delta) => {
    /**
     * Controls
     */
    if (!body.current) return;
    const { forward, backward, leftward, rightward } = getKeys();
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x = -torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x = +torqueStrength;
    }
    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z = +torqueStrength;
    }
    if (rightward) {
      impulse.x += impulseStrength;
      torque.z = -torqueStrength;
    }

    body.current.wakeUp();
    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    /**
     * Mobile controls
     */

    /**
     * Camera
     */

    const bodyPosition = body.current.translation();
    const cameraPosition = new Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 3.25;
    cameraPosition.y += 0.65;
    const cameraTarget = new Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.65;

    smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      state.camera.rotation.set(0, 0, Math.PI / 2);
    }

    /**
     * Phases
     */

    if (bodyPosition.z < -(blocksCount * 4 + 2)) {
      end();
    }
    if (bodyPosition.y < -4) {
      restart();
    }
  });

  return (
    <>
      <DeviceOrientationControls />
      <RigidBody
        colliders="ball"
        restitution={0.2}
        friction={1}
        position={[0, 1, 0]}
        ref={body}
        linearDamping={0.5}
        angularDamping={0.5}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Player;
