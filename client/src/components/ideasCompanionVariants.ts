export const ideasCompanionVariants = [
  { id: "cream-cat", name: "奶油猫", mood: "温软 · 好奇", color: "#f4e2bf", fur: "#f5dcac", edge: "#655047" },
  { id: "black-cat", name: "煤球猫", mood: "安静 · 神秘", color: "#ddd9e8", fur: "#535064", edge: "#322e3e" },
  { id: "bunny", name: "糯米兔", mood: "轻盈 · 软糯", color: "#f4dfe6", fur: "#fff1e3", edge: "#766176" },
  { id: "shiba", name: "吐司柴", mood: "元气 · 亲近", color: "#efdcc5", fur: "#d69a5e", edge: "#715142" },
  { id: "fox", name: "枫糖狐", mood: "机灵 · 冒险", color: "#f0d6c6", fur: "#d67e4e", edge: "#70463f" },
  { id: "frog", name: "苔苔蛙", mood: "悠闲 · 自然", color: "#dce5c8", fur: "#9dbb78", edge: "#48695b" },
  { id: "dragon", name: "葡萄龙", mood: "幻想 · 小怪物", color: "#e3dbef", fur: "#afa0ce", edge: "#665373" },
  { id: "duck", name: "蛋黄鸭", mood: "呆萌 · 轻快", color: "#f5e9b9", fur: "#f0cd76", edge: "#82623e" },
] as const;

export type IdeasCompanionVariant = typeof ideasCompanionVariants[number]["id"];

export function getPreviewCompanion(): IdeasCompanionVariant {
  if (import.meta.env.DEV) {
    const requested = new URLSearchParams(window.location.search).get("companion");
    return ideasCompanionVariants.find(item => item.id === requested)?.id ?? "black-cat";
  }
  return "black-cat";
}
