import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import type { IdeaLocale } from "@/ideaData";
import "./NoitaDiagram.css";

export type NoitaDiagramKind = "components" | "bfs" | "wake";
const wood = [
  { id: "A", x: 5, y: 6 }, { id: "B", x: 5, y: 5 },
  { id: "C", x: 5, y: 4 }, { id: "X", x: 6, y: 4 },
  { id: "D", x: 7, y: 4 }, { id: "E", x: 7, y: 5 }, { id: "F", x: 7, y: 6 },
];
// States follow the source's mark-on-enqueue BFS on the illustrated split structure.
const traversal = [
  { current: "", done: "", queue: ["A"], group: 1, anchored: false },
  { current: "A", done: "A", queue: ["B"], group: 1, anchored: true },
  { current: "B", done: "AB", queue: ["C"], group: 1, anchored: true },
  { current: "C", done: "ABC", queue: [], group: 1, anchored: true },
  { current: "", done: "ABC", queue: ["F"], group: 2, anchored: false },
  { current: "F", done: "ABCF", queue: ["E"], group: 2, anchored: false },
  { current: "E", done: "ABCFE", queue: ["D"], group: 2, anchored: false },
  { current: "D", done: "ABCFED", queue: [], group: 2, anchored: false },
];

function Pixel({ x, y, material, label, state = "" }: { x: number; y: number; material: string; label?: string; state?: string }) {
  return <g transform={`translate(${x * 36},${y * 28})`} className={`nd-pixel nd-${material} ${state}`}>
    <rect width="36" height="28" rx="1" className="nd-face" />
    <path d="M2 26V2H34" className="nd-light" fill="none" strokeWidth="2" />
    {material === "wood" && <path d="M5 8h12m5 0h9M4 20h9m5 0h13M26 12h5" className="nd-grain" strokeWidth="2" />}
    {material === "stone" && <path d="M4 9h11m4 12h13M20 4v6" stroke="#91a09f" opacity=".6" strokeWidth="2" />}
    {material === "water" && <path d="M3 7h17m4 0h8" stroke="#b8f2fa" strokeWidth="2" opacity=".8" />}
    {label && <><rect x="9" y="4" width="18" height="20" rx="2" fill="#fff9e5" opacity=".9"/><text x="18" y="20" textAnchor="middle" fill="#24352d" fontSize="17" fontWeight="800" fontFamily="Consolas, monospace">{label}</text></>}
  </g>;
}

