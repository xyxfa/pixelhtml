/**
 * PixelParticles - Stardew Valley style floating sparkle particles
 * Design: Warm golden and green sparkles floating gently
 */
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const COLORS = [
  "oklch(0.78 0.15 85 / 0.25)",   // gold
  "oklch(0.72 0.12 142 / 0.2)",   // leaf light
  "oklch(0.68 0.16 35 / 0.15)",   // coral
  "oklch(0.85 0.06 230 / 0.15)",  // sky light
];

export default function PixelParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: Math.random() * 15 + 12,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
