import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FadeInView from "./FadeInView";
import { vrGameConfigs } from "../gameData";

export default function ReverseSection() {
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);

  const projects = t("vr.projects", { returnObjects: true }) as Array<{
    title: string;
    description: string;
    tags: string[];
    year: string;
    category: string;
    award?: string | string[];
  }>;

  const project = projects[1];
  const config = vrGameConfigs[1];

  // 和「璇玑蜀律」一样：监听滚动，让背景产生柔和视差滚动
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      setScrollY(y);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bgOffset = scrollY * 0.55;

  const renderRichDescription = (text: string) => {
    const sentences = text
      .split(/(?<=[。！？!?.])\s*/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (sentences.length === 0) {
      return (
        <p className="typo-game-desc text-wood-dark">
          {text}
        </p>
      );
    }

    const [lead, second, ...rest] = sentences;

    return (
      <div className="space-y-2 text-wood-dark">
        <p className="typo-game-desc text-[1.02rem] md:text-lg font-semibold tracking-[0.08em]">
          {lead}
        </p>
        {second && (
          <p className="typo-game-desc text-sm md:text-base opacity-90">
            {second}
          </p>
        )}
        {rest.length > 0 && (
          <p className="typo-game-desc text-xs md:text-sm opacity-80 leading-relaxed">
            {rest.join(" ")}
          </p>
        )}
      </div>
    );
  };

  if (!project) return null;

  return (
    <section
      id="reverse"
      className="relative min-h-screen flex items-center border-b-4 border-wood-dark overflow-hidden bg-cream"
    >
      {/* 背景层：与「璇玑蜀律」保持一致的动态滚动视差效果 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${config.bgImage})`,
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

      {/* Cream + pixel overlay for Stardew-style pixel mood - Reduced opacity for clarity */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-cream/35 to-cream/50" />

      <div className="relative z-10 container px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center">
          {/* Left: Pixel-styled info panel */}
          <div className="w-full lg:pr-8 flex flex-col items-center">
            {/* 顶部标题：保持居中、像作品主视觉标题 */}
            <FadeInView delay={180}>
              <div className="w-full flex justify-center mb-6">
                <h2>
                  <span className="inline-block px-6 py-3 border-[3px] border-wood-dark bg-cream/95 shadow-[4px_4px_0_rgba(0,0,0,0.7)]">
                    <span className="typo-flagship-title text-wood-dark tracking-[0.28em] font-pixel">
                      {project.title}
                    </span>
                  </span>
                </h2>
              </div>
            </FadeInView>

            {/* 中间为长文介绍区 */}
            <FadeInView delay={260}>
              <div className="parchment-panel p-5 md:p-6 rounded-sm space-y-5 w-full max-w-xl">
                {renderRichDescription(project.description)}

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="pixel-tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {project.category && (
                    <span className="typo-game-meta text-[9px] uppercase text-wood/80">
                      {project.category}
                    </span>
                  )}
                  {Array.isArray(project.award)
                    ? project.award.map((award) => (
                      <span
                        key={award}
                        className="pixel-tag bg-gold/20 border-gold-dark text-wood-dark"
                        style={{
                          fontSize: '13px',
                          padding: '6px 12px',
                          borderWidth: '3px',
                          boxShadow: '3px 3px 0 0 rgba(0,0,0,0.3)',
                          fontWeight: '600',
                        }}
                      >
                        {award}
                      </span>
                    ))
                    : project.award && (
                      <span
                        className="pixel-tag bg-gold/20 border-gold-dark text-wood-dark"
                        style={{
                          fontSize: '13px',
                          padding: '6px 12px',
                          borderWidth: '3px',
                          boxShadow: '3px 3px 0 0 rgba(0,0,0,0.3)',
                          fontWeight: '600',
                        }}
                      >
                        {project.award}
                      </span>
                    )}
                </div>
              </div>
            </FadeInView>

            {/* 底部右侧放一个「VR作品 {year}」信息卡，与璇玑蜀律保持一致 */}
            <FadeInView delay={340}>
              <div className="w-full max-w-xl mt-5 flex justify-end">
                <div className="wood-panel px-5 py-3 bg-cream/95 border-[3px] border-wood-dark shadow-[4px_4px_0_rgba(0,0,0,0.7)]">
                  <span className="typo-game-meta text-[10px] sm:text-xs tracking-[0.3em] text-wood-dark/90">
                    {t("vr.flagship_badge", { year: project.year })}
                  </span>
                </div>
              </div>
            </FadeInView>
          </div>

          {/* Right: VR preview in pixel frame */}
          <FadeInView delay={220} className="w-full">
            <div className="w-full max-w-2xl lg:max-w-none lg:ml-auto">
              <div
                className="relative aspect-video lg:aspect-[16/9] border-4 border-wood-dark bg-black shadow-2xl overflow-hidden"
                style={{
                  boxShadow: "6px 6px 0 rgba(0,0,0,0.4)",
                }}
              >
                {/* CRT / pixel scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,255,255,0.08),rgba(0,0,0,0.08),rgba(255,255,255,0.08))] bg-[length:100%_2px,3px_100%] opacity-25 mix-blend-screen pointer-events-none" />

                <video
                  src={config.videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  loop
                  playsInline
                />
              </div>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
}


