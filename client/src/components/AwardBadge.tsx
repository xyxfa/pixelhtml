import { Trophy } from "lucide-react";

interface AwardBadgeProps {
    label?: string; // e.g. "AWARD WINNER"
    value: string;
    accentColor: string;
}

export default function AwardBadge({ label = "AWARD WINNER", value, accentColor }: AwardBadgeProps) {
    if (!value) return null;

    return (
        <div
            className="group flex items-center gap-3 bg-black/80 text-white px-5 py-3 border-2 border-white/20 hover:border-white transition-all duration-200 overflow-hidden relative"
            style={{ boxShadow: `4px 4px 0 0 ${accentColor}` }}
        >
            <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />
            <div className="flex flex-col min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-white/45 leading-none mb-1">
                    {label}
                </span>
                <span className="font-pixel text-[10px] sm:text-xs leading-none text-yellow-100 whitespace-nowrap">
                    {value}
                </span>
            </div>

            {/* Hover Highlight */}
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
        </div>
    );
}


