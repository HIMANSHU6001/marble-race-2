import {
  Environment,
  OrbitControls,
  Reflector,
  Stage,
} from "@react-three/drei";
import Lights from "./Lights";
import Level from "./Level";
import { Physics } from "@react-three/rapier";
import Player from "./Player";
import { Perf } from "r3f-perf";
import useGameMechanics from "@/stores/useGameMechanics";
import useGameControls from "@/stores/useGameControls";
import Effects from "@/utils/Effects";
import { useEffect } from "react";

export default function Experience() {
  const blocksCount = useGameMechanics((state: any) => state.blocksCount);
  const blocksSeed = useGameMechanics((state: any) => state.blocksSeed);
  const level = useGameMechanics((state: any) => state.level);

  const setControl = useGameControls((state: any) => state.setControl);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
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
      if (e.code === "Space") setControl("jump", false);
    });

    return () => {
      window.removeEventListener("keydown", (e) => {});
      window.removeEventListener("keyup", (e) => {});
    };
  }, []);

  return (
    <>
      {/* <Perf /> */}
      {/* <OrbitControls /> */}
      <Effects />
      <color args={["#aaf5ee"]} attach="background" />
      <Lights />
      <Physics key={level}>
        <Level count={blocksCount} seed={blocksSeed} level={level} />
        <Player />
      </Physics>
    </>
  );
}
