import { Calendar, Image as ImageIcon, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import FadeInView from "./FadeInView";
import StoreBadge from "./StoreBadge";
import AwardBadge from "./AwardBadge";
import type { GameConfig } from "../gameData";

interface GameProject {
    title: string;
    description: string;
    tags: string[];
    year: string;
    category: string;
    award?: string;
    image?: string;
    link?: string;
    badge?: string;
}

interface GameSectionProps {
    project: GameProject;
    config: GameConfig;
    index: number;
}

export default function GameSection({ project, config, index }: GameSectionProps) {
    const isVideoProject = !!config.videoUrl;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true); // Auto-play by default
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(1);
    const [scrollY, setScrollY] = useState(0);

    // 滚动背景效果：对于有 bgImage 的非视频项目，实现与 VR 游戏一致的滚动视差
    useEffect(() => {
        if (isVideoProject || !config.bgImage) return; // 只对非视频项目且有 bgImage 的生效

        const handleScroll = () => {
            const y = window.scrollY || window.pageYOffset || 0;
            setScrollY(y);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isVideoProject, config.bgImage]);

    const bgOffset = scrollY * 0.55;

    // Render description with:
    // - emphasized words (in quotes) larger
    // - optional multi-line layout via '\n' to get a "rhythm" like the flagship sections
    const renderRichDescription = (text: string) => {
        const quotePattern = /(「[^」]+」|"[^"]+"|'[^']+')/g;

        const renderQuoteEmphasis = (line: string) => {
            // Reset since we're using a global RegExp (`/g`) and calling it repeatedly.
            quotePattern.lastIndex = 0;

            const parts: Array<{ text: string; isEmphasized: boolean }> = [];
            let lastIndex = 0;

            let match: RegExpExecArray | null;
            while ((match = quotePattern.exec(line)) !== null) {
                if (match.index > lastIndex) {
                    parts.push({ text: line.slice(lastIndex, match.index), isEmphasized: false });
                }
                const quotedText = match[1].slice(1, -1);
                parts.push({ text: quotedText, isEmphasized: true });
                lastIndex = match.index + match[0].length;
            }

            if (lastIndex < line.length) {
                parts.push({ text: line.slice(lastIndex), isEmphasized: false });
            }

            if (parts.length === 0) return line;

            return parts.map((part, index) => (
                <span
                    key={index}
                    className={part.isEmphasized ? "text-[1.15em] md:text-[1.2em] font-semibold" : ""}
                >
                    {part.isEmphasized ? `「${part.text}」` : part.text}
                </span>
            ));
        };

        const lines = text
            .split(/\r?\n+/)
            .map((s) => s.trim())
            .filter(Boolean);

        // Multi-line mode: each line uses a different scale for a "size variation" feel
        if (lines.length >= 2) {
            return (
                <div className="space-y-2">
                    {lines.map((line, i) => {
                        const className =
                            i === 0
                                ? "typo-game-desc text-[1.02rem] md:text-lg font-semibold tracking-[0.08em] text-white/95"
                                : i === 1
                                    ? "typo-game-desc text-sm md:text-base opacity-90 text-white/90"
                                    : "typo-game-desc text-xs md:text-sm opacity-80 leading-relaxed text-white/90";

                        return (
                            <p key={`${i}-${line}`} className={className}>
                                {renderQuoteEmphasis(line)}
                            </p>
                        );
                    })}
                </div>
            );
        }

        // Single-line mode (default): quote emphasis only
        return (
            <p className="typo-game-desc text-white/90">
                {renderQuoteEmphasis(text)}
            </p>
        );
    };

    // Per-project Stardew-style subtle pixel patterns (different for each index)
    const accentHex = config.accentColor.replace('#', '');
    const bgPatterns = [
        // Soft diagonal checks
        `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='%23f5e3c3'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23${accentHex}' stroke-width='1' stroke-opacity='0.22' shape-rendering='crispEdges'/%3E%3C/svg%3E")`,
        // Pixel dots
        `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='24' height='24' fill='%23f5e3c3'/%3E%3Crect x='2' y='2' width='2' height='2' fill='%23${accentHex}' fill-opacity='0.35' shape-rendering='crispEdges'/%3E%3Crect x='14' y='10' width='2' height='2' fill='%23${accentHex}' fill-opacity='0.2' shape-rendering='crispEdges'/%3E%3Crect x='6' y='18' width='2' height='2' fill='%23${accentHex}' fill-opacity='0.25' shape-rendering='crispEdges'/%3E%3C/svg%3E")`,
        // Tiny plus tiles
        `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='%23f5e3c3'/%3E%3Cpath d='M15 7h2v4h4v2h-4v4h-2v-4h-4v-2h4z' fill='%23${accentHex}' fill-opacity='0.18' shape-rendering='crispEdges'/%3E%3C/svg%3E")`,
        // Horizontal paper grain
        `url("data:image/svg+xml,%3Csvg width='160' height='80' viewBox='0 0 160 80' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='160' height='80' fill='%23f5e3c3'/%3E%3Cpath d='M0 10h160M0 30h160M0 50h160M0 70h160' stroke='%23${accentHex}' stroke-width='1' stroke-opacity='0.18' shape-rendering='crispEdges'/%3E%3C/svg%3E")`,
    ];
    const bgPattern = bgPatterns[index % bgPatterns.length];

    // Video Control Logic
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isVideoProject) return; // Only run if video project

        const updateProgress = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        video.addEventListener('timeupdate', updateProgress);
        return () => video.removeEventListener('timeupdate', updateProgress);
    }, [isVideoProject]); // Only run if video project

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (videoRef.current && videoRef.current.duration) {
            videoRef.current.currentTime = (val / 100) * videoRef.current.duration;
            setProgress(val);
        }
    };

    // Reusable Header Component - 移除 FadeInView，确保内容始终可见（与 VR 区一致）
    const HeaderSection = ({ align = "center" }: { align?: "left" | "center" }) => {
        const hasCustomBadge = !!project.badge;
        const badgeText = project.badge || project.category;

        return (
            <div className={`w-full max-w-3xl ${align === "center" ? "mx-auto text-center" : "text-left"} mb-8 relative z-20`}>
                <div className={`inline-flex items-center gap-3 mb-4 px-4 py-1.5 bg-black/40 border border-white/10 rounded-full backdrop-blur-md ${align === "center" ? "" : "mr-auto"}`}>
                    <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: config.accentColor }}
                    />
                    <span className="typo-game-meta text-white/80">
                        {badgeText}
                    </span>
                    {!hasCustomBadge && (
                        <>
                            <span className="text-white/20">|</span>
                            <span className="text-xs font-pixel text-white/60">
                                {project.year}
                            </span>
                        </>
                    )}
                </div>

                <div className="w-full flex justify-center mb-10">
                    <h2>
                        <div className="relative inline-block group cursor-default">
                            {/* Whimsical Pixel Decorations - Left Side - Hidden on mobile */}
                            <div className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 flex-col gap-2 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300">
                                <div className="w-4 h-4 bg-white animate-bounce shadow-[2px_2px_0_rgba(0,0,0,0.5)]" style={{ animationDelay: '0ms' }} />
                                <div className="w-3 h-3 ml-2" style={{ backgroundColor: config.accentColor }} />
                            </div>

                            {/* Main Title Container - "Cream Sticker" style */}
                            <div
                                className="bg-cream border-[6px] px-10 py-5 shadow-[10px_10px_0_rgba(0,0,0,0.15)] relative overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-[1.02]"
                                style={{
                                    borderColor: config.accentColor,
                                }}
                            >
                                {/* Decorative Corner Tab */}
                                <div
                                    className="absolute top-0 right-0 w-8 h-8 -mr-4 -mt-4 rotate-45 z-20"
                                    style={{ backgroundColor: config.accentColor }}
                                />

                                <span
                                    className="typo-game-title text-wood-dark tracking-[0.2em] relative z-10 block"
                                    style={{
                                        textShadow: `2px 2px 0px rgba(255,255,255,0.8)`,
                                    }}
                                >
                                    {project.title}
                                </span>

                                {/* Cute "Pixel Sprinkles" */}
                                <div className="absolute top-2 left-4 w-2 h-2 opacity-30" style={{ backgroundColor: config.accentColor }} />
                                <div className="absolute bottom-2 right-6 w-1.5 h-1.5 opacity-30" style={{ backgroundColor: config.accentColor }} />
                            </div>

                            {/* Whimsical Pixel Decorations - Right Side - Hidden on mobile */}
                            <div className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 flex-col gap-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                                <div className="w-4 h-4 bg-white animate-bounce shadow-[2px_2px_0_rgba(0,0,0,0.5)]" style={{ animationDelay: '150ms' }} />
                                <div className="w-3 h-3 mr-2 self-end" style={{ backgroundColor: config.accentColor }} />
                            </div>
                        </div>
                    </h2>
                </div>

                <div className={`relative p-5 md:p-8 bg-black/40 border border-white/10 backdrop-blur-sm rounded-sm ${align === "center" ? "mx-auto w-full" : "text-left"}`}>
                    {renderRichDescription(project.description)}
                    <div className={`flex flex-wrap ${align === "center" ? "justify-center" : "justify-start"} gap-2 mt-4`}>
                        {project.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-[10px] font-pixel text-white/60 border border-white/20 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {align === "left" && (
                    <div className="flex gap-4 mt-8 flex-wrap justify-start items-stretch">
                        <StoreBadge platform="taptap" link={project.link} accentColor={config.accentColor} />
                        {(project.award || project.badge) && (
                            <>
                                <div className="w-1 bg-yellow-400/80 self-stretch" />
                                <AwardBadge
                                    accentColor={config.accentColor}
                                    label={project.award ? "AWARD WINNER" : "FEATURED"}
                                    value={project.award || project.badge || ""}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <section
            className={`relative overflow-hidden border-b-4 border-wood-dark ${isVideoProject ? 'min-h-screen flex items-center py-16' : 'py-24 md:py-32'}`}
        >
            {/* 滚动背景层：对于有 bgImage 的非视频项目，实现与 VR 游戏一致的滚动视差效果 */}
            {!isVideoProject && (config.bgImage || project.image) && (
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage: `url(${config.bgImage || project.image})`,
                        // 使用平铺，但整体向上轻微偏移，避免拼接缝落在可视区域
                        backgroundRepeat: "repeat",
                        // 保持原图尺寸，保证像素感
                        backgroundSize: "auto",
                        // 确保像素边缘清晰，不模糊
                        imageRendering: "pixelated",
                        // 整体再往上多抬一点，把和上一个版块之间的接缝藏住
                        backgroundPosition: `center ${-bgOffset - 80}px`,
                    }}
                />
            )}
            {/* Top Border Pattern - keep for standard game sections only (remove for video to avoid flicker feeling) */}
            {!isVideoProject && (
                <div
                    className="absolute top-0 left-0 right-0 h-4 z-10"
                    style={{
                        backgroundImage: `repeating-linear-gradient(90deg, ${config.accentColor}, ${config.accentColor} 12px, transparent 12px, transparent 24px)`,
                        opacity: 0.45
                    }}
                />
            )}
            {/* Background texture: keep it only for standard games without bgImage. 
                For VR/video sections use a clean, flat background to avoid any perceived "loading / flicker" while scrolling. */}
            {!isVideoProject && !config.bgImage && (
                <>
                    <div className="absolute inset-0 opacity-80 pointer-events-none" style={{ backgroundImage: bgPattern }} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_0%,rgba(0,0,0,0.22)_100%)] pointer-events-none" />
                </>
            )}
            {/* Cream + pixel overlay for Stardew-style pixel mood - 用于有滚动背景的项目 */}
            {!isVideoProject && config.bgImage && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-cream/50 to-cream/60 pointer-events-none z-[1]" />
            )}
            {/* VR / Video projects: apply a soft cream + accent overlay over the background image for readability */}
            {isVideoProject && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(248, 240, 223, 0.55) 0%, rgba(248, 240, 223, 0.35) 40%, rgba(0, 0, 0, 0.6) 100%)",
                        mixBlendMode: "multiply",
                    }}
                />
            )}

            <div className="container mx-auto px-6 relative z-20">

                {/* --- VR VIDEO LAYOUT (Side-by-Side) --- */}
                {isVideoProject ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Text Content (no scroll-triggered animation to avoid flicker) */}
                        <div>
                            <div className="max-w-3xl text-left mb-8 relative z-20">
                                <div className="inline-flex items-center gap-3 mb-4 px-4 py-1.5 bg-black/60 border border-white/20 rounded-sm mr-auto backdrop-blur-md shadow-[4px_4px_0_rgba(0,0,0,0.8)]">
                                    <span
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: config.accentColor }}
                                    />
                                    <span className="typo-game-meta text-[10px] text-white/90">
                                        {project.category}
                                    </span>
                                    <span className="text-white/20">|</span>
                                    <span className="text-[10px] font-pixel text-white/70 tracking-[0.18em]">
                                        {project.year}
                                    </span>
                                </div>

                                <div className="w-full flex justify-center mb-6">
                                    <h2>
                                        <span
                                            className="inline-block px-6 py-4 bg-black/85 border-[3px] border-white/90 shadow-[4px_4px_0_rgba(0,0,0,0.9)]"
                                        >
                                            <span
                                                className="typo-vr-title font-pixel text-white tracking-[0.26em]"
                                                style={{
                                                    textShadow: `0 0 22px ${config.accentColor}aa`,
                                                }}
                                            >
                                                {project.title}
                                            </span>
                                        </span>
                                    </h2>
                                </div>

                                <div className="relative p-6 bg-black/75 border-2 border-white/15 backdrop-blur-sm rounded-sm text-left shadow-[4px_4px_0_rgba(0,0,0,0.85)]">
                                    {renderRichDescription(project.description)}
                                    <div className="flex flex-wrap justify-start gap-2 mt-4">
                                        {project.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 text-[10px] font-pixel text-white/60 border border-white/20 hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8 flex-wrap justify-start items-stretch">
                                    <StoreBadge platform="taptap" link={project.link} accentColor={config.accentColor} />
                                    {(project.award || project.badge) && (
                                        <>
                                            <div className="w-1 bg-yellow-400/80 self-stretch" />
                                            <AwardBadge
                                                accentColor={config.accentColor}
                                                label={project.award ? "AWARD WINNER" : "FEATURED"}
                                                value={project.award || project.badge || ""}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Video Player */}
                        <FadeInView className="w-full relative group">
                            <div
                                className="relative w-full border-4 border-white/20 bg-black shadow-2xl rounded-sm flex flex-col"
                                style={{
                                    boxShadow: `0 20px 80px -20px ${config.accentColor}40`,
                                    borderColor: config.accentBorder
                                }}
                            >
                                {/* Video Screen Area */}
                                <div className="relative aspect-video w-full overflow-hidden bg-black">
                                    {/* CRT Effect */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[2] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

                                    <video
                                        ref={videoRef}
                                        src={config.videoUrl}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        loop
                                        muted={isMuted}
                                        playsInline
                                    />
                                </div>

                                {/* Custom Control Bar - Console Style (Below Screen) */}
                                <div className="h-14 bg-[#0a0a0a] border-t border-white/10 z-20 flex items-center px-4 gap-4">
                                    <button onClick={togglePlay} className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors">
                                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                    </button>

                                    {/* Progress Slider */}
                                    <div className="flex-1 relative h-6 flex items-center group/slider">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={progress}
                                            onChange={handleSeek}
                                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                                            style={{
                                                background: `linear-gradient(to right, ${config.accentColor} ${progress}%, rgba(255,255,255,0.1) ${progress}%)`
                                            }}
                                        />
                                    </div>

                                    {/* Volume Controls */}
                                    <div className="flex items-center gap-2 group/volume">
                                        <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors">
                                            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                        </button>
                                        <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 ease-out flex items-center">
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={isMuted ? 0 : volume}
                                                onChange={(e) => {
                                                    const newVol = parseFloat(e.target.value);
                                                    setVolume(newVol);
                                                    if (videoRef.current) {
                                                        videoRef.current.volume = newVol;
                                                    }
                                                    setIsMuted(newVol === 0);
                                                }}
                                                className="w-20 h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                                                style={{
                                                    background: `linear-gradient(to right, ${config.accentColor} ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%)`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeInView>
                    </div>
                ) : (
                    /* --- STANDARD IMAGE LAYOUT (Image -> Title -> Gallery) --- */
                    <div className="flex flex-col items-center">
                        <FadeInView className="w-full max-w-4xl mb-12 relative group">
                            <div
                                className="relative aspect-video w-full overflow-hidden border-4 border-white/20 bg-black/50 shadow-2xl"
                                style={{
                                    boxShadow: `0 20px 50px -10px ${config.accentColor}30`,
                                    borderColor: config.accentBorder
                                }}
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[2] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
                                <img
                                    src={config.mainImage || config.bgImage || project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-white/80 z-20" />
                                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-white/80 z-20" />
                            </div>
                        </FadeInView>

                        <HeaderSection />

                        {/* Gallery (Only for Non-Video) */}
                        <FadeInView delay={500} className="w-full max-w-5xl mt-12">
                            <div className="flex items-center gap-4 mb-6">
                                <ImageIcon className="w-5 h-5 text-white/50" />
                                <span className="text-sm uppercase tracking-widest text-white/50 font-bold">Gallery</span>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(config.galleryImages || Array(4).fill(config.bgImage || project.image)).map((imgSrc, i) => (
                                    <div
                                        key={i}
                                        className="aspect-video bg-black/50 border border-white/10 overflow-hidden relative group cursor-pointer hover:border-white/50 transition-colors"
                                    >
                                        <img
                                            src={imgSrc}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0"
                                            alt={`Gallery visual ${i + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </FadeInView>

                        {/* Common: Action Widgets (For non-video, keep centered) */}
                        <FadeInView delay={400} className="flex gap-4 mt-8 flex-wrap justify-center items-stretch">
                            <StoreBadge platform="taptap" link={project.link} accentColor={config.accentColor} />
                            {(project.award || project.badge) && (
                                <>
                                    <div className="w-1 bg-yellow-400/80 self-stretch" />
                                    <AwardBadge
                                        accentColor={config.accentColor}
                                        label={project.award ? "AWARD WINNER" : "FEATURED"}
                                        value={project.award || project.badge || ""}
                                    />
                                </>
                            )}
                        </FadeInView>
                    </div>
                )}

            </div>
        </section>
    );
}
