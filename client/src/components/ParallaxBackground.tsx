/**
 * ParallaxBackground - Warm ink-style multi-layer parallax background
 * Layers:
 *  - Background: soft cream gradient + large ink wash
 *  - Midground: golden / brown curves and brush strokes
 *  - Foreground: stronger strokes following scroll 1.0x
 *
 * Design goals:
 *  - 3 layers with different scroll speeds (1.0 / 0.7 / 0.4)
 *  - Warm ink / handmade texture (cream, brown, gold)
 *  - No text or decorative UI elements, pure texture
 */

import { useEffect, useState } from "react";

export default function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      setScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fgOffset = scrollY * 1.0; // 前景层：跟随滚动
  const midOffset = scrollY * 0.7; // 中景层：稍慢
  const bgOffset = scrollY * 0.4; // 背景层：最慢

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {/* 背景层：柔和的奶油色水墨底纹 */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${bgOffset}px)`,
          willChange: "transform",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 1200 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='inkBg' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%' stop-color='%23f7f0dc'/%3E%3Cstop offset='100%' stop-color='%23f0e0c0'/%3E%3C/linearGradient%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23inkBg)'/%3E%3Cpath d='M-100 520 C 180 430 430 450 720 390 C 960 340 1130 300 1370 340 L 1370 900 L -100 900 Z' fill='%23c29c6a' fill-opacity='0.22'/%3E%3Crect width='1200' height='800' filter='url(%23noise)' opacity='0.07'/%3E%3C/svg%3E\")",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* 中景层：金色与棕色的弧形笔触 */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${midOffset}px)`,
          willChange: "transform",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 1200 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-60 360 C 160 310 320 330 540 300 C 740 270 900 260 1270 280' fill='none' stroke='%23b4874f' stroke-width='26' stroke-linecap='round' stroke-opacity='0.45'/%3E%3Cpath d='M-80 520 C 220 470 430 480 660 450 C 900 420 1090 410 1350 430' fill='none' stroke='%23d9aa5a' stroke-width='20' stroke-linecap='round' stroke-opacity='0.55'/%3E%3Cpath d='M-40 650 C 260 620 480 610 760 600 C 980 590 1210 600 1380 610' fill='none' stroke='%23825e3b' stroke-width='18' stroke-linecap='round' stroke-opacity='0.35'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "multiply",
          opacity: 0.9,
        }}
      />

      {/* 前景层：更粗的前景笔触和水痕 */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${fgOffset}px)`,
          willChange: "transform",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 1200 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-120 260 C 120 220 360 240 620 210 C 860 185 1040 190 1320 210' fill='none' stroke='%23865b30' stroke-width='34' stroke-linecap='round' stroke-opacity='0.5'/%3E%3Cpath d='M-60 300 C 160 280 360 270 580 260 C 860 245 1040 250 1320 260' fill='none' stroke='%23f0c674' stroke-width='16' stroke-linecap='round' stroke-opacity='0.45'/%3E%3Cpath d='M-80 180 Q 240 120 520 160 T 1180 140' fill='none' stroke='%23b37a3c' stroke-width='18' stroke-linecap='round' stroke-opacity='0.35'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "multiply",
          opacity: 0.98,
        }}
      />
    </div>
  );
}