function Scene({ kind, step, zh }: { kind: NoitaDiagramKind; step: number; zh: boolean }) {
  const water = kind === "wake";
  const state = traversal[Math.min(step, 7)];
  const cut = kind === "bfs" || step > 0;
  const fallen = kind === "components" && step === 2;
  const label = water ? (zh ? "像素水池与出水口" : "Pixel reservoir and outlet") : (zh ? "像素木桥、石头支撑与地面" : "Pixel bridge, stone support and ground");
  return <svg className={`nd-scene ${water ? "nd-water-scene" : "nd-wood-scene"}`} viewBox={water ? "36 84 540 252" : "108 84 288 252"} role="img" aria-label={label}>
    <rect width="648" height="336" fill="#edf4f3" />
    {Array.from({ length: 19 }, (_, i) => <path key={`v${i}`} d={`M${i * 36} 0v336`} stroke="#d8e5e1" strokeWidth=".6" />)}
    {Array.from({ length: 13 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 28}h648`} stroke="#d8e5e1" strokeWidth=".6" />)}
    {Array.from({ length: 18 }, (_, x) => <Pixel key={`floor${x}`} x={x} y={11} material="stone" />)}
    {water ? <>
      {Array.from({ length: 4 }, (_, r) => [2, 14].map(x => <Pixel key={`wall${r}-${x}`} x={x} y={4+r} material="stone" />))}
      {Array.from({ length: 13 }, (_, i) => i + 2).filter(x => !(step > 0 && x === 12)).map(x => <Pixel key={`base${x}`} x={x} y={8} material="stone" />)}
      {Array.from({ length: 3 }, (_, r) => Array.from({ length: 11 }, (_, c) => ({ x: c+3, y: r+5 }))).flat().filter(p => !(step === 2 && (p.y === 5 || (p.x === 12 && p.y === 7)))).map(p => <Pixel key={`w${p.x}-${p.y}`} {...p} material="water" />)}
      {step === 2 && [8,9,10].map(y => <Pixel key={`drop${y}`} x={12} y={y} material="water" />)}
      {step === 2 && [10,11,13,14].map(x => <Pixel key={`spill${x}`} x={x} y={10} material="water" />)}
      <rect x="108" y="140" width="36" height="28" fill="none" stroke="#75509b" strokeWidth="3" />
      <rect x="432" y="224" width="36" height="28" fill="none" stroke="#c4545a" strokeWidth="3" strokeDasharray={step ? "4 3" : undefined} />
      {step === 1 && <path d="M450 116H126m0 0 12-10m-12 10 12 10" stroke="#c4545a" strokeWidth="3" fill="none" />}
    </> : <>
      {[7,8,9,10].map(y => <Pixel key={`support${y}`} x={5} y={y} material="stone" />)}
      {wood.filter(p => !(cut && p.id === "X")).map(p => {
        const right = "DEF".includes(p.id);
        const status = kind === "bfs" ? state.current === p.id ? "nd-current" : state.queue.includes(p.id) ? "nd-queued" : state.done.includes(p.id) ? "nd-visited" : "" : cut ? right ? "nd-detached" : "nd-anchored" : "";
        return <Pixel key={p.id} x={p.x} y={p.y+(fallen && right ? 4 : 0)} label={p.id} material="wood" state={status} />;
      })}
      {cut && <rect x="217" y="113" width="34" height="26" fill="#fbe5df" stroke="#ca6762" strokeDasharray="4 3" />}
      {kind === "components" && step === 1 && <path d="M290 211v48m0 0-9-11m9 11 9-11" stroke="#9c647f" strokeWidth="3" fill="none" />}
      {fallen && <path d="M254 120v92m33-92v92" stroke="#b496a2" strokeDasharray="3 6" />}
    </>}
  </svg>;
}

export default function NoitaDiagram({ kind, locale }: { kind: NoitaDiagramKind; locale: IdeaLocale }) {
  const zh = locale === "zh";
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const max = kind === "bfs" ? 7 : 2;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setStep(s => Math.min(max, s+1)), 1250);
    return () => window.clearInterval(timer);
  }, [playing, max]);
  useEffect(() => { if (step === max) setPlaying(false); }, [step, max]);
  const t = (cn: string, en: string) => zh ? cn : en;
  const titles = {
    components: t("一格烧断，哪一块会掉？", "One cell burns. What falls?"),
    bfs: t("沿着木格，把同一块找全", "Follow the wood, find the whole piece"),
    wake: t("出口打开，远处的水醒了", "An opening wakes the distant water"),
  };
  const modes = kind === "components" ? [t("完整木桥", "Intact"),t("烧掉 X", "Remove X"),t("检查后下落", "After falling")] : [t("水面静止", "At rest"),t("打开出口", "Open outlet"),t("继续流动", "Flow resumes")];
  const notes = kind === "components" ? [
    t("7 个木格连在一起，左侧的石柱固定住整座小桥。", "Seven connected wood cells form one piece, anchored by the stone pillar."),
    t("X 消失后，右侧 D、E、F 断开。先检查它们下面有没有阻挡。", "Removing X disconnects D, E and F. Their downward path must be checked next."),
    t("右侧逐步下落，碰到地面后停住；A、B、C 留在石柱上。", "The right piece falls over successive ticks and stops on the floor. A, B and C stay anchored."),
  ] : [
    t("水已经停稳。紫框这格水的移动判断，也可能依赖远处的出口。", "Water is settled. The purple cell's movement can depend on a distant outlet."),
    t("红框石块被移除。出口变化后，远处的水也需要重新检查。", "The red stone cell is removed. Water farther away needs reevaluation too."),
    t("水重新找到低处，开始排出。这里展示的是规则关系，不是流量计算。", "Water finds a lower opening and drains. This scene illustrates the rule, not a flow-rate calculation."),
  ];
  const state = traversal[step];
  const bfsNotes = [
    t("找到未标记的 A，把它放进队列。", "Start a new component by enqueueing A."),
    t("取出 A：发现石柱支撑；标记 B，再把 B 入队。", "Visit A: detect stone support, mark B and enqueue it."),
    t("取出 B：A 已有标记，只把新发现的 C 入队。", "Visit B: A is marked already. Enqueue only the newly found C."),
    t("取出 C 后队列为空。第一块找到：A、B、C。", "After C, the queue is empty. The first piece contains A, B and C."),
    t("继续扫描，遇到 F，开始寻找第二块。", "Continue the grid scan. F starts the second component."),
    t("取出 F，标记相邻的 E，再让 E 入队。", "Visit F, mark its neighbor E, then enqueue E."),
    t("取出 E，发现 D；F 已经检查过。", "Visit E and discover D. F has already been visited."),
    t("第二块找到：F、E、D。没有固定支撑，接着检查下落空间。", "The second piece is F, E and D. It has no fixed anchor, so check downward clearance."),
  ];
  return <figure className="noita-diagram" aria-label={titles[kind]}>
    <div className="nd-heading"><span className="nd-kicker">{kind === "wake" ? "03 / WAKE" : kind === "bfs" ? "02 / BFS" : "01 / CONNECTIVITY"}</span><h3>{titles[kind]}</h3><span className="nd-schematic">{t("像素场景示意", "Pixel scene study")}</span></div>
    {kind !== "bfs" && <div className="nd-modes" role="group" aria-label={t("场景阶段", "Scene stage")}>{modes.map((m,i) => <button key={m} type="button" aria-pressed={step===i} onClick={() => setStep(i)}><span>0{i+1}</span>{m}</button>)}</div>}
    <div className="nd-stage"><Scene kind={kind} step={step} zh={zh} /></div>
    <div className="nd-legend">{(kind === "bfs" ? [["current",t("正在检查", "Current")],["queued",t("等待检查", "Queued")],["visited",t("已经找到", "Found")]] : kind === "wake" ? [["water",t("水", "Water")],["stone",t("石块", "Stone")],["detached",t("出口", "Outlet")]] : [["wood",t("木格", "Wood")],["stone",t("固定支撑", "Stone anchor")],["detached",t("断开的部分", "Detached")]]).map(([color,label]) => <span key={color}><i className={`nd-swatch-${color}`} />{label}</span>)}</div>
    {kind === "bfs" && <>
      <div className="nd-controls">
        <button type="button" title={t("重新开始", "Restart")} aria-label={t("重新开始 BFS", "Restart BFS")} onClick={() => {setStep(0);setPlaying(false);}}><RotateCcw size={17}/></button>
        <button type="button" title={t("上一步", "Previous")} aria-label={t("BFS 上一步", "Previous BFS step")} disabled={step===0} onClick={() => {setStep(s=>s-1);setPlaying(false);}}><ArrowLeft size={17}/></button>
        <button type="button" title={playing?t("暂停", "Pause"):t("播放", "Play")} aria-label={playing?t("暂停 BFS", "Pause BFS"):t("播放 BFS", "Play BFS")} onClick={() => {if(step===max)setStep(0);setPlaying(p=>!p);}}>{playing?<Pause size={17}/>:<Play size={17}/>}</button>
        <button type="button" title={t("下一步", "Next")} aria-label={t("BFS 下一步", "Next BFS step")} disabled={step===max} onClick={() => {setStep(s=>s+1);setPlaying(false);}}><ArrowRight size={17}/></button>
        <input type="range" min="0" max={max} value={step} aria-label={t("BFS 进度", "BFS progress")} onChange={e=>{setStep(Number(e.target.value));setPlaying(false);}} />
        <output>{step+1}/8</output>
      </div>
      <div className="nd-queue"><span>{t("待检查队列", "Pending queue")}</span><div>{state.queue.length?state.queue.map(id=><b key={id}>{id}</b>):<em>{t("空", "Empty")}</em>}</div><small>{t(`分量 ${state.group}`, `Component ${state.group}`)} · {state.anchored?t("有支撑", "Anchored"):t("尚未发现支撑", "No anchor found")}</small></div>
    </>}
    <figcaption aria-live="polite">{kind === "bfs" ? bfsNotes[step] : notes[step]}</figcaption>
    {kind === "wake" && <div className="nd-chunk-strip"><div className="nd-chunk-grid" aria-label={t("相邻三行区块被唤醒", "Three chunk rows are awakened")}>{Array.from({length:60},(_,i)=><i key={i} className={step>0&&Math.floor(i/12)>=1&&Math.floor(i/12)<=3?i===34?"changed":"awake":""}/>)}</div><span>{step===0?t("沉降后，稳定区块可以休眠。", "Settled chunks can sleep."):t("代码保守唤醒相邻三行，覆盖远处可能受影响的水。", "Code conservatively wakes three neighboring rows, covering distant dependencies.")}</span></div>}
  </figure>;
}
