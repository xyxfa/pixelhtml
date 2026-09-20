/**
 * Home Page - Pixel Portfolio (Reimagined)
 * Layout: Immersive Full-Screen Sections (78 style)
 * Aesthetic: Cyberpunk/Retro Pixel Art
 */
import { useTranslation } from "react-i18next";
import RoutePreview from "@/components/RoutePreview";
import "@/components/RoutePreview.css";
import PixelNav from "@/components/PixelNav";
import HeroSection from "@/components/HeroSection";
import HeroAtmosphere from "@/components/HeroAtmosphere";
import XuanjiSection from "@/components/XuanjiSection";
import ReverseSection from "@/components/ReverseSection";
import ContactSection from "@/components/ContactSection";
import GuestbookSection from "@/components/GuestbookSection";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import GameSection from "@/components/GameSection";
import ScrollToTop from "@/components/ScrollToTop";
import PixelParticles from "@/components/PixelParticles";
import ParallaxBackground from "@/components/ParallaxBackground";
import { vrGameConfigs, gamejamGameConfigs } from "@/gameData";

export default function Home() {
  const { t } = useTranslation();
  const routePreview = true;

  // Get project data from translations
  const vrProjects = t("vr.projects", { returnObjects: true }) as Array<{
    title: string;
    description: string;
    tags: string[];
    year: string;
    category: string;
    award?: string;
    image?: string;
    badge?: string;
  }>;

  const gamejamProjects = t("gamejam.projects", {
    returnObjects: true,
  }) as Array<{
    id?: string;
    galleryLabels?: string[];
    title: string;
    description: string;
    tags: string[];
    year: string;
    category: string;
    award?: string;
    image?: string;
    badge?: string;
  }>;

  const gamejamContent = (
    <div id="gamejam" className="scroll-mt-20">
      {gamejamProjects.map((project, i) => {
        const isAutumnMust = project.id === "autumn-must";
        return (
          <div
            key={project.id || `gj-${i}`}
            id={project.id}
            className="scroll-mt-20"
          >
            <GameSection
              project={project}
              config={gamejamGameConfigs[i] || gamejamGameConfigs[0]}
              index={i + vrProjects.length - 1}
              compact={isAutumnMust}
              galleryTitle={t("gamejam.galleryTitle")}
              galleryLabels={
                isAutumnMust
                  ? (t("autumnMust.gallery", {
                      returnObjects: true,
                    }) as string[])
                  : project.galleryLabels
              }
            />
          </div>
        );
      })}
    </div>
  );
  const vrContent = (
    <div id="vr">
      <SectionDivider
        id="vr"
        title={t("vr.title")}
        subtitle={t("vr.subtitle")}
        accentColor="#a78bfa"
      />
      <XuanjiSection />
      <ReverseSection />
      {vrProjects.slice(2).map((project, i) => {
        const realIndex = i + 2;
        return (
          <GameSection
            key={`vr-${realIndex}`}
            project={project}
            config={
              vrGameConfigs[realIndex] ||
              vrGameConfigs[vrGameConfigs.length - 1]
            }
            index={realIndex}
          />
        );
      })}
    </div>
  );

  return (
    <div
      className={`min-h-screen bg-cream text-wood-dark overflow-x-hidden relative ${routePreview ? "route-preview-enabled" : ""}`}
    >
      {/* Warm ink-style multi-layer parallax background */}
      <ParallaxBackground />

      {/* Global background particles to make the scene feel more alive */}
      <PixelParticles />

      <PixelNav />
      <div className={routePreview ? "connected-world" : undefined}>
        {routePreview && (
          <img
            className="connected-world-art"
            src="/tech-journal/connected-world.png"
            alt="怪物岛的木桥与蜿蜒道路相连，跨过溪流抵达作品空地"
            width="1024"
            height="1536"
          />
        )}
        {routePreview && <HeroAtmosphere />}
        <HeroSection />

        {/* GameJam entrance; Autumn Must is the first entry. */}
        {routePreview ? (
          <RoutePreview title={t("gamejam.title")} />
        ) : (
          <SectionDivider
            id="gamejam-heading"
            title={t("gamejam.title")}
            subtitle={t("gamejam.subtitle")}
            accentColor="#fb923c"
          />
        )}
      </div>

      {gamejamContent}
      {vrContent}

      <GuestbookSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
