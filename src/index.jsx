import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { KeyboardControls } from "@react-three/drei";
import Interface from "./Interface.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <KeyboardControls
    map={[
      { keys: ["KeyW", "ArrowUp"], name: "forward" },
      { keys: ["KeyS", "ArrowDown"], name: "backward" },
      { keys: ["KeyA", "ArrowLeft"], name: "leftward" },
      { keys: ["KeyD", "ArrowRight"], name: "rightward" },
      { keys: ["Space"], name: "jump" },
    ]}
  >
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [2.5, 4, 6],
      }}
    >
      <Experience />
    </Canvas>
    <Interface />
  </KeyboardControls>
);
