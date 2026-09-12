import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useMotionPreference } from "@/contexts/MotionContext";
import { motionSample, motionVariation } from "./motionVariation";
import "./GameMotionScene.css";

export const gameSceneThemes = ["forge", "office", "duel", "food", "glitch", "music", "jade", "arcane"] as const;
type GameSceneTheme = typeof gameSceneThemes[number];
const art = (name: string, className = "") => <img className={className} src={`/themed-motion/${name}.webp`} alt="" draggable={false} />;
const prop = (name: string, className = "") => <img className={className} src={`/game-props/${name}.webp`} alt="" draggable={false} />;
const gameProps: Record<GameSceneTheme, readonly string[]> = {
  forge: ["piston", "wheel"], office: ["paper-plane", "stapler"], duel: ["fighter-cat", "impact"], food: ["apple", "burger"],
  glitch: ["portal", "data-shards"], music: ["headphones", "boombox"], jade: ["armillary", "constellation"], arcane: ["potion", "wand"],
};

export function GameGalleryMotion({ theme }: { theme: string }) {
  const { running } = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  if (!(gameSceneThemes as readonly string[]).includes(theme)) return null;
  return <div ref={ref} className="game-gallery-motion" aria-hidden="true" data-running={running && visible}><GameMotionScene theme={theme as GameSceneTheme} compact /></div>;
}

export default function GameMotionScene({ theme, compact = false }: { theme: GameSceneTheme; compact?: boolean }) {
  const borderRef = useRef<HTMLDivElement>(null);
  const [seed] = useState(() => Math.floor(Math.random() * 2147483647));
  const [height, setHeight] = useState(1200);
  useEffect(() => {
    if (!borderRef.current) return;
    const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    observer.observe(borderRef.current);
    return () => observer.disconnect();
  }, []);
  const rowCount = Math.max(3, Math.ceil((height - 180) / 270));
  return <>
    <div className={`game-mini-scene game-scene-${theme}`} data-game-scene={compact ? undefined : theme} data-gallery-scene={compact ? theme : undefined}>
      {theme === "forge" && <><span className="scene-conveyor" />{art("gear", "scene-gear-one")}{prop("wheel", "scene-gear-two")}{prop("piston", "scene-lift-block")}<span className="scene-lift" /><span className="scene-weld"><i /><i /><i /></span></>}
      {theme === "office" && <><span className="scene-desk" />{art("coffee", "scene-desk-cup")}{art("document", "scene-paper-one")}{prop("stapler", "scene-stapler")}{prop("paper-plane", "scene-mail-flight")}<span className="scene-coffee-steam"><i /><i /></span></>}
      {theme === "duel" && <>{prop("fighter-cat", "scene-player-one")}<span className="scene-player-two">{prop("fighter-cat")}</span><span className="scene-duel-platform" /><span className="scene-hit"><i /><i /><i /></span>{prop("impact", "scene-duel-star")}</>}
      {theme === "food" && <><span className="scene-food-floor" />{prop("apple", "scene-carrot-one")}{prop("burger", "scene-carrot-two")}<span className="scene-muncher"><i /></span><span className="scene-food-crumbs"><i /><i /><i /><i /></span></>}
      {theme === "glitch" && <><span className="scene-glitch-gate scene-gate-left">{prop("portal")}</span><span className="scene-glitch-gate scene-gate-right">{prop("portal")}</span>{art("ghost", "scene-ghost")}<span className="scene-glitch-fragments">{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ "--piece": i } as CSSProperties} />)}</span></>}
      {theme === "music" && <><span className="scene-music-bars">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ "--beat-delay": `${i * -.21}s`, "--bar-height": `${16 + (i * 13 % 29)}px` } as CSSProperties} />)}</span>{art("notes", "scene-note-one")}{art("notes", "scene-note-two")}<span className="scene-sound-ring" /></>}
      {theme === "jade" && <><span className="scene-astrolabe"><i /><i /><i /></span>{prop("armillary", "scene-jade-center")}<span className="scene-star-orbit">{art("star")}</span><span className="scene-jade-satellite">{art("bulb")}</span></>}
      {theme === "arcane" && <><span className="scene-magic-seal" />{art("spellbook", "scene-magic-book")}<span className="scene-turning-page" /><span className="scene-rune-one">{prop("potion")}</span><span className="scene-rune-two">{prop("wand")}</span><span className="scene-magic-dust"><i /><i /><i /></span></>}
    </div>
    {!compact && <div ref={borderRef} className={`game-scene-border game-scene-border-${theme}`}>
      {Array.from({ length: rowCount * 2 }, (_, i) => {
        const sample = (channel: number) => motionSample(seed, i, channel);
        // Jitter inside height bands keeps the lower galleries populated without rows of matching pairs.
        const top = 130 + Math.floor(i / 2) * (height - 220) / Math.max(1, rowCount - 1) + (sample(11) - .5) * 108;
        return <span key={i} style={{
          ...motionVariation(seed, i),
          top: `${top}px`,
          [i % 2 ? "right" : "left"]: `calc(var(--game-motion-inset) + ${(sample(12) * 28).toFixed(1)}px)`,
          "--prop-scale": (.78 + sample(13) * .3).toFixed(2),
        } as CSSProperties}>{prop(gameProps[theme][(i + Math.floor(i / 2)) % 2])}</span>;
      })}
    </div>}
  </>;
}
