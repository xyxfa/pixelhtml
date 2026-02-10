/**
 * PixelDivider - Stardew Valley style decorative divider
 * Design: Pixel flowers and leaves pattern with warm earth tones
 */

interface PixelDividerProps {
  variant?: "flowers" | "leaves" | "stars";
}

export default function PixelDivider({ variant = "flowers" }: PixelDividerProps) {
  const colorSets = {
    flowers: ["oklch(0.68 0.16 35)", "oklch(0.58 0.14 140)", "oklch(0.78 0.15 85)"],
    leaves: ["oklch(0.58 0.14 140)", "oklch(0.72 0.12 142)", "oklch(0.65 0.08 140)"],
    stars: ["oklch(0.78 0.15 85)", "oklch(0.68 0.16 35)", "oklch(0.72 0.1 230)"],
  };

  const colors = colorSets[variant];

  return (
    <div className="flex items-center justify-center py-6">
      <div className="flex items-center gap-1.5">
        {/* Left pattern */}
        {[3, 2, 1].map((size) => (
          <div
            key={`l-${size}`}
            style={{
              width: `${size * 3}px`,
              height: `${size * 3}px`,
              backgroundColor: colors[0],
              opacity: size * 0.2,
            }}
          />
        ))}

        {/* Center diamond */}
        <div
          className="w-3 h-3 rotate-45 mx-2"
          style={{ backgroundColor: colors[1] }}
        />

        {/* Right pattern */}
        {[1, 2, 3].map((size) => (
          <div
            key={`r-${size}`}
            style={{
              width: `${size * 3}px`,
              height: `${size * 3}px`,
              backgroundColor: colors[2],
              opacity: size * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
