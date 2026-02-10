/**
 * VRSection - Stardew Valley style VR works showcase
 * Design: Warm section with magical workshop banner
 */
import { useTranslation } from "react-i18next";
import ProjectCard, { type ProjectData } from "./ProjectCard";

const VR_BANNER = "https://private-us-east-1.manuscdn.com/sessionFile/68QuHX5bxB538qT9YMizQK/sandbox/CoFdBaHLuYs6HNCYRmYbx2-img-2_1770551691000_na1fn_c3RhcmRldy12cg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNjhRdUhYNWJ4QjUzOHFUOVlNaXpRSy9zYW5kYm94L0NvRmRCYUhMdVlzNkhOQ1lSbVlieDItaW1nLTJfMTc3MDU1MTY5MTAwMF9uYTFmbl9jM1JoY21SbGR5MTJjZy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=lglo7dRX3j0wxfX6mFn6K8L2PbKjStDDJi4arZ77c7Iz~c61GeLkeTFns-HiLeazad~6M5tq5PwrlK~XfBSrZX7j8gxV5-beIBDr7D1jGe4IILdpVSlLZTeG5NV64OW2eJz0gJoxv3HlOB6Eu0~AEXLkQDybdlLyRFNlo~gzrakYbb9o7pet1QjuoGjp986Nd4GOz52swEgN13vwOyvvpt54bnBws9J03nz~nfeB3o-MkPayxWGcVbSXgUwRJErh8u2xHwJXc~LAEXAnY29ZZDm~36gDvvMkQTUYEJuC69ad2Bts~fV~aCpYM6vYFZ3aGdjy~gb38GHjjgjxaPuqVw__";

// Static images for projects are kept here, as JSON translation files don't support imports/variables easily
// We will merge these images with the translated data
const projectImages = [
  "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=600&h=400&fit=crop",
];

export default function VRSection() {
  const { t } = useTranslation();

  // Get translated projects data
  const projectsData = t("vr.projects", { returnObjects: true }) as Partial<ProjectData>[];

  // Merge with images
  const vrProjects: ProjectData[] = projectsData.map((p, i) => ({
    ...p,
    image: projectImages[i] || "",
    // Ensure required fields exist if translation fails or is partial
    title: p.title || "",
    description: p.description || "",
    tags: p.tags || [],
    year: p.year || "",
    category: p.category || "VR",
  }));

  return (
    <section id="vr" className="py-20 bg-parchment">
      <div className="container">
        {/* Section Title */}
        <div className="text-center mb-6">
          <h2 className="font-pixel text-base sm:text-lg text-wood inline-block">
            {t("vr.title")}
          </h2>
          <p className="font-body text-sm text-wood-light mt-2">{t("vr.subtitle")}</p>
        </div>

        {/* Banner */}
        <div className="wood-panel overflow-hidden mb-10 max-w-4xl mx-auto">
          <div className="relative h-48 sm:h-64">
            <img src={VR_BANNER} alt="VR Workshop" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-wood-dark/60 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span className="font-pixel text-xs text-cream drop-shadow-lg">{t("vr.banner_text")}</span>
            </div>
          </div>
        </div>

        {/* Project Cards */}
        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {vrProjects.map((project, i) => (
            <div key={project.title} className="w-full max-w-md md:max-w-[calc(50%-1rem)]">
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
