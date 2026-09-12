import { useEffect, useRef, type CSSProperties } from "react";

type Point = { x: number; y: number };
type Flight = { from: Point; c1: Point; c2: Point; to: Point; elapsed: number; duration: number; rest: number; heading: number; position: Point };
const random = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export default function ButterflyFlight({ x, y, width, index, running }: { x: number; y: number; width: number; index: number; running: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const state = useRef<Flight>({ from: { x: 0, y: 0 }, c1: { x: 0, y: 0 }, c2: { x: 0, y: 0 }, to: { x: 0, y: 0 }, elapsed: 0, duration: 0, rest: index * 320, heading: Math.PI, position: { x: 0, y: 0 } });

  useEffect(() => {
    const node = ref.current;
    const facing = node?.firstElementChild as HTMLElement | null;
    if (!running || !node || !facing) return;
    let frame = 0;
    let previous = 0;
    let scale = (node.parentElement?.clientWidth || 1024) / 1024;
    const resize = new ResizeObserver(entries => { scale = entries[0].contentRect.width / 1024; });
    if (node.parentElement) resize.observe(node.parentElement);

    const tick = (time: number) => {
      const dt = previous ? Math.min(time - previous, 50) : 0;
      previous = time;
      const flight = state.current;
      if (flight.rest > 0) {
        flight.rest -= dt;
      } else {
        if (flight.elapsed >= flight.duration) {
          flight.from = { ...flight.position };
          // A fresh, bounded route each time, with a tangent matching the previous arrival.
          flight.to = { x: random(-64, 72) * scale, y: random(-38, 30) * scale };
          flight.c1 = { x: flight.from.x + Math.cos(flight.heading) * 25 * scale, y: flight.from.y + Math.sin(flight.heading) * 20 * scale };
          flight.c2 = { x: flight.to.x + random(-28, 28) * scale, y: flight.to.y + random(-25, 25) * scale };
          flight.duration = random(2200, 4700);
          flight.elapsed = 0;
          facing.style.setProperty("--wing-speed", `${random(.32, .52)}s`);
        }
        flight.elapsed = Math.min(flight.duration, flight.elapsed + dt);
        const t = flight.elapsed / flight.duration;
        const u = 1 - t;
        const { from: a, c1: b, c2: c, to: d } = flight;
        const px = u ** 3 * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t ** 3 * d.x;
        const py = u ** 3 * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t ** 3 * d.y;
        const dx = 3 * u * u * (b.x - a.x) + 6 * u * t * (c.x - b.x) + 3 * t * t * (d.x - c.x);
        const dy = 3 * u * u * (b.y - a.y) + 6 * u * t * (c.y - b.y) + 3 * t * t * (d.y - c.y);
        flight.position = { x: px, y: py };
        flight.heading = Math.atan2(dy, dx);
        node.style.transform = `translate3d(${px}px, ${py}px, 0)`;
        // The source butterfly faces left. Mirror only the artwork, never its flight path.
        if (Math.abs(dx) > .3) {
          const direction = dx > 0 ? -1 : 1;
          node.dataset.facing = dx > 0 ? "right" : "left";
          facing.style.transform = `scaleX(${direction}) rotate(${clamp(-dy / Math.max(Math.abs(dx), 8) * 12, -20, 20)}deg)`;
        }
        if (flight.elapsed >= flight.duration) {
          flight.rest = random(250, 1500);
          facing.style.setProperty("--wing-speed", `${random(.7, 1)}s`);
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); };
  }, [running]);

  return <span ref={ref} className="hero-mote hero-butterfly" data-facing="left" style={{ left: `${x}%`, top: `${y}%`, width: `${width}%`, "--wing-phase": `${index * -.137}s` } as CSSProperties}>
    <span><img src="/hero-atmosphere/butterfly-open.webp" alt="" draggable={false} /><img src="/hero-atmosphere/butterfly-folded.webp" alt="" draggable={false} /></span>
  </span>;
}
