import type { CSSProperties } from "react";

// Stable samples keep decorations in place during scroll and resize re-renders.
export function motionSample(seed: number, index: number, channel: number) {
  let value =
    (seed +
      Math.imul(index + 1, 374761393) +
      Math.imul(channel + 1, 668265263)) |
    0;
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}

export function motionVariation(seed: number, index: number): CSSProperties {
  const sample = (channel: number) => motionSample(seed, index, channel);
  return {
    animationDuration: `${(9 + sample(0) * 10).toFixed(2)}s`,
    animationDelay: `${(-sample(1) * 24).toFixed(2)}s`,
    "--wander-x1": `${(-12 + sample(2) * 30).toFixed(1)}px`,
    "--wander-y1": `${(-12 - sample(3) * 24).toFixed(1)}px`,
    "--wander-x2": `${(-18 + sample(4) * 40).toFixed(1)}px`,
    "--wander-y2": `${(4 + sample(5) * 18).toFixed(1)}px`,
    "--wander-x3": `${(-10 + sample(6) * 30).toFixed(1)}px`,
    "--wander-y3": `${(-6 - sample(7) * 30).toFixed(1)}px`,
    "--wander-tilt": `${(-14 + sample(8) * 28).toFixed(1)}deg`,
    "--prop-duration": `${(3.5 + sample(9) * 5).toFixed(2)}s`,
    "--prop-delay": `${(-sample(10) * 8).toFixed(2)}s`,
  } as CSSProperties;
}
