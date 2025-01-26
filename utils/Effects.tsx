import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, SSR } from "@react-three/postprocessing";
import { useControls } from "leva";

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={1.1} mipmapBlur />
    </EffectComposer>
  );
}
