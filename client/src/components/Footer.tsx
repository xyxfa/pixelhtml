/**
 * Footer - Stardew Valley style footer
 * Design: Simple warm footer with pixel font
 */
import { Gamepad2, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="py-8 bg-cream border-t-4 border-wood/20">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-leaf" />
            <span className="font-pixel text-[8px] text-wood-light">
              PIXEL PORTFOLIO
            </span>
          </div>

          {/* Center */}
          <div className="flex items-center gap-2 text-wood-light">
            <span className="font-pixel text-[7px]">{t("footer.made_with")}</span>
            <Heart className="w-3 h-3 text-coral fill-coral" />
            <span className="font-pixel text-[7px]">{t("footer.and_pixels")}</span>
          </div>

          {/* Right */}
          <span className="font-pixel text-[7px] text-wood-light">
            {t("footer.copyright")}
          </span>
        </div>

        {/* Pixel decorative bar - warm earth tones */}
        <div className="flex items-center justify-center gap-1 mt-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2"
              style={{
                backgroundColor:
                  i % 4 === 0
                    ? "oklch(0.58 0.14 140)"  // leaf green
                    : i % 4 === 1
                      ? "oklch(0.68 0.16 35)"   // coral
                      : i % 4 === 2
                        ? "oklch(0.78 0.15 85)"   // gold
                        : "oklch(0.72 0.1 230)",  // sky blue
                opacity: 0.3 + (i % 3) * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
