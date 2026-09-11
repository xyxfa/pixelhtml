export type IdeaLocale = "zh" | "en";
type LocalizedText = Record<IdeaLocale, string>;

export interface IdeaProject {
  slug: string;
  number: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  summary?: LocalizedText;
  kind?: "technical";
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
    slug: "level-select",
    number: "01",
    title: { zh: "把关卡，变成小世界", en: "Little worlds to choose from" },
    subtitle: { zh: "3D 关卡选择界面", en: "3D level-selection interface" },
    description: {
      zh: "让选关也成为探索的一部分。把不同主题的关卡做成微缩浮岛，围绕球面展开；旋转切换时，场景预览、氛围与选中状态一起变化。再加上昼夜切换和地图入口，让进入关卡前的这一步也有点意思。",
      en: "Make choosing a level part of the exploration. Miniature biome islands surround a sphere, with scene previews, atmosphere and selection states changing as you rotate between them. A day/night switch and a map view give this small step its own sense of discovery.",
    },
    tags: { zh: ["交互设计", "3D 界面", "关卡选择"], en: ["Interaction", "3D interface", "Level selection"] },
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
    number: "02",
    title: { zh: "ASE Shader 练习", en: "ASE Shader studies" },
    subtitle: { zh: "Unity 着色器与视觉效果", en: "Unity shaders & visual effects" },
    description: {
      zh: "大三上期末做的一组 Unity / ASE 练习。其中一个重点是用手电筒控制车辆显隐：光束扫过，车身随着照射范围显现；移开光束，车辆逐渐消失，交界处带有青色发光边缘。除此之外，还尝试了卡通材质、角色溶解、地面水渍、双摄像机渲染、后处理和风格化刀光，以及裙摆布料、头发飘动与变色流光。下方收录了完整演示和效果截图。",
      en: "A collection of Unity / ASE exercises from my third-year first-semester final project. A key experiment uses a flashlight to reveal a vehicle: its body appears within the beam and disappears as the light moves away, with a glowing cyan edge marking the transition. Other studies include toon materials, character dissolve, wet ground, dual-camera rendering, post-processing, stylized slashes, cloth motion and flowing, color-shifting hair. The full demo and selected stills are collected below.",
    },
    tags: { zh: ["Unity", "ASE Shader", "视觉特效"], en: ["Unity", "ASE Shader", "Visual effects"] },
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
    number: "03",
    kind: "technical",
    title: { zh: "AI自动化招聘", en: "AI recruiting automation" },
    subtitle: {
      zh: "（个人制作并实际任用到任职公司，任职公司实现招聘自动化）",
      en: "Personally developed and put into actual use at my employer to automate recruiting workflows.",
    },
    summary: {
      zh: "输入岗位要求，AI 帮你判断候选人是否合适，并按设置索要、下载简历；收到的简历邮件再由另一套工具分类、去重、归档。个人制作，已在任职公司实际使用。",
      en: "Enter job requirements to screen candidates with AI and request or download resumes. A second tool classifies, deduplicates and files resume emails. Built and used at my employer.",
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
