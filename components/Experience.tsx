import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights";
import Level from "./Level";
import { Physics } from "@react-three/rapier";
import { BlockAxe, BlockLimbo, BlockSpinner } from "./Level";
import Player from "./Player";
import { Perf } from "r3f-perf";
import useGame from "@/stores/useGame";
import Effects from "@/utils/Effects";

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>
      <Perf />
      <OrbitControls />
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
