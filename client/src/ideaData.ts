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
    slug: "noita-simulator",
    number: "06",
    kind: "technical",
    category: "graphics",
    readingMinutes: 14,
    publishedAt: "2026-09-18",
    title: { zh: "Noita 的底层复刻", en: "Recreating Noita-style material simulation" },
    subtitle: {
      zh: "用 Unity 做像素材料模拟：元胞自动机、活跃区块、Burst 与连锁交互",
      en: "A Unity material sandbox: cellular automata, active chunks, Burst and chain reactions",
    },
    summary: {
      zh: "沙子怎么堆起来，水为什么能停下来，烧断的木桥又该怎样下落？从一格材料的状态出发，记录规则、更新顺序、休眠唤醒与优化验证。",
      en: "How does sand pile up, water settle and a burnt bridge fall? Notes on cell state, update order, sleep/wake and checking optimization correctness.",
    },
    description: {
      zh: "这是我用 Unity 做的像素材料沙盒。沙、水、油、火、酸液和冰放在同一张网格里，法杖、导火线与木结构再把它们串成连锁交互。下面的视频结合实机录制、原理示意和源码，展示这些效果怎样从一格格状态变化中产生。",
      en: "My Unity pixel-material sandbox puts sand, water, oil, fire, acid and ice on one grid. Wands, fuses and wooden structures connect them into chain reactions. The video combines a fresh player recording, diagrams and source excerpts.",
    },
    technicalPoints: [
      { zh: "打包材料状态，控制扫描顺序和密度交换", en: "Packed cell state, explicit scan order and density swaps" },
      { zh: "活跃区块休眠，处理液体远处出口的唤醒", en: "Sleeping chunks and wake propagation for distant liquid outlets" },
      { zh: "连通分量处理坍塌，逐步对照验证优化结果", en: "Connected components for collapse and per-step differential validation" },
    ],
    tags: {
      zh: ["Unity / C#", "元胞自动机", "Jobs / Burst", "连通分量", "差分验证"],
      en: ["Unity / C#", "Cellular automata", "Jobs / Burst", "Connected components", "Differential validation"],
    },
    poster: "/ideas/noita/poster.webp",
    video: "/ideas/noita/demo.mp4",
    duration: "03:36",
    background: "/ideas/level-select/background.webp",
    chapters: [
      { time: 0, title: { zh: "实机交互", en: "Interactions" } },
      { time: 10, title: { zh: "元胞与状态", en: "Cells & state" } },
      { time: 36, title: { zh: "扫描顺序", en: "Update order" } },
      { time: 62, title: { zh: "休眠与唤醒", en: "Sleep & wake" } },
      { time: 92, title: { zh: "Burst 与绘制", en: "Burst & rendering" } },
      { time: 116, title: { zh: "材料反应", en: "Reactions" } },
      { time: 142, title: { zh: "结构坍塌", en: "Collapse" } },
      { time: 170, title: { zh: "弹丸与搬运", en: "Projectiles & transfer" } },
      { time: 192, title: { zh: "优化验证", en: "Validation" } },
    ],
    gallery: [],
  },
  {
    slug: "sprout-squad",
    number: "05",
    kind: "technical",
    category: "ai",
    readingMinutes: 14,
    publishedAt: "2026-09-17",
    title: {
      zh: "萌芽小队：几万只小兔，怎么一起移动和战斗",
      en: "Sprout Squad: moving and fighting with thousands of rabbits",
    },
    subtitle: {
      zh: "记录 SoA、Jobs / Burst、实例渲染和房主同步在项目里的用法",
      en: "How I use SoA, Jobs / Burst, instancing and host replication",
    },
    summary: {
      zh: "单位多了以后，寻路、避让、绘制和同步都要重新考虑。这篇从数组里的一个下标讲起，记录共享流场、GPU 顶点动画和 22 字节快照怎样配合。",
      en: "Crowds put pressure on movement, rendering and networking. Starting with an array slot, I look at shared flow fields, GPU vertex motion and 22-byte snapshots.",
    },
    description: {
      zh: "这是一个可以批量生成小兔和小芽的 RTS 演示，支持框选、移动、炮塔战斗和双端联机。我把两段实机录屏剪成了下面的视频，也整理了实现里值得展开的部分：几万个单位如何共享寻路结果，删除单位后怎样维护状态，以及网络慢下来时怎么同步。",
      en: "This RTS demo supports mass spawning, selection, movement, turret combat and multiplayer. The video combines two recordings. The notes below cover shared pathfinding, identity after deletion and replication under slower transfers.",
    },
    technicalPoints: [
      {
        zh: "用稳定 ID 处理数组搬迁，按 Job 依赖更新状态",
        en: "Stable IDs across array moves and explicit job dependencies",
      },
      {
        zh: "共享流场找方向，空间网格查邻居，GPU 批量绘制",
        en: "Shared flow fields, local grid queries and instance batches",
      },
      {
        zh: "22 字节状态打包，回执控制发送，客户端插值",
        en: "22-byte unit records, acknowledged sends and client interpolation",
      },
    ],
    tags: {
      zh: [
        "Unity / C#",
        "Jobs / Burst",
        "Flow Field",
        "GPU Instancing",
        "Unity Transport",
      ],
      en: [
        "Unity / C#",
        "Jobs / Burst",
        "Flow Field",
        "GPU Instancing",
        "Unity Transport",
      ],
    },
    poster: "/ideas/sprout/poster.webp",
    video: "https://www.bilibili.com/video/BV15ier6bEuN/",
    bilibiliId: "BV15ier6bEuN",
    externalUrl: "https://www.bilibili.com/video/BV15ier6bEuN/",
    duration: "03:20",
    background: "/ideas/level-select/background.webp",
    chapters: [
      { time: 0, title: { zh: "项目与规模", en: "Overview & scale" } },
      { time: 28, title: { zh: "SoA / Jobs", en: "SoA / Jobs" } },
      { time: 51, title: { zh: "流场与避让", en: "Flow & avoidance" } },
      { time: 83, title: { zh: "实例绘制", en: "Instancing" } },
      { time: 105, title: { zh: "GPU 动画", en: "GPU animation" } },
      { time: 125, title: { zh: "房主权威", en: "Host authority" } },
      {
        time: 146,
        title: { zh: "快照与插值", en: "Snapshots & interpolation" },
      },
      {
        time: 170,
        title: { zh: "背压与校验", en: "Backpressure & verification" },
      },
    ],
    gallery: [],
  },
  {
    slug: "echo-unity-ai",
    number: "04",
    kind: "technical",
    category: "ai",
    readingMinutes: 14,
    publishedAt: "2026-09-17",
    technicalPoints: [
      {
        zh: "异步作业处理重试与取消，旧回包按版本拦截",
        en: "Retryable async jobs, cancellation and stale-response checks",
      },
      {
        zh: "Utility 评分选人，资源预约和行为树负责执行",
        en: "Utility scoring, resource reservations and behavior-tree execution",
      },
      {
        zh: "记忆保留来源，熄灯游戏用 GF(2) 消元求解",
        en: "Source-backed memories and a GF(2) Lights Out solver",
      },
    ],
    title: {
      zh: "ECHO：让 AI 角色商量，也让它们动起来",
      en: "ECHO: agents that discuss plans and act on them",
    },
    subtitle: {
      zh: "角色聊天、协作解谜，以及异步模型和实时游戏之间的配合",
      en: "Conversations, puzzles and coordination between model calls and real-time play",
    },
    summary: {
      zh: "几个角色讨论完分工，接下来谁执行、谁等资源、谁处理突发情况？我用任务调度和行为树接住模型的建议，也给迟到的回答、取消的任务和角色记忆留了检查入口。",
      en: "After agents agree on a plan, who acts, who waits for resources and who reacts to danger? Scheduling, behavior trees and state checks turn their proposals into game actions.",
    },
    description: {
      zh: "ECHO 做了角色单聊、群聊、记忆检索和多 Agent 协作。我想让这些角色既能交流，也能在 Unity 场景里一起做事。难点在于模型返回得慢，游戏却一直在变：任务可能已经做完，角色可能倒地，玩家也可能重开。因此我把协商、分配和执行分开，下面结合录屏和代码说说具体处理。",
      en: "ECHO combines character chat, memory retrieval and multi-agent cooperation. I want the characters to talk and work together in Unity. Model responses take time while tasks, actors and levels keep changing, so negotiation, assignment and execution are handled separately.",
    },
    tags: {
      zh: ["Unity / C#", "多 Agent", "行为树", "Python", "RAG"],
      en: ["Unity / C#", "Multi-agent", "Behavior trees", "Python", "RAG"],
    },
    poster: "/ideas/echo/poster.webp",
    video: "https://www.bilibili.com/video/BV1Vier6bEe9/",
    bilibiliId: "BV1Vier6bEe9",
    externalUrl: "https://www.bilibili.com/video/BV1Vier6bEe9/",
    duration: "04:36",
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
    readingMinutes: 5,
    repositoryUrl: "https://github.com/xyxfa/Kingdom_Select",
    technicalPoints: [
      {
        zh: "两个方向角配置关卡，两层 Transform 控制相机",
        en: "Two configured angles and a two-transform camera rig",
      },
      {
        zh: "二次贝塞尔采样后交给 LineRenderer",
        en: "Quadratic Bezier samples drawn with LineRenderer",
      },
      {
        zh: "EventSystem 处理选择态，DOTween 完成过渡",
        en: "EventSystem selection and DOTween transitions",
      },
    ],
    number: "01",
    title: {
      zh: "做一个可以转动的 3D 选关界面",
      en: "Building a rotating 3D level selector",
    },
    subtitle: {
      zh: "球面上的小浮岛、相机转动和贝塞尔路线",
      en: "Floating islands, camera rotation and Bezier paths",
    },
    summary: {
      zh: "把关卡摆成一圈小浮岛，选中时转动镜头、切换图片。界面看起来简单，实际需要让角度配置、相机的两个旋转轴和按钮状态一直对得上。",
      en: "Levels sit on miniature islands around a sphere. Selection rotates the camera and changes the preview; angle configuration, both camera axes and button state need to stay aligned.",
    },
    description: {
      zh: "我想把选关做成一个能转着看的小场景：每座岛代表一个关卡，路线把它们连起来，点击后镜头转过去，右侧预览也跟着切换。这个原型还加了昼夜和地图视角。下面主要讲关卡布局、相机旋转和 UI 联动这几部分。",
      en: "I wanted level selection to feel like a small scene to explore: one island per level, paths between them, and a camera that turns toward the selection as its preview changes. The prototype also includes day/night and map views.",
    },
    tags: {
      zh: ["C#", "DOTween", "Bezier", "EventSystem"],
      en: ["C#", "DOTween", "Bezier", "EventSystem"],
    },
    poster: `${media}/poster.webp`,
    video: `${media}/demo.mp4`,
    duration: "01:19",
    background: `${media}/background.webp`,
    gallery: [
      {
        image: `${media}/sakura.webp`,
        title: { zh: "樱花浮岛", en: "Sakura island" },
        caption: {
          zh: "用微缩场景呈现关卡的主题。",
          en: "A miniature scene introduces the level's theme.",
        },
      },
      {
        image: `${media}/snow.webp`,
        title: { zh: "雪地关卡", en: "Snowy world" },
        caption: {
          zh: "雪景与飘雪粒子呼应选中的世界。",
          en: "A snowy preview and particles echo the selected world.",
        },
      },
      {
        image: `${media}/ruins.webp`,
        title: { zh: "遗迹关卡", en: "Rocky ruins" },
        caption: {
          zh: "旋转切换，查看不同关卡的样貌。",
          en: "Rotate between islands to preview each destination.",
        },
      },
      {
        image: `${media}/desert.webp`,
        title: { zh: "沙漠关卡", en: "Desert world" },
        caption: {
          zh: "沙丘、仙人掌与暖色地形。",
          en: "Dunes, cacti and warm terrain colors.",
        },
      },
      {
        image: `${media}/night.webp`,
        title: { zh: "昼夜切换", en: "Day into night" },
        caption: {
          zh: "切换日月，让同一界面换一种氛围。",
          en: "Switch the time of day for a different atmosphere.",
        },
      },
      {
        image: `${media}/map.webp`,
        title: { zh: "地图入口", en: "Map view" },
        caption: {
          zh: "从地图视角查看各个世界的位置。",
          en: "See the worlds and their locations on a map.",
        },
      },
    ],
  },
  {
    slug: "ase-shader",
    category: "graphics",
    readingMinutes: 7,
    repositoryUrl: "https://github.com/xyxfa/shader_ASE_test_and_Cool_UI",
    technicalPoints: [
      {
        zh: "smoothstep 控制溶解过渡，Emission 单独计算亮边",
        en: "smoothstep masks and a separate emissive edge",
      },
      {
        zh: "两路 UV 驱动纹理流动，Stencil 控制像素通过",
        en: "Two moving UV streams and stencil tests",
      },
      {
        zh: "对象级材质参数，暂停时仍可运行的 UI 动画",
        en: "Per-object material properties and unscaled UI animation",
      },
    ],
    number: "02",
    title: {
      zh: "Unity Shader 练习：从溶解边缘到流动纹理",
      en: "Unity shader studies: dissolve edges and flowing textures",
    },
    subtitle: {
      zh: "几组 ASE / HLSL 效果，以及配套的材质和 UI 处理",
      en: "ASE / HLSL effects, material parameters and UI behavior",
    },
    summary: {
      zh: "手电筒扫过车身时显形、角色逐渐溶解、纹理沿刀光流动。这组练习里，我把效果拆到遮罩、UV 和渲染状态上，也整理了暂停菜单与材质参数的处理。",
      en: "A flashlight reveals a car, a character dissolves and textures flow along a slash. These studies cover masks, UVs, render state, material parameters and pause-menu animation.",
    },
    description: {
      zh: "这是大三上期末做的一组 Unity / ASE 练习。手电筒扫过时，车身会在光束里显现，边缘留下一圈青色发光；其他尝试包括溶解、水渍、刀光和头发布料。做完效果后，我沿生成代码回看计算过程，挑了下面几处展开。",
      en: "These Unity / ASE studies were made at the end of my third-year first semester. A flashlight reveals a car with a cyan edge; other experiments include dissolves, wet surfaces, slashes, hair and cloth. Here I revisit selected calculations in the generated code.",
    },
    tags: {
      zh: ["HLSL", "ASE", "UV / Stencil", "MaterialPropertyBlock"],
      en: ["HLSL", "ASE", "UV / Stencil", "MaterialPropertyBlock"],
    },
    poster: "/ideas/ase-shader/slash.webp",
    video: "https://www.bilibili.com/video/BV1UfNwzEEtm/",
    bilibiliId: "BV1UfNwzEEtm",
    externalUrl:
      "https://www.bilibili.com/video/BV1UfNwzEEtm/?spm_id_from=333.1387.homepage.video_card.click",
    duration: "06:56",
    background: "/ideas/ase-shader/background.webp",
    galleryTitle: { zh: "效果切片", en: "Effects up close" },
    gallery: [
      {
        image: "/ideas/ase-shader/flashlight-reveal.webp",
        title: {
          zh: "手电筒显隐 · 照射显现",
          en: "Flashlight reveal · In the beam",
        },
        caption: {
          zh: "01:21 · 光束照到车辆，车身在照射范围内显现。",
          en: "01:21 · The vehicle becomes visible within the flashlight beam.",
        },
      },
      {
        image: "/ideas/ase-shader/flashlight-hide.webp",
        title: {
          zh: "手电筒显隐 · 移开消失",
          en: "Flashlight reveal · Moving away",
        },
        caption: {
          zh: "01:23 · 光束移开，车身逐渐隐去，交界处留下青色发光边缘。",
          en: "01:23 · As the beam moves away, the vehicle disappears along a glowing cyan edge.",
        },
      },
      {
        image: "/ideas/ase-shader/toon.webp",
        title: { zh: "卡通材质", en: "Toon materials" },
        caption: {
          zh: "把卡通角色放进夜晚街景，观察材质与光照的表现。",
          en: "Exploring a toon character's materials under nighttime street lighting.",
        },
      },
      {
        image: "/ideas/ase-shader/dissolve.webp",
        title: { zh: "角色溶解", en: "Character dissolve" },
        caption: {
          zh: "截取角色逐渐消散时，黑白纹理交错的一刻。",
          en: "A moment of contrasting fragments as the character dissolves.",
        },
      },
      {
        image: "/ideas/ase-shader/wet-ground.webp",
        title: { zh: "地面水渍", en: "Wet ground" },
        caption: {
          zh: "在路面材质上尝试水渍的范围、边缘和湿润感。",
          en: "Trying puddle coverage, edges and a wet look on the road material.",
        },
      },
      {
        image: "/ideas/ase-shader/dual-camera.webp",
        title: { zh: "双摄像机渲染", en: "Dual-camera rendering" },
        caption: {
          zh: "用双摄像机与 Render Texture 尝试角色的青色发光效果。",
          en: "Using two cameras and a Render Texture to explore a cyan character effect.",
        },
      },
      {
        image: "/ideas/ase-shader/slash.webp",
        title: { zh: "风格化刀光", en: "Stylized slash" },
        caption: {
          zh: "用红黑色块和破碎边缘勾出挥斩的弧线。",
          en: "Red-and-black shapes and broken edges trace the arc of a slash.",
        },
      },
      {
        image: "/ideas/ase-shader/hair-cloth.webp",
        title: { zh: "布料与头发", en: "Cloth & hair" },
        caption: {
          zh: "在动态演示中查看裙摆、头发飘动与变色流光。",
          en: "Cloth and hair motion, with shifting colors and flowing highlights in the demo.",
        },
      },
    ],
  },
  {
    slug: "ai-recruiting",
    category: "automation",
    readingMinutes: 6,
    technicalPoints: [
      {
        zh: "站点解析器取资料，MV3 后台代理模型请求",
        en: "Site parsers extract profiles; an MV3 worker proxies model requests",
      },
      {
        zh: "概要初筛、详情二筛，结果统一成卡片字段",
        en: "Summary screening, detail review and a consistent card format",
      },
      {
        zh: "按岗位记录候选人，按 UID / SHA256 去重邮件与附件",
        en: "Role-scoped candidate records and UID / SHA256 mail deduplication",
      },
    ],
    number: "03",
    kind: "technical",
    title: {
      zh: "招聘工具开发记录：筛选候选人与整理简历",
      en: "Building tools for candidate screening and resume filing",
    },
    subtitle: {
      zh: "在公司招聘流程中使用的浏览器扩展和邮件工具",
      en: "A browser extension and mail tool used in my employer’s workflow",
    },
    summary: {
      zh: "反复打开资料、对照岗位、下载附件，这些步骤适合交给程序。我在 GoodHR 上适配了两阶段筛选，另用 Python 整理邮件简历；重点处理页面差异、结果展示和重复执行。",
      en: "I adapted GoodHR for two-stage screening and used Python to file emailed resumes, focusing on site differences, readable results and safe repeated runs.",
    },
    description: {
      zh: "这两套工具是围绕任职公司的招聘流程做的。浏览器扩展基于 GoodHR 适配，读取岗位和候选人资料，先看概要、再看详情，把判断理由放回页面。邮件工具负责收附件、提取正文、识别岗位并归档。下面记录的是资料怎样进入程序、模型结果怎样显示，以及重复扫描时怎样少做重复工作。",
      en: "I adapted GoodHR to my employer’s recruiting workflow and built a separate mail-filing tool. The extension reviews summaries and full profiles and displays reasons on the page; the mail tool extracts attachments, identifies roles and files them. These notes cover extraction, result handling and repeated runs.",
    },
    tags: {
      zh: ["LLM 应用", "浏览器扩展", "Python", "实际业务落地"],
      en: ["LLM integration", "Browser extension", "Python", "In real use"],
    },
    poster: "/ideas/ai-recruiting/cover.webp",
    background: "/ideas/ai-recruiting/background.webp",
    gallery: [],
  },
];
