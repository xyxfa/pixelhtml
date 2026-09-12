import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMotionPreference } from "@/contexts/MotionContext";
import ButterflyFlight from "./ButterflyFlight";
import "./HeroAtmosphere.css";

const art = "/hero-atmosphere";
const sprites = [
  { kind: "cloud", file: "cloud-soft", x: 36, y: 8, width: 16, delay: -12, duration: 22 },
  { kind: "cloud", file: "cloud-wisp", x: 67, y: 14, width: 19, delay: -19, duration: 28 },
  { kind: "cloud", file: "cloud-wisp", x: 33, y: 34, width: 15, delay: -6, duration: 24 },
  { kind: "cloud", file: "cloud-wisp", x: 12, y: 5, width: 12, delay: -9, duration: 32 },
  { kind: "cloud", file: "cloud-soft", x: 51, y: 29, width: 10, delay: -16, duration: 26 },
  { kind: "leaf", file: "leaves", x: 16, y: 13, width: 2.5, delay: -3, duration: 12 },
  { kind: "leaf", file: "leaf", x: 22, y: 27, width: 1.8, delay: -8, duration: 14 },
  { kind: "leaf", file: "leaf", x: 94, y: 24, width: 1.7, delay: -7, duration: 11 },
  { kind: "leaf", file: "leaf", x: 8, y: 19, width: 1.6, delay: -5, duration: 13 },
  { kind: "leaf", file: "leaves", x: 88, y: 28, width: 2.3, delay: -10, duration: 15 },
  { kind: "leaf", file: "leaf", x: 28, y: 35, width: 1.6, delay: -4, duration: 12 },
  { kind: "leaf", file: "leaf", x: 39, y: 40, width: 1.6, delay: -9, duration: 14 },
  { kind: "leaf", file: "leaves", x: 61, y: 44, width: 2.1, delay: -2, duration: 13 },
  { kind: "leaf", file: "leaf", x: 29, y: 55, width: 1.5, delay: -6, duration: 12 },
  { kind: "portal", file: "portal-wisp", x: 7, y: 25.8, width: 2.2, delay: -1, duration: 3.6 },
  { kind: "spark", file: "spark-cyan", x: 9.5, y: 25.8, width: 1, delay: -2, duration: 3 },
  { kind: "spark", file: "spark-cyan", x: 6.1, y: 27.4, width: .85, delay: -1, duration: 4 },
  { kind: "spark", file: "spark-cyan", x: 8.3, y: 29, width: .75, delay: -3, duration: 3.5 },
  ...[
    [19, 30.5], [89, 32], [78, 34], [25, 43], [52, 46], [44, 62], [70, 59], [34, 33],
  ].map(([x, y], index) => ({ kind: "firefly", file: "firefly", x, y, width: .85, delay: -index * 1.3, duration: 5 + index % 3 })),
  ...[
    [67, 51.8], [73, 50.2], [61, 53.2], [40, 59], [32, 60], [26, 62],
  ].map(([x, y], index) => ({ kind: "water", file: "spark-cyan", x, y, width: 1.5, delay: -index * .7, duration: 3 + index % 3 })),
];

const butterflies = [
  { x: 18, y: 25.2, width: 2.5 },
  { x: 91, y: 29.5, width: 2.4 },
  { x: 40, y: 31, width: 2.2 },
  { x: 52, y: 43, width: 2.3 },
  { x: 34, y: 64, width: 2.1 },
];

export default function HeroAtmosphere() {
  const { i18n } = useTranslation();
  const zh = !i18n.language.startsWith("en");
  const ref = useRef<HTMLDivElement>(null);
  const { paused, reduced, running, toggle } = useMotionPreference();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let visible = false;
    const sync = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  return <>
    <div ref={ref} className="hero-atmosphere" aria-hidden="true" data-running={active && running}>
      <div className="hero-atmosphere-canvas">
        <span className="hero-portal-aura" />
        {sprites.map((sprite, index) => <span key={index} className={`hero-mote hero-mote-${sprite.kind}`} style={{ left: `${sprite.x}%`, top: `${sprite.y}%`, width: `${sprite.width}%`, "--mote-delay": `${sprite.delay}s`, "--mote-duration": `${sprite.duration}s` } as CSSProperties}>
          <img src={`${art}/${sprite.file}.webp`} alt="" draggable={false} />
        </span>)}
        {butterflies.map((butterfly, index) => <ButterflyFlight key={index} {...butterfly} index={index} running={active && running} />)}
      </div>
    </div>
    {!reduced && <button className="hero-motion-toggle" type="button" onClick={toggle} aria-pressed={paused} aria-label={paused ? (zh ? "播放全站动效" : "Play site animation") : (zh ? "暂停全站动效" : "Pause site animation")}>
      {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}<span>{zh ? (paused ? "播放动效" : "暂停动效") : (paused ? "Play motion" : "Pause motion")}</span>
    </button>}
  </>;
}
