/**
 * HeroSection - Stardew Valley style hero with pastoral landscape
 * Design: Warm countryside scene with cozy welcome message
 */
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/68QuHX5bxB538qT9YMizQK/sandbox/CoFdBaHLuYs6HNCYRmYbx2-img-1_1770551673000_na1fn_c3RhcmRldy1oZXJv.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNjhRdUhYNWJ4QjUzOHFUOVlNaXpRSy9zYW5kYm94L0NvRmRCYUhMdVlzNkhOQ1lSbVlieDItaW1nLTFfMTc3MDU1MTY3MzAwMF9uYTFmbl9jM1JoY21SbGR5MW9aWEp2LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=qQ~3Df4bvoc-ZlWQ5Xw531vCpVnmf9IhocoIaPPy5k7mbsHGmlyUem4ovts7i3qVpd2D~-B9vnnXEPw2unZ93wyCFZFwEmX3svvYnc2Hy384XXEMi-C9BtD6OwHmnp~9NzOmmIBM6NbYT428t--03~f4FaeIfd0-kLc2pnlvbzup91tVMjTgVaRkTxP9gBCSW6EblewUMC~55PAA3z0mpYFLQn--G0Pb93otfqWHaMQnKFD4ejpL2gtIUJbQ0Z6W1vOuaoRA9JqI-xhvZNirxnPFHG0uVHYmUNQXNCE8ASPpPPOsSDW70R9uKh~bJwCqjzknKNLdBaivM5kEGKx2Mg__";

export default function HeroSection() {
  const { t } = useTranslation();
  const [typedText, setTypedText] = useState("");
  const fullText = t("hero.title");

  useEffect(() => {
    setTypedText(""); // Reset text when language changes to restart typing effect properly
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 120);
    return () => clearInterval(timer);
  }, [fullText]);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pb-0 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt="Pixel art countryside"
          className="w-full h-full object-cover"
          style={{ imageRendering: "auto" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container pb-32 pt-24">
        <div className="max-w-2xl">
          {/* Welcome badge */}
          <div className="inline-block mb-6">
            <div className="wood-panel px-6 py-3">
              <span className="typo-section-label text-wood-dark">
                {t("hero.badge")}
              </span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="typo-hero-title text-wood-dark mb-6"
            style={{
              textShadow: '3px 3px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 2px 0 0 white, -2px 0 0 white, 0 2px 0 white, 0 -2px 0 white'
            }}>
            {typedText}
            <span className="animate-pulse text-coral">_</span>
          </h1>

          {/* Subtitle */}
          <div className="mb-10 max-w-xl">
            <p className="typo-hero-subtitle text-wood-dark font-medium leading-relaxed"
              style={{
                textShadow: '1.5px 1.5px 0 white, -1.5px -1.5px 0 white, 1.5px -1.5px 0 white, -1.5px 1.5px 0 white, 1.5px 0 0 white, -1.5px 0 0 white, 0 1.5px 0 white, 0 -1.5px 0 white, 2px 2px 4px rgba(0,0,0,0.1)'
              }}>
              {t("hero.subtitle")}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button onClick={() => scrollTo("#vr")} className="pixel-btn">
              {t("hero.cta_vr")}
            </button>
            <button onClick={() => scrollTo("#gamejam")} className="pixel-btn pixel-btn-coral">
              {t("hero.cta_gamejam")}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => scrollTo("#vr")}
          className="animate-bounce text-wood/60 hover:text-wood transition-colors"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
}
