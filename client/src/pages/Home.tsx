/**
 * Home Page - Pixel Portfolio (Reimagined)
 * Layout: Immersive Full-Screen Sections (78 style)
 * Aesthetic: Cyberpunk/Retro Pixel Art
 */
import { useTranslation } from "react-i18next";
import PixelNav from "@/components/PixelNav";
import HeroSection from "@/components/HeroSection";
import XuanjiSection from "@/components/XuanjiSection";
import ReverseSection from "@/components/ReverseSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import GameSection from "@/components/GameSection";
import ScrollToTop from "@/components/ScrollToTop";
import PixelParticles from "@/components/PixelParticles";
import ParallaxBackground from "@/components/ParallaxBackground";
import { vrGameConfigs, gamejamGameConfigs } from "@/gameData";

export default function Home() {
  const { t } = useTranslation();

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
    title: string;
    description: string;
    tags: string[];
    year: string;
    category: string;
    award?: string;
    image?: string;
    badge?: string;
  }>;

  return (
    <div className="min-h-screen bg-cream text-wood-dark overflow-x-hidden relative">
      {/* Warm ink-style multi-layer parallax background */}
      <ParallaxBackground />

      {/* Global background particles to make the scene feel more alive */}
      <PixelParticles />

      <PixelNav />
      <HeroSection />

      {/* VR Projects Section Divider */}
      <SectionDivider
        id="vr"
        title={t("vr.title")}
        subtitle={t("vr.subtitle")}
        accentColor="#a78bfa"
      />

      {/* Flagship VR Project - Xuanji, now placed under the VR section */}
      <XuanjiSection />

      {/* Second VR Project - Reverse Scripture, using the same layout as Xuanji */}
      <ReverseSection />

      {/* Immersive VR Game Sections (skip the first two, used in XuanjiSection & ReverseSection above) */}
      {vrProjects.slice(2).map((project, i) => {
        const realIndex = i + 2;
        return (
          <GameSection
            key={`vr-${realIndex}`}
            project={project}
            config={vrGameConfigs[realIndex] || vrGameConfigs[vrGameConfigs.length - 1]}
            index={realIndex}
          />
        );
      })}

      {/* GameJam Projects Section Divider */}
      <SectionDivider
        id="gamejam"
        title={t("gamejam.title")}
        subtitle={t("gamejam.subtitle")}
        accentColor="#fb923c"
      />

      {/* Immersive GameJam Game Sections (still using pixel-card style sections) */}
      {gamejamProjects.map((project, i) => (
        <GameSection
          key={`gj-${i}`}
          project={project}
          config={gamejamGameConfigs[i] || gamejamGameConfigs[0]}
          index={i + vrProjects.length}
        />
      ))}

      <ContactSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
