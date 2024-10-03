import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

export default function Confetti() {
  return <Fireworks autorun={{ speed: 2, duration: 5000 }} />;
}
