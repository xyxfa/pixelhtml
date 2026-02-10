import { ShoppingBag } from "lucide-react";

interface StoreBadgeProps {
    platform: "steam" | "itch" | "taptap" | "other";
    link?: string;
    accentColor: string;
    // Optional text shown on the right side of the badge (e.g. award info)
    rightLabel?: string;
}

export default function StoreBadge({ platform, link, accentColor, rightLabel }: StoreBadgeProps) {
    if (!link) return null;

    const getIcon = () => {
        switch (platform) {
            case "steam": return "🎮";
            case "itch": return "🔥";
            case "taptap": return (
                <div className="w-5 h-5 bg-[#00cccc] flex items-center justify-center rounded-sm">
                    <span className="text-white font-bold text-[10px] leading-none mb-[1px]">T</span>
                </div>
            );
            default: return <ShoppingBag className="w-4 h-4" />;
        }
    };

    const getLabel = () => {
        switch (platform) {
            case "steam": return "Get it on Steam";
            case "itch": return "Available on itch.io";
            case "taptap": return "Play on TapTap";
            default: return "Play Now";
        }
    };

    const isTapTap = platform === "taptap";
    const brandColor = isTapTap ? "#01cccc" : accentColor;

    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-start bg-black text-white p-0 border-2 border-white/20 hover:border-white transition-all duration-300 overflow-hidden relative min-w-[180px] shadow-[4px_4px_0_rgba(0,0,0,0.3)]"
            style={{
                boxShadow: `4px 4px 0 0 ${brandColor}dd`,
            }}
        >
            {/* Background Texture - Dithered Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '4px 4px'
                }}
            />

            <div className="flex items-center justify-between gap-4 px-5 py-3 w-full z-10 relative">
                <div className="flex items-center gap-4">
                    {/* Icon Container with Glow */}
                    <div className="relative">
                        <span className="text-xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] relative z-10 flex items-center justify-center">
                            {getIcon()}
                        </span>
                        {isTapTap && (
                            <div className="absolute inset-0 bg-[#01cccc] blur-md opacity-40 animate-pulse" />
                        )}
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] font-pixel uppercase tracking-[0.2em] text-white/50 leading-none mb-1.5 group-hover:text-white/80 transition-colors">
                            {isTapTap ? "DISCOVER" : "PLAY"}
                        </span>
                        <span className="font-pixel text-xs sm:text-sm leading-none tracking-wider group-hover:scale-105 origin-left transition-transform duration-300">
                            {getLabel()}
                        </span>
                    </div>
                </div>

                {rightLabel && (
                    <div className="ml-4 pl-4 border-l-2 border-white/10 text-right">
                        <span className="block text-[10px] leading-tight font-pixel text-white/60 group-hover:text-white/90 transition-colors">
                            {rightLabel}
                        </span>
                    </div>
                )}
            </div>

            {/* Hover Shine Effect */}
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:left-full transition-all duration-700 ease-in-out" />

            {/* Active Border Glow */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-white w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: brandColor }} />
        </a>
    );
}
