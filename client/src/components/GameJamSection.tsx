/**
 * GameJamSection - True Pixel Art "Quest Board"
 * Design: Hard-edged, box-shadow borders, no anti-aliasing.
 */
import { useTranslation } from "react-i18next";
import { type ProjectData } from "./ProjectCard";
import PixelDivider from "./PixelDivider";

const projectImages = [
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop",
];

export default function GameJamSection() {
  const { t } = useTranslation();

  // Get translated projects data
  const projectsData = t("gamejam.projects", { returnObjects: true }) as Partial<ProjectData>[];

  // Merge with images
  const gamejamProjects: ProjectData[] = projectsData.map((p, i) => ({
    ...p,
    image: projectImages[i] || "",
    title: p.title || "",
    description: p.description || "",
    tags: p.tags || [],
    year: p.year || "",
    category: p.category || "GameJam",
  }));

  return (
    <section id="gamejam" className="py-24 relative bg-[#2d1b14] overflow-hidden">
      {/* Pixelated Background Pattern (Checkerboard/Wood) */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(45deg, #1a0f0a 25%, transparent 25%), linear-gradient(-45deg, #1a0f0a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a0f0a 75%), linear-gradient(-45deg, transparent 75%, #1a0f0a 75%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
        }}
      />

      <div className="container relative z-10 max-w-[1280px] mx-auto px-4">

        {/* Main Board Frame - Deep Pixel Style */}
        <div className="bg-[#c28742] p-2 md:p-4"
          style={{
            boxShadow: "inset 0 0 0 4px #5e3612, 8px 8px 0 0 rgba(0,0,0,0.5)"
          }}>
          {/* Inner Dark Board */}
          <div className="bg-[#4a2810] p-6 pt-16 min-h-[600px] relative border-4 border-[#301908]">

            {/* Board Header Title pinned at top */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#e6d5ac] text-[#3d2410] px-8 py-4 z-20"
              style={{
                boxShadow: "4px 4px 0 0 #000000, inset 2px 2px 0 0 #fff"
              }}>
              {/* Nails */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-[#8c8c8c] shadow-[1px_1px_0_0_#000]" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#8c8c8c] shadow-[1px_1px_0_0_#000]" />

              <h2 className="text-2xl md:text-3xl font-pixel uppercase tracking-widest text-center">
                {t("gamejam.title")}
              </h2>
            </div>

            {/* Subtitle pinned note */}
            <div className="text-center mb-12">
              <div className="inline-block bg-[#fffdf0] p-4 max-w-lg mx-auto relative"
                style={{ boxShadow: "4px 4px 0 0 rgba(0,0,0,0.3)" }}>
                <div className="w-3 h-3 bg-[#e34234] absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[1px_1px_0_0_#000]" />
                <p className="font-pixel text-xs text-[#5c4033] leading-relaxed">
                  {t("gamejam.subtitle")}
                </p>
              </div>
            </div>

            {/* Papers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 md:px-8 pb-12">
              {gamejamProjects.map((project, i) => (
                <div
                  key={project.title}
                  className="group relative bg-[#fffdf0] p-4 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:translate-x-[-1px]"
                  style={{
                    boxShadow: "4px 4px 0 0 rgba(0,0,0,0.4), inset 0 0 0 2px #e6d5ac"
                  }}
                >
                  {/* Pin Color variation */}
                  {i % 3 === 0 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#e34234] border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] z-10" />}
                  {i % 3 === 1 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2e86de] border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] z-10" />}
                  {i % 3 === 2 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#10ac84] border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] z-10" />}

                  {/* Image Frame */}
                  <div className="bg-[#2d3436] p-1 mb-3 border-2 border-[#5c4033] shadow-[2px_2px_0_0_#d1ccc0]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full aspect-video object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 flex flex-col font-pixel">
                    <h3 className="text-xs md:text-sm text-[#2d3436] mb-2 leading-snug uppercase border-b-2 border-dotted border-[#b2bec3] pb-2">
                      {project.title}
                    </h3>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags?.map(tag => (
                        <span key={tag} className="text-[8px] sm:text-[10px] text-[#fff] bg-[#b2bec3] px-1 py-0.5 border-b-2 border-r-2 border-[#636e72]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-[10px] md:text-xs text-[#636e72] leading-4 mb-4 font-pixel opacity-80 h-16 overflow-hidden">
                      {project.description}
                    </p>

                    <div className="mt-auto flex justify-between items-center bg-[#dfe6e9] p-2 border-t-2 border-[#b2bec3] -mx-2 -mb-2">
                      {/* Open link logic to be implemented */}
                      <span className="text-[10px] text-[#636e72]">{project.year}</span>
                      <div className="text-[10px] text-[#2d3436] font-bold hover:text-[#d63031] cursor-pointer">
                        OPEN &gt;&gt;
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Decor */}
        <div className="mt-12 text-center">
          <PixelDivider variant="leaves" />
        </div>
      </div>
    </section>
  );
}
