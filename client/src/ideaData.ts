export type IdeaLocale = "zh" | "en";
export type IdeaCategory = "ai" | "interaction" | "graphics" | "automation";
type LocalizedText = Record<IdeaLocale, string>;

export interface IdeaProject {
  slug: string;
  number: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  summary?: LocalizedText;
  kind?: "technical";
  category: IdeaCategory;
  readingMinutes: number;
  publishedAt?: string;
  repositoryUrl?: string;
  technicalPoints: LocalizedText[];
  chapters?: { time: number; title: LocalizedText }[];
  tags: Record<IdeaLocale, string[]>;
  poster: string;
  video?: string;
  bilibiliId?: string;
  externalUrl?: string;
  duration?: string;
  background: string;
  galleryTitle?: LocalizedText;
  gallery: { image: string; title: LocalizedText; caption: LocalizedText }[];
}

const media = "/ideas/level-select";

export const ideaProjects: IdeaProject[] = [
  {
    slug: "echo-unity-ai",
    number: "04",
    kind: "technical",
    category: "ai",
    readingMinutes: 16,
    publishedAt: "2026-09-17",
    technicalPoints: [
      { zh: "异步作业幂等 / 取消栅栏，双层行为树协作", en: "Idempotent async jobs, cancellation fences and two behavior-tree layers" },
      { zh: "DAG 校验 + Utility AI 调度 + 幂等资源预约", en: "DAG validation, utility-based scheduling and idempotent reservations" },
      { zh: "来源可追溯 RAG、上下文选择与 GF(2) 解谜工具", en: "Source-traceable RAG, context selection and a GF(2) puzzle tool" },
    ],
    title: { zh: "ECHO：让多 Agent 在 Unity 中协作", en: "ECHO: multi-agent cooperation in Unity" },
    subtitle: { zh: "从 LLM 异步编排，到 Utility AI、行为树与可追溯记忆", en: "From asynchronous LLM orchestration to utility AI, behavior trees and traceable memory" },
    summary: {
      zh: "模型还在思考，战斗却不能停。从异步协商到任务承诺与资源预约，记录如何把 AI 的建议接入可执行、可中断的游戏系统。",
      en: "Combat cannot wait for models to think. From asynchronous negotiation to task commitments and resource reservations, connecting AI suggestions to interruptible game execution.",
    },
    description: {
      zh: "将角色对话、来源记忆与多 Agent 协作接入 Unity。模型提出规划与分工，本地调度和行为树负责规则校验、资源约束与现场执行。本文结合运行录屏，拆解从建议到实际行动的工程链路。",
      en: "Character dialogue, source-backed memory and multi-agent cooperation in Unity. Models propose plans and assignments; local scheduling and behavior trees enforce rules, resources and execution. This article follows the engineering path from suggestions to actions using runtime footage.",
    },
    tags: { zh: ["Unity / C#", "多 Agent", "行为树", "Python", "RAG"], en: ["Unity / C#", "Multi-agent", "Behavior trees", "Python", "RAG"] },
    poster: "/ideas/echo/poster.webp",
    video: "/ideas/echo/demo.mp4",
    duration: "04:35",
    background: "/ideas/level-select/background.webp",
    chapters: [
      { time: 0, title: { zh: "项目概览", en: "Overview" } },
      { time: 17, title: { zh: "异步决策", en: "Async decisions" } },
      { time: 31, title: { zh: "多 Agent 协商", en: "Negotiation" } },
      { time: 75, title: { zh: "行为树", en: "Behavior trees" } },
      { time: 109, title: { zh: "任务与资源", en: "Tasks & resources" } },
      { time: 175, title: { zh: "协作解谜", en: "Cooperative puzzles" } },
      { time: 209, title: { zh: "对话与记忆", en: "Dialogue & memory" } },
    ],
    gallery: [],
  },
  {
    slug: "level-select",
    category: "interaction",
    readingMinutes: 7,
    repositoryUrl: "https://github.com/xyxfa/Kingdom_Select",
    technicalPoints: [
      { zh: "经纬角配置 → 双层 Transform 解耦相机旋转", en: "Angle configuration and two-level camera rotation" },
      { zh: "二次贝塞尔曲线 → 50 点 LineRenderer 路径", en: "Quadratic Bezier paths sampled into a 50-point LineRenderer" },
      { zh: "EventSystem 选择回调与 DOTween 图片过渡", en: "EventSystem selection callbacks and DOTween image transitions" },
    ],
    number: "01",
    title: { zh: "Unity 3D 选关：球面坐标、相机与路径", en: "Unity 3D level selection: coordinates, camera & paths" },
    subtitle: { zh: "双轴旋转 · 二次贝塞尔 · UI 状态同步", en: "Two-axis rotation · Quadratic Bezier · UI state" },
    summary: {
      zh: "把关卡经纬角映射到双层相机支架，用 DOTween 驱动旋转、用二次贝塞尔生成路径，再通过 EventSystem 联动选中反馈与预览图。拆解空间布局到 UI 呈现的调用链。",
      en: "Map level angles to a two-level camera rig, animate rotation with DOTween, sample Bezier paths and connect EventSystem selection to previews. Follow the chain from spatial layout to UI feedback.",
    },
    description: {
      zh: "让选关也成为探索的一部分。把不同主题的关卡做成微缩浮岛，围绕球面展开；旋转切换时，场景预览、氛围与选中状态一起变化。再加上昼夜切换和地图入口，让进入关卡前的这一步也有点意思。",
      en: "Make choosing a level part of the exploration. Miniature biome islands surround a sphere, with scene previews, atmosphere and selection states changing as you rotate between them. A day/night switch and a map view give this small step its own sense of discovery.",
    },
    tags: { zh: ["C#", "DOTween", "Bezier", "EventSystem"], en: ["C#", "DOTween", "Bezier", "EventSystem"] },
    poster: `${media}/poster.webp`,
    video: `${media}/demo.mp4`,
    duration: "01:19",
    background: `${media}/background.webp`,
    gallery: [
      { image: `${media}/sakura.webp`, title: { zh: "樱花浮岛", en: "Sakura island" }, caption: { zh: "用微缩场景呈现关卡的主题。", en: "A miniature scene introduces the level's theme." } },
      { image: `${media}/snow.webp`, title: { zh: "雪地关卡", en: "Snowy world" }, caption: { zh: "雪景与飘雪粒子呼应选中的世界。", en: "A snowy preview and particles echo the selected world." } },
      { image: `${media}/ruins.webp`, title: { zh: "遗迹关卡", en: "Rocky ruins" }, caption: { zh: "旋转切换，查看不同关卡的样貌。", en: "Rotate between islands to preview each destination." } },
      { image: `${media}/desert.webp`, title: { zh: "沙漠关卡", en: "Desert world" }, caption: { zh: "沙丘、仙人掌与暖色地形。", en: "Dunes, cacti and warm terrain colors." } },
      { image: `${media}/night.webp`, title: { zh: "昼夜切换", en: "Day into night" }, caption: { zh: "切换日月，让同一界面换一种氛围。", en: "Switch the time of day for a different atmosphere." } },
      { image: `${media}/map.webp`, title: { zh: "地图入口", en: "Map view" }, caption: { zh: "从地图视角查看各个世界的位置。", en: "See the worlds and their locations on a map." } },
    ],
  },
  {
    slug: "ase-shader",
    category: "graphics",
    readingMinutes: 9,
    repositoryUrl: "https://github.com/xyxfa/shader_ASE_test_and_Cool_UI",
    technicalPoints: [
      { zh: "噪声采样 + smoothstep 溶解与 Emission 边缘", en: "Noise sampling, smoothstep dissolve and emissive edges" },
      { zh: "双路 UV Panner、纹理扰动与 Stencil 测试", en: "Two UV panners, texture distortion and stencil tests" },
      { zh: "MaterialPropertyBlock 隔离参数；暂停 UI 独立计时", en: "Per-renderer property blocks and independent UI timing" },
    ],
    number: "02",
    title: { zh: "Unity Shader：溶解、UV 扰动与渲染隔离", en: "Unity shaders: dissolve, UV distortion & render isolation" },
    subtitle: { zh: "从 ASE 生成代码，到材质参数与 UI 时间域", en: "From ASE-generated code to material properties and UI clocks" },
    summary: {
      zh: "沿源码拆解 smoothstep 溶解、发光边缘、双路 UV 扰动与模板测试，再分析 MaterialPropertyBlock 的参数隔离，以及 timeScale 为零时 UI 如何继续动画。",
      en: "Trace smoothstep dissolve, emissive edges, dual UV panners and stencil tests in source, then inspect per-renderer parameters and UI animation while timeScale is zero.",
    },
    description: {
      zh: "大三上期末做的一组 Unity / ASE 练习。其中一个重点是用手电筒控制车辆显隐：光束扫过，车身随着照射范围显现；移开光束，车辆逐渐消失，交界处带有青色发光边缘。除此之外，还尝试了卡通材质、角色溶解、地面水渍、双摄像机渲染、后处理和风格化刀光，以及裙摆布料、头发飘动与变色流光。下方收录了完整演示和效果截图。",
      en: "A collection of Unity / ASE exercises from my third-year first-semester final project. A key experiment uses a flashlight to reveal a vehicle: its body appears within the beam and disappears as the light moves away, with a glowing cyan edge marking the transition. Other studies include toon materials, character dissolve, wet ground, dual-camera rendering, post-processing, stylized slashes, cloth motion and flowing, color-shifting hair. The full demo and selected stills are collected below.",
    },
    tags: { zh: ["HLSL", "ASE", "UV / Stencil", "MaterialPropertyBlock"], en: ["HLSL", "ASE", "UV / Stencil", "MaterialPropertyBlock"] },
    poster: "/ideas/ase-shader/slash.webp",
    video: "https://www.bilibili.com/video/BV1UfNwzEEtm/",
    bilibiliId: "BV1UfNwzEEtm",
    externalUrl: "https://www.bilibili.com/video/BV1UfNwzEEtm/?spm_id_from=333.1387.homepage.video_card.click",
    duration: "06:56",
    background: "/ideas/ase-shader/background.webp",
    galleryTitle: { zh: "效果切片", en: "Effects up close" },
    gallery: [
      { image: "/ideas/ase-shader/flashlight-reveal.webp", title: { zh: "手电筒显隐 · 照射显现", en: "Flashlight reveal · In the beam" }, caption: { zh: "01:21 · 光束照到车辆，车身在照射范围内显现。", en: "01:21 · The vehicle becomes visible within the flashlight beam." } },
      { image: "/ideas/ase-shader/flashlight-hide.webp", title: { zh: "手电筒显隐 · 移开消失", en: "Flashlight reveal · Moving away" }, caption: { zh: "01:23 · 光束移开，车身逐渐隐去，交界处留下青色发光边缘。", en: "01:23 · As the beam moves away, the vehicle disappears along a glowing cyan edge." } },
      { image: "/ideas/ase-shader/toon.webp", title: { zh: "卡通材质", en: "Toon materials" }, caption: { zh: "把卡通角色放进夜晚街景，观察材质与光照的表现。", en: "Exploring a toon character's materials under nighttime street lighting." } },
      { image: "/ideas/ase-shader/dissolve.webp", title: { zh: "角色溶解", en: "Character dissolve" }, caption: { zh: "截取角色逐渐消散时，黑白纹理交错的一刻。", en: "A moment of contrasting fragments as the character dissolves." } },
      { image: "/ideas/ase-shader/wet-ground.webp", title: { zh: "地面水渍", en: "Wet ground" }, caption: { zh: "在路面材质上尝试水渍的范围、边缘和湿润感。", en: "Trying puddle coverage, edges and a wet look on the road material." } },
      { image: "/ideas/ase-shader/dual-camera.webp", title: { zh: "双摄像机渲染", en: "Dual-camera rendering" }, caption: { zh: "用双摄像机与 Render Texture 尝试角色的青色发光效果。", en: "Using two cameras and a Render Texture to explore a cyan character effect." } },
      { image: "/ideas/ase-shader/slash.webp", title: { zh: "风格化刀光", en: "Stylized slash" }, caption: { zh: "用红黑色块和破碎边缘勾出挥斩的弧线。", en: "Red-and-black shapes and broken edges trace the arc of a slash." } },
      { image: "/ideas/ase-shader/hair-cloth.webp", title: { zh: "布料与头发", en: "Cloth & hair" }, caption: { zh: "在动态演示中查看裙摆、头发飘动与变色流光。", en: "Cloth and hair motion, with shifting colors and flowing highlights in the demo." } },
    ],
  },
  {
    slug: "ai-recruiting",
    category: "automation",
    readingMinutes: 8,
    technicalPoints: [
      { zh: "MV3 Service Worker 与站点解析器分工", en: "MV3 service worker and site-specific parsers" },
      { zh: "初筛 → 详情二筛 → 结构化结果回写", en: "Initial screening, detail review and structured UI results" },
      { zh: "岗位级去重键、30 天 TTL 与附件 SHA256 去重", en: "Role-scoped dedupe keys, 30-day TTL and attachment SHA256" },
    ],
    number: "03",
    kind: "technical",
    title: { zh: "AI 招聘自动化：两阶段筛选与简历归档", en: "Recruiting automation: two-stage screening & resume filing" },
    subtitle: {
      zh: "Chrome MV3 · 结构化模型输出 · 去重与归档",
      en: "Chrome MV3 · Structured model output · Deduplication & filing",
    },
    summary: {
      zh: "把岗位与候选人资料组织为两阶段模型输入，将判断归一化后回写页面；通过岗位级处理记录、邮件 UID 和附件哈希减少重复操作。已在任职公司实际使用。",
      en: "Organize requirements and profiles into two-stage model inputs, normalize decisions for the UI, and use role-scoped records, mail UIDs and attachment hashes to reduce duplicate work. Used at my employer.",
    },
    description: {
      zh: "围绕任职公司的实际招聘流程，制作并投入使用了两套工具：浏览器扩展把岗位要求、候选人资料与 AI 判断连接起来，完成初筛、详情二筛和结果回写；邮件工具负责按日期收取简历附件，解析内容、识别求职岗位、去重并归档。把反复点开、判断、下载和整理的步骤交给程序，让招聘同事集中处理需要进一步确认的人选。",
      en: "I built and put two tools into use around my employer's recruiting workflow. A browser extension connects job requirements and candidate profiles to AI for initial screening, detail screening and results on the page. A mail tool collects resume attachments by date, extracts text, identifies job categories, removes duplicates and files the results. This automates repeated browsing and document handling so recruiters can focus on candidates who need a closer look.",
    },
    tags: { zh: ["LLM 应用", "浏览器扩展", "Python", "实际业务落地"], en: ["LLM integration", "Browser extension", "Python", "In real use"] },
    poster: "/ideas/ai-recruiting/cover.webp",
    background: "/ideas/ai-recruiting/background.webp",
    gallery: [],
  },
];
