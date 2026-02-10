import FadeInView from "./FadeInView";

interface SectionDividerProps {
    id: string;
    title: string;
    subtitle: string;
    accentColor?: string; // Kept for interface compatibility, but we might override with wood tones
}

export default function SectionDivider({ id, title, subtitle, accentColor = "#a78bfa" }: SectionDividerProps) {
    return (
        <section
            id={id}
            className="relative py-24 md:py-32 overflow-hidden"
            style={{ backgroundColor: "oklch(0.97 0.015 85)" }} // Cream background
        >
            {/* Wood Grain Texture Overlay (Optional, using CSS pattern instead) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")` }}
            />

            <div className="container mx-auto px-6 relative z-10">
                <FadeInView>
                    <div className="flex items-center gap-6 mb-4 justify-center">
                        {/* Left Leaf/Vine Decoration */}
                        <div className="text-xl">🌿</div>

                        <span
                            className="font-pixel text-xs tracking-[0.2em] uppercase text-[#8b4513]"
                            style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.1)" }}
                        >
                            {subtitle}
                        </span>

                        {/* Right Leaf/Vine Decoration */}
                        <div className="text-xl transform scale-x-[-1]">🌿</div>
                    </div>
                </FadeInView>
                <FadeInView delay={100}>
                    <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl text-[#5c4033] text-center leading-tight drop-shadow-sm">
                        {title}
                    </h2>
                    {/* Wood Beam Underline */}
                    <div className="w-24 h-2 mx-auto mt-4 bg-[#8b4513] border-2 border-[#5c4033] rounded-sm shadow-sm" />
                </FadeInView>
            </div>
        </section>
    );
}
