// @ts-nocheck

import { useFrame } from "@react-three/fiber";
import { useRapier, RigidBody } from "@react-three/rapier";
import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import useGameControls from "@/stores/useGameControls";
import useGameMechanics from "@/stores/useGameMechanics";

const Player = () => {
  const body = useRef();
  const { rapier, world } = useRapier();

  const reset = () => {
    if (body.current) {
      try {
        body.current.setTranslation({ x: 0, y: 0, z: 0 });
        body.current.setLinvel({ x: 0, y: 0, z: 0 });
        body.current.setAngvel({ x: 0, y: 0, z: 0 });
      } catch (error) {
        console.info(error);
      }
    }
    return;
  };

  const start = useGameMechanics((state) => state.start);
  const end = useGameMechanics((state) => state.end);
  const blocksCount = useGameMechanics((state) => state.blocksCount);
  const restart = useGameMechanics((state) => state.restart);
  const death = useGameMechanics((state) => state.death);
  const lives = useGameMechanics((state) => state.lives);

  const forward = useGameControls((state) => state.forward);
  const backward = useGameControls((state) => state.backward);
  const rightward = useGameControls((state) => state.rightward);
  const leftward = useGameControls((state) => state.leftward);
  const jump = useGameControls((state) => state.jump);

  const joystickData = useGameControls((state: any) => state.joystickData);
  const setJoystickData = useGameControls(
    (state: any) => state.setJoystickData
  );

  const setControl = useGameControls((state) => state.setControl);

  useEffect(() => {
    if (jump && body.current) {
      setControl("jump", false);
      const origin = body.current.translation();
      origin.y -= 0.31;
      const direction = { x: 0, y: -1, z: 0 };
      const rapierWorld = world;
      const ray = new rapier.Ray(origin, direction);
      const hit = rapierWorld.castRay(ray, 10, true);
      if (hit?.timeOfImpact < 0.15 && body.current)
        body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
    }
  }, [jump]);

  useEffect(() => {
    const unsubscribePhase = useGameMechanics.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === "ready") {
          reset();
        }
      }
    );

    const unsubscribeLevel = useGameMechanics.subscribe(
      (state) => state.level,
      (value) => {
        reset();
      }
    );

    window.addEventListener("keydown", (e) => {
      start();
      if (e.code === "KeyW" || e.code === "ArrowUp")
        setControl("forward", true);
      if (e.code === "KeyA" || e.code === "ArrowLeft")
        setControl("leftward", true);
      if (e.code === "KeyS" || e.code === "ArrowDown")
        setControl("backward", true);
      if (e.code === "KeyD" || e.code === "ArrowRight")
        setControl("rightward", true);
      if (e.code === "Space") setControl("jump", true);
    });
    window.addEventListener("keyup", (e) => {
      if (e.code === "KeyW" || e.code === "ArrowUp")
        setControl("forward", false);
      if (e.code === "KeyA" || e.code === "ArrowLeft")
        setControl("leftward", false);
      if (e.code === "KeyS" || e.code === "ArrowDown")
        setControl("backward", false);
      if (e.code === "KeyD" || e.code === "ArrowRight")
        setControl("rightward", false);
    });

    return () => {
      unsubscribePhase();
      window.removeEventListener("keydown", (e) => {});
      window.removeEventListener("keyup", (e) => {});
    };
  }, []);

  const [smoothCameraPosition] = useState(() => new Vector3(10, 10, 10));
  const [smoothCameraTarget] = useState(() => new Vector3());

  useFrame((state, delta) => {
    /**
     * Controls
     */
    if (!body.current) return;
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    /**
     * joystick controls
     */
    if (joystickData && (joystickData.x !== 0 || joystickData.z !== 0)) {
      impulse.x = joystickData.x * delta;
      impulse.z = -joystickData.z * delta;
    }

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

    /**
     * Phases
     */

    if (bodyPosition.y < -4) {
      death();
      restart();
    }

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;
    if (lives === 0) return;
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
  });

  return (
    <>
      <RigidBody
        colliders="ball"
        restitution={0.2}
        friction={1}
        position={[0, 1, 0]}
        ref={body}
        linearDamping={0.5}
        angularDamping={0.5}
        name="marble"
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
