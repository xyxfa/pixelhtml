import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMotionPreference } from "@/contexts/MotionContext";
import { getPreviewCompanion, ideasCompanionVariants, type IdeasCompanionVariant } from "./ideasCompanionVariants";
import "./IdeasCompanion.css";

const seenKey = "xyxya-ideas-nav-inspiration-v3-seen";
type Phase = "idle" | "notice" | "lift" | "hold" | "release";

// One progress value moves the original bulb, label and attached paw together.
export default function IdeasCompanion({ label, onClick, variant = getPreviewCompanion(), autoPlay = false }: { label: string; onClick: () => void; variant?: IdeasCompanionVariant; autoPlay?: boolean }) {
  const { i18n } = useTranslation();
  const { paused, reduced, running } = useMotionPreference();
  const colors = ideasCompanionVariants.find(item => item.id === variant)!;
  const scene = useRef<HTMLSpanElement>(null);
  const progress = useRef(0);
  const elapsed = useRef(0);
  const interacting = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const engaged = hovered || focused;
  const [phase, setPhase] = useState<Phase>(() => {
    if (paused || reduced) return "idle";
    if (autoPlay) return "notice";
    try { return sessionStorage.getItem(seenKey) === "true" ? "idle" : "notice"; } catch { return "notice"; }
  });

  const remember = useCallback(() => {
    try { sessionStorage.setItem(seenKey, "true"); } catch { /* Storage is optional. */ }
  }, []);
  const enter = useCallback((next: Phase) => {
    elapsed.current = 0;
    setPhase(next);
  }, []);

  useEffect(() => {
    if (!running) return;
    if (engaged) {
      interacting.current = true;
      remember();
      enter(progress.current === 1 ? "hold" : "lift");
    } else if (interacting.current) {
      interacting.current = false;
      enter("release");
    }
  }, [engaged, running, enter, remember]);

  useEffect(() => {
    if (!reduced) return;
    progress.current = 0;
    scene.current?.style.setProperty("--ideas-progress", "0");
    enter("idle");
  }, [reduced, enter]);

  useEffect(() => {
    if (!running || engaged || phase !== "idle") return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        // Desktop and mobile menus share the component; only the visible one invites.
        if (scene.current?.getClientRects().length) enter("notice");
        else schedule();
      }, 3000 + Math.random() * 2000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [phase, running, engaged, enter]);

  useEffect(() => {
    if (!running || phase === "idle" || (phase === "hold" && engaged)) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(now - previous, 64);
      previous = now;
      elapsed.current += delta;
      if (phase === "lift" || phase === "release") {
        const direction = phase === "lift" ? 1 : -1;
        progress.current = Math.max(0, Math.min(1, progress.current + direction * delta / 480));
        // Pixel-sized steps; reversing retains the current position instead of jumping.
        scene.current?.style.setProperty("--ideas-progress", String(Math.round(progress.current * 10) / 10));
        if (progress.current === (direction === 1 ? 1 : 0)) {
          enter(direction === 1 ? "hold" : "idle");
          if (direction === -1) remember();
          return;
        }
      } else if (elapsed.current >= (phase === "notice" ? 1200 : 2200)) {
        enter(phase === "notice" ? "lift" : "release");
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, running, engaged, enter, remember]);

  return <button type="button" className="ideas-nav-guide" onClick={() => { remember(); onClick(); }}
    onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(true); }}
    onPointerLeave={() => setHovered(false)} onPointerCancel={() => setHovered(false)}
    onFocus={event => setFocused(event.currentTarget.matches(":focus-visible"))} onBlur={() => setFocused(false)} aria-label={label}
    data-running={running} data-phase={phase} data-animal={variant}
    style={{ "--paw-edge": colors.edge, "--paw-fur": colors.fur } as CSSProperties}>
    <span ref={scene} className="ideas-nav-scene">
      <Lightbulb className="ideas-nav-bulb" aria-hidden="true" />
      <span className="ideas-nav-sparks" aria-hidden="true"><i /><i /></span>
      <span className="ideas-nav-label">
      <span className="ideas-nav-carry"><span className="ideas-nav-text">{label}</span>
        <svg className="ideas-nav-holding-paw" viewBox="0 0 4 5" shapeRendering="crispEdges" aria-hidden="true">
          <path d="M1 0H3V1H4V4H3V5H1V4H0V1H1Z" fill={colors.edge} />
          <path d="M1 1H3V4H1Z" fill={colors.fur} />
          <path d="M2 1H4V2H2Z" fill={colors.fur} />
          <path d="M1 1H2V2H1Z" fill="#ffffff" opacity=".35" />
        </svg>
      </span>
      <span className="ideas-nav-forearm" aria-hidden="true" />
      <span className="ideas-nav-cat" aria-hidden="true">
        {(variant === "black-cat" || variant === "cream-cat") && <svg className="ideas-nav-tail" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
          <path d="M11 12H14V8H16V13H15V14H11Z" fill={colors.edge} />
          <path d="M12 12H14V10H15V13H12Z" fill={colors.fur} />
        </svg>}
        <img src={`/ideas-guide/${variant}-open.svg`} width="32" height="32" alt="" draggable={false} />
      </span>
      <span className="ideas-nav-thought" aria-hidden="true"><i /><i /><i /></span>
      <span className="ideas-nav-whisper" aria-hidden="true">{i18n.language.startsWith("en") ? "I've got a fun idea!" : "我想到个好玩的！"}</span>
      </span>
    </span>
  </button>;
}
