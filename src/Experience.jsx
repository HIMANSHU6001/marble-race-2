import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import Level from "./Level.jsx";
import { Physics } from "@react-three/rapier";
import { BlockAxe, BlockLimbo, BlockSpinner } from "./Level.jsx";
import Player from "./Player.jsx";
import { Perf } from "r3f-perf";
import useGame from "./stores/useGame";
import Effects from "./Effects.jsx";

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
