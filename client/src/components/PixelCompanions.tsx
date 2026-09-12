import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { PawPrint, Pause, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMotionPreference } from "@/contexts/MotionContext";
import "./PixelCompanions.css";

type Visitor = { id: number; animal: string; side: string; position: number; duration: number };
type Burst = { id: number; x: number; y: number };
const animals = ["cat", "bunny", "dragon"];
const companionArt = "/anime-companions";
const sides = ["left", "right", "bottom"];
const random = (min: number, max: number) => min + Math.random() * (max - min);

export default function PixelCompanions() {
  const { paused, reduced, running, toggle } = useMotionPreference();
  const { i18n } = useTranslation();
  const zh = !i18n.language.startsWith("en");
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [greeting, setGreeting] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [hold, setHold] = useState<{ x: number; y: number } | null>(null);
  const [reaction, setReaction] = useState<"hello" | "pet" | "called">("hello");
  const visitorRef = useRef<HTMLButtonElement>(null);
  const petting = useRef({ x: 0, y: 0, distance: 0, last: -Infinity });
  const serial = useRef(0);
  const nextDelay = useRef(900);
  const lastAnimal = useRef(-1);
  const lastSide = useRef(-1);
  const greetingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const greet = useCallback((kind: "hello" | "pet" | "called" = "hello") => {
    if (!running) return;
    clearTimeout(greetingTimer.current);
    setReaction(kind);
    setGreeting(true);
    greetingTimer.current = setTimeout(() => setGreeting(false), kind === "called" ? 6500 : 2400);
  }, [running]);

  const summon = useCallback((x = window.innerWidth / 2, y = window.innerHeight) => {
    if (!running) return;
    const distances = [x, window.innerWidth - x, window.innerHeight - y];
    const side = distances.indexOf(Math.min(...distances));
    const animal = (lastAnimal.current + 1) % animals.length;
    const position = side === 2 ? Math.max(20, Math.min(70, x / window.innerWidth * 100 - 7)) : Math.max(25, Math.min(72, y / window.innerHeight * 100 - 5));
    lastAnimal.current = animal;
    lastSide.current = side;
    setVisitor({ id: ++serial.current, animal: animals[animal], side: sides[side], position, duration: 10 });
    setHold(null);
    greet("called");
  }, [running, greet]);

  useEffect(() => {
    // Decode the small expression sheets before the first visitor appears.
    for (const animal of animals) for (const expression of ["open", "blink", "wave"]) {
      const image = new Image();
      image.src = `${companionArt}/${animal}-${expression}.webp`;
    }
    return () => clearTimeout(greetingTimer.current);
  }, []);

  useEffect(() => {
    if (!running || visitor) return;
    const timer = setTimeout(() => {
      const animal = (lastAnimal.current + 1 + Math.floor(Math.random() * 2)) % animals.length;
      const side = (lastSide.current + 1 + Math.floor(Math.random() * 2)) % sides.length;
      lastAnimal.current = animal;
      lastSide.current = side;
      setGreeting(false);
      setVisitor({ id: ++serial.current, animal: animals[animal], side: sides[side], position: side === 2 ? random(35, 65) : random(44, 69), duration: random(8, 10) });
      nextDelay.current = random(1800, 3500);
    }, nextDelay.current);
    return () => clearTimeout(timer);
  }, [running, visitor]);

  useEffect(() => {
    if (!running) { setBursts([]); return; }
    let last = 0;
    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (!event.isPrimary || event.button !== 0 || !(target instanceof Element)) return;
      if (target.closest("button, a, input, textarea, select, video, iframe, [role='button'], [contenteditable], [role='dialog']")) return;
      if (performance.now() - last < 180) return;
      last = performance.now();
      setBursts(items => [...items.slice(-3), { id: ++serial.current, x: event.clientX, y: event.clientY }]);
    };
    window.addEventListener("pointerdown", onPointer, { passive: true });
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [running]);

  useEffect(() => {
    if (!running) { setHold(null); return; }
    let timer: ReturnType<typeof setTimeout> | undefined;
    let origin: { x: number; y: number; id: number } | null = null;
    const cancel = () => { clearTimeout(timer); origin = null; setHold(null); };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || !(event.target instanceof Element)) return;
      if (event.target.closest("button,a,input,textarea,select,video,iframe,[role='button'],[contenteditable],[role='dialog'],p,h1,h2,h3,label,summary")) return;
      cancel();
      origin = { x: event.clientX, y: event.clientY, id: event.pointerId };
      setHold({ x: origin.x, y: origin.y });
      timer = setTimeout(() => { if (origin) summon(origin.x, origin.y); origin = null; }, 750);
    };
    const move = (event: PointerEvent) => {
      if (origin && (event.pointerId !== origin.id || Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 10)) cancel();
    };
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", cancel);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("scroll", cancel, { passive: true });
    window.addEventListener("blur", cancel);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", cancel);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("scroll", cancel);
      window.removeEventListener("blur", cancel);
    };
  }, [running, summon]);

  useEffect(() => {
    if (!running || !visitor) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX; y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const node = visitorRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const dx = (x - rect.x - rect.width / 2) / 65;
        const dy = (y - rect.y - rect.height / 2) / 65;
        const localX = visitor.side === "left" ? dy : visitor.side === "right" ? -dy : dx;
        const localY = visitor.side === "left" ? -dx : visitor.side === "right" ? dx : dy;
        node.style.setProperty("--look-x", `${Math.max(-5, Math.min(5, localX))}px`);
        node.style.setProperty("--look-y", `${Math.max(-4, Math.min(4, localY))}px`);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(frame); };
  }, [running, visitor]);

  return <>
    {!reduced && <div className="pixel-world-overlay" data-running={running}>
      {visitor && <button ref={visitorRef} key={visitor.id} type="button" className={`pixel-visitor pixel-visitor-${visitor.side}`} data-greeting={greeting} data-reaction={reaction} style={{ "--peek-position": `${visitor.position}%`, "--peek-duration": `${visitor.duration}s` } as CSSProperties} aria-label={zh ? "和像素小伙伴打招呼" : "Say hello to your pixel friend"} onClick={() => greet()} onPointerEnter={event => { petting.current.x = event.clientX; petting.current.y = event.clientY; petting.current.distance = 0; }} onPointerMove={event => {
        if (!running || event.pointerType !== "mouse") return;
        const pet = petting.current;
        pet.distance += Math.hypot(event.clientX - pet.x, event.clientY - pet.y);
        pet.x = event.clientX; pet.y = event.clientY;
        if (pet.distance > 55 && performance.now() - pet.last > 2600) { pet.distance = 0; pet.last = performance.now(); greet("pet"); }
      }} onAnimationEnd={event => {
        if (event.target === event.currentTarget) setVisitor(null);
      }}>
        <span className="pixel-visitor-art" aria-hidden="true">
          <span className="visitor-gaze">
          <img className="visitor-open" src={`${companionArt}/${visitor.animal}-open.webp`} alt="" draggable={false} />
          <img className="visitor-blink" src={`${companionArt}/${visitor.animal}-blink.webp`} alt="" draggable={false} />
          <img className="visitor-wave" src={`${companionArt}/${visitor.animal}-wave.webp`} alt="" draggable={false} />
          </span>
        </span>
        {greeting && <span className="visitor-hearts" aria-hidden="true"><i /><i /><i /></span>}
        {greeting && <span className="visitor-speech" aria-hidden="true">{reaction === "pet" ? (zh ? "贴贴 ♡" : "♡ Purrr") : reaction === "called" ? (zh ? "来啦～" : "Here! ♡") : "(｡･ω･｡)ﾉ"}</span>}
      </button>}
      {hold && <span className="companion-summon-ring" style={{ left: hold.x, top: hold.y }} aria-hidden="true"><PawPrint /><span>{zh ? "召唤中" : "Calling"}</span></span>}
      <div className="pixel-edge-glimmers" aria-hidden="true">
        {[0, 1, 2, 3].map(index => <img key={index} src="/hero-atmosphere/spark-cyan.webp" alt="" style={{ "--glimmer-delay": `${index * -3.7}s`, top: `${25 + index * 18}%`, [index % 2 ? "right" : "left"]: `${12 + index * 4}px` } as CSSProperties} />)}
      </div>
      {bursts.map(burst => <span key={burst.id} className="pixel-click-burst" aria-hidden="true" style={{ left: burst.x, top: burst.y }} onAnimationEnd={event => { if (event.target === event.currentTarget) setBursts(items => items.filter(item => item.id !== burst.id)); }}>
        {Array.from({ length: 6 }, (_, index) => <i key={index} style={{ "--star-x": `${Math.cos(index * Math.PI / 3) * 34}px`, "--star-y": `${Math.sin(index * Math.PI / 3) * 34}px`, "--star-turn": `${index * 30}deg` } as CSSProperties} />)}
      </span>)}
    </div>}
    {!reduced && <button className="pixel-world-toggle" type="button" aria-label={zh ? (paused ? "开启全站动效和小伙伴" : "暂停全站动效和小伙伴") : (paused ? "Enable site motion and companions" : "Pause site motion and companions")} aria-pressed={paused} onClick={toggle} title={zh ? "全站动效开关" : "Site motion"}>
      <PawPrint aria-hidden="true" /><span>{zh ? "动效" : "Motion"}</span>{paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
    </button>}
    {!reduced && <button type="button" className="pixel-summon-button" disabled={!running} onClick={() => summon()} aria-label={zh ? "召唤小伙伴" : "Call a companion"} title={zh ? "召唤小伙伴，也可以长按空白处" : "Call a friend, or hold an empty spot"}><PawPrint aria-hidden="true" /><span>{zh ? "召唤" : "Call"}</span></button>}
  </>;
}
