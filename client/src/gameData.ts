/**
 * Game Data - Background images and accent colors for each game section
 * Adapted from 78 Project for Pixel Portfolio
 */

export interface GameConfig {
    bgImage: string;
    accentColor: string;
    accentBg: string;
    accentBorder: string;
    videoUrl?: string;
    galleryImages?: string[];
    mainImage?: string; // 主展示图片，如果未设置则使用 bgImage 或 project.image
}

// VR Projects backgrounds (Video Based)
export const vrGameConfigs: GameConfig[] = [
    {
        // 璇玑蜀律 (Xuanji Shulü)
        // 使用像素农场平铺背景
        bgImage: "/背景/xuanjishuyu-pixel-pattern.png",
        accentColor: "#4ade80", // Leaf Green
        accentBg: "rgba(74, 222, 128, 0.15)",
        accentBorder: "rgba(74, 222, 128, 0.4)",
        videoUrl: "/videos/xuanji.mp4",
    },
    {
        // 逆序圣典 (Reverse Order Scripture)
        // 使用逆序盛典像素图案背景，配色保持与「璇玑蜀律」一致，仅视频资源保持 reverse 视频
        bgImage: "/背景/nixueshengdian-pixel-bg.png",
        accentColor: "#4ade80", // Leaf Green
        accentBg: "rgba(74, 222, 128, 0.15)",
        accentBorder: "rgba(74, 222, 128, 0.4)",
        videoUrl: "/videos/reverse.mp4",
    },
];

// GameJam Projects backgrounds
export const gamejamGameConfigs: GameConfig[] = [
    {
        // 冒牌上班族 (Fake Office Worker) - 2026 GameJam 作品
        // 职场主题游戏，使用 office-empire-seamless.png 作为背景
        bgImage: "/GameJam/冒牌上班族/office-empire-seamless.png",
        mainImage: "/GameJam/冒牌上班族/标题.jpg", // 主展示图片
        accentColor: "#fb923c", // 临时配色，待根据实际图片调整
        accentBg: "rgba(251, 146, 60, 0.2)",
        accentBorder: "rgba(251, 146, 60, 0.6)",
        galleryImages: [
            "/GameJam/冒牌上班族/Snipaste_2026-02-10_12-18-06.png",
            "/GameJam/冒牌上班族/Snipaste_2026-02-10_12-18-19.png",
            "/GameJam/冒牌上班族/Snipaste_2026-02-10_12-18-34.png",
            "/GameJam/冒牌上班族/Snipaste_2026-02-10_12-19-07.png",
        ],
    },
    {
        // 未定义行为 (The Undefined) - GameJam 作品
        // 双人PVP像素风格游戏，使用橙色主题（橙色猫角色为主）
        // 使用横向无缝平铺图作为主要区域背景
        bgImage: "/GameJam/未定义行为/undefined-behavior-horizontal-seamless.png",
        mainImage: "/GameJam/未定义行为/标题.png", // 主展示图片仍然使用标题图
        accentColor: "#fb923c", // 橙色 (orange-400)，与游戏主角色颜色一致
        accentBg: "rgba(251, 146, 60, 0.2)",
        accentBorder: "rgba(251, 146, 60, 0.6)",
        galleryImages: [
            "/GameJam/未定义行为/0825660fffb5f856ee7ab39e10a9a537.webp",
            "/GameJam/未定义行为/4ef03bbbe5c87bed764c31cae3bcefd9.webp",
            "/GameJam/未定义行为/4d4fca805079b03de93f21788df84895.webp",
            "/GameJam/未定义行为/Attached_image.png",
        ],
    },
    {
        // Eat is Rule - GameJam 作品
        // 使用主页面大图作为主展示，同时给出四张小图（最后一张是 UI 图）
        bgImage: "/GameJam/Eat%20is%20Rule/eat-is-rule-seamless.png",
        mainImage: "/GameJam/Eat%20is%20Rule/完美世界主页.png",
        accentColor: "#fbbf24", // Amber / Gold（与画面偏暖的主色一致）
        accentBg: "rgba(251, 191, 36, 0.15)",
        accentBorder: "rgba(251, 191, 36, 0.45)",
        galleryImages: [
            "/GameJam/Eat%20is%20Rule/完美世界思维变换.png",
            "/GameJam/Eat%20is%20Rule/完美世界推箱子.png",
            "/GameJam/Eat%20is%20Rule/完美世界冰融化png.png",
            "/GameJam/Eat%20is%20Rule/完美世界UI.png",
        ],
    },
    {
        // Glitch - TapTap 聚光灯 21 天作品
        // 数字世界 & 漏洞主题
        bgImage: "/GameJam/Glitch/bug-world-seamless.png",
        mainImage: "/GameJam/Glitch/613fd85cf523e71ed931a0c0e565a19a.webp",
        accentColor: "#a855f7", // Purple (Glitch/Digital vibe)
        accentBg: "rgba(168, 85, 247, 0.15)",
        accentBorder: "rgba(168, 85, 247, 0.45)",
        galleryImages: [
            "/GameJam/Glitch/1c2dd83029f6e3a9e22c037de5a63c8f.webp",
            "/GameJam/Glitch/6a816a05a1d9571efe0f4c54bb038db0.webp",
            "/GameJam/Glitch/ef791b13c7a47c43a3eccfe613f9930b.webp",
            "/GameJam/Glitch/fdba0eb4c79fbe11878fd78b3794377c.webp",
        ],
    },
    {
        // Synesthesia - 感官交织
        bgImage: "/GameJam/Synesthesia/synesthesia-green-seamless.png",
        mainImage: "/GameJam/Synesthesia/微信图片_20260210191906_2251_486.jpg",
        accentColor: "#38bdf8", // Sky blue / Cyan
        accentBg: "rgba(56, 189, 248, 0.15)",
        accentBorder: "rgba(56, 189, 248, 0.4)",
        galleryImages: [
            "/GameJam/Synesthesia/Snipaste_2026-02-10_20-22-41.png",
            "/GameJam/Synesthesia/Snipaste_2026-02-10_20-23-36.png",
            "/GameJam/Synesthesia/Snipaste_2026-02-10_20-24-27.png",
            "/GameJam/Synesthesia/Snipaste_2026-02-10_20-25-10.png",
        ],
    },
];
