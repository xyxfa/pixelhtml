import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useMotionPreference } from "@/contexts/MotionContext";
import "./ThemedMotion.css";
import GameMotionScene, { gameSceneThemes } from "./GameMotionScene";
import { motionSample, motionVariation } from "./motionVariation";

export const motionThemes = {
  forge: { sprite: "gear", accent: "#d99a60", motion: "gear", detail: "sparks" },
  office: { sprite: "coffee", accent: "#bf9373", motion: "cup", detail: "steam" },
  duel: { sprite: "cube", accent: "#81bdcc", motion: "cube", detail: "squares" },
  food: { sprite: "carrot", accent: "#e9b260", motion: "hop", detail: "sparks" },
  glitch: { sprite: "ghost", accent: "#b29cd5", motion: "glitch", detail: "squares" },
  music: { sprite: "notes", accent: "#da9fb7", motion: "notes", detail: "equalizer" },
  jade: { sprite: "jade", accent: "#8dcab7", motion: "jade", detail: "orbit" },
  arcane: { sprite: "spellbook", accent: "#bfa0dc", motion: "book", detail: "orbit" },
  ideas: { sprite: "bulb", accent: "#d6b064", motion: "bulb", detail: "rays" },
  map: { sprite: "marker", accent: "#78b7b1", motion: "marker", detail: "path" },
  shader: { sprite: "prism", accent: "#ad9bdb", motion: "prism", detail: "beam" },
  recruiting: { sprite: "document", accent: "#7fa99b", motion: "document", detail: "circuit" },
  notes: { sprite: "quill", accent: "#9cac81", motion: "quill", detail: "writing" },
  guestbook: { sprite: "bubble", accent: "#9abfa8", motion: "bubble", detail: "dots" },
  contact: { sprite: "envelope", accent: "#d9a58d", motion: "letter", detail: "post" },
  lost: { sprite: "star", accent: "#c5b47e", motion: "star", detail: "orbit" },
} as const;

export type MotionTheme = keyof typeof motionThemes;

function Motif({ theme }: { theme: MotionTheme }) {
  const { sprite, detail } = motionThemes[theme];
  return <>
    <span className={`theme-detail theme-detail-${detail}`}>
      <i /><i /><i /><i />
      {(detail === "path" || detail === "circuit" || detail === "post") && <svg viewBox="0 0 160 100" fill="none"><path d={detail === "circuit" ? "M10 80H52V48H108V20H150" : "M10 82C10 30 78 90 80 48S140 0 148 28"} /></svg>}
    </span>
    <img className="theme-main-sprite" src={`/themed-motion/${sprite}.webp`} alt="" draggable={false} decoding="async" />
  </>;
}

// The same artwork also makes a small, self-contained accent in the empty journal page.
export function ThemeEmblem({ theme }: { theme: MotionTheme }) {
  const { running } = useMotionPreference();
  return <span className={`theme-emblem theme-${theme}`} data-running={running} aria-hidden="true" style={{ "--theme-accent": motionThemes[theme].accent } as CSSProperties}><Motif theme={theme} /></span>;
}

export default function ThemedMotion({ theme }: { theme: MotionTheme }) {
  const { running, reduced } = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const [seed] = useState(() => Math.floor(Math.random() * 2147483647));
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const { accent, sprite } = motionThemes[theme];
  return <div ref={ref} className={`themed-motion theme-${theme}`} data-theme={theme} data-running={running && visible} aria-hidden="true" style={{ "--theme-accent": accent } as CSSProperties}>
    <div className="theme-corner"><Motif theme={theme} /></div>
    {(gameSceneThemes as readonly string[]).includes(theme) && <GameMotionScene theme={theme as typeof gameSceneThemes[number]} />}
    {!reduced && <>
      <span className="theme-orbiting-sprite" style={motionVariation(seed, 0)}><img src={`/themed-motion/${sprite}.webp`} alt="" draggable={false} /></span>
      <span className="theme-traveler" style={motionVariation(seed, 1)}><img src={`/themed-motion/${sprite}.webp`} alt="" draggable={false} /><i /><i /><i /></span>
      <span className="theme-edge theme-edge-a" style={{ ...motionVariation(seed, 2), top: `${24 + motionSample(seed, 2, 11) * 18}%` }}><img src={`/themed-motion/${sprite}.webp`} alt="" draggable={false} loading="lazy" /></span>
      <span className="theme-edge theme-edge-b" style={{ ...motionVariation(seed, 3), top: `${55 + motionSample(seed, 3, 11) * 20}%` }}><img src={`/themed-motion/${sprite}.webp`} alt="" draggable={false} loading="lazy" /></span>
      <span className="theme-edge theme-edge-c" style={{ ...motionVariation(seed, 4), top: `${78 + motionSample(seed, 4, 11) * 14}%` }}><img src="/hero-atmosphere/spark-cyan.webp" alt="" draggable={false} loading="lazy" /></span>
      <span className="theme-drift-dots"><i /><i /><i /></span>
    </>}
  </div>;
}
