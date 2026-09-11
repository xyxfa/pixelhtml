import { useEffect, useState } from "react";

export const cuteBackgrounds = [
  "/tech-journal/console-background-options/01-cream-console-island.png",
  "/tech-journal/console-background-options/02-mint-arcade-garden.png",
  "/tech-journal/console-background-options/03-crafted-dev-corner.png",
  "/tech-journal/console-background-options/04-monster-island.png",
  "/tech-journal/console-background-options/03-peach-console-sunset.png",
];

const backgroundNames = ["奶油掌机浮岛", "薄荷街机花园", "手绘像素 · 开发角落", "可爱怪物浮岛", "蜜桃落日 · 原版对比"];
const STORAGE_KEY = "xyxya-preview-background-console-v3";

export function usePreviewBackground() {
  const [selected, setSelected] = useState(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const saved = stored === null ? 2 : Number(stored);
    return Number.isInteger(saved) && saved >= 0 && saved < cuteBackgrounds.length ? saved : 2;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(selected));
  }, [selected]);

  return { background: cuteBackgrounds[selected], selected, setSelected };
}

export default function BackgroundPreviewSwitcher({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  return (
    <div className="background-preview-switcher" aria-label="临时背景预览">
      <span>背景预览</span>
      {cuteBackgrounds.map((_, index) => (
        <button key={index} type="button" title={backgroundNames[index]} aria-label={backgroundNames[index]} aria-pressed={selected === index} className={selected === index ? "is-active" : ""} onClick={() => onSelect(index)}>
          {String(index + 1).padStart(2, "0")}
        </button>
      ))}
    </div>
  );
}
