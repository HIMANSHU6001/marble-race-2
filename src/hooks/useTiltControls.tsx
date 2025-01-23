import { useState, useEffect } from "react";

export default function useTiltControls() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleOrientation = (event) => {
      alert("HI");
      console.log(event);

      const { beta, gamma } = event;
      console.log(beta, gamma);

      setTilt({
        x: gamma / 90,
        y: beta / 90,
      });
    };
    console.log(window);

    window.addEventListener("deviceorientation", () => {
      console.log("ELLo");
    });

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return tilt;
}
