import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights";
import Level from "./Level";
import { Physics } from "@react-three/rapier";
import { BlockAxe, BlockLimbo, BlockSpinner } from "./Level";
import Player from "./Player";
import { Perf } from "r3f-perf";
import useGame from "@/stores/useGame";
import Effects from "@/utils/Effects";
import { useEffect } from "react";

export default function Experience() {
  const blocksCount = useGame((state: any) => state.blocksCount);
  const blocksSeed = useGame((state: any) => state.blocksSeed);

  const setControl = useGame((state: any) => state.setControl);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyW") setControl("forward", true);
      if (e.code === "KeyA") setControl("leftward", true);
      if (e.code === "KeyS") setControl("backward", true);
      if (e.code === "KeyD") setControl("rightward", true);
      if (e.code === "Space") setControl("jump", true);
    });
    window.addEventListener("keyup", (e) => {
      if (e.code === "KeyW") setControl("forward", false);
      if (e.code === "KeyA") setControl("leftward", false);
      if (e.code === "KeyS") setControl("backward", false);
      if (e.code === "KeyD") setControl("rightward", false);
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
      <color args={["#bdedfc"]} attach="background" />
      <Lights />
      <Physics>
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>
    </>
  );
}
