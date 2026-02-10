/**
 * ProjectCard - Stardew Valley style project card
 * Design: Warm wood-framed card with cozy styling
 */

export interface ProjectData {
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: "VR" | "GameJam";
  year: string;
  link?: string;
  award?: string;
}

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const c = project.category === "VR"
    ? { bg: "bg-sky/20", text: "text-sky", border: "border-sky" }
    : { bg: "bg-coral/20", text: "text-coral", border: "border-coral" };

  return (
    <div
      className="wood-panel group overflow-hidden hover:-translate-y-1 transition-transform duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`font-pixel text-[7px] px-2 py-1 ${c.bg} ${c.text} border-2 ${c.border}`}>
            {project.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="font-pixel text-[7px] px-2 py-1 bg-cream/90 text-wood-dark border-2 border-wood">
            {project.year}
          </span>
        </div>
        {project.award && (
          <div className="absolute bottom-3 left-3">
            <span className="font-pixel text-[7px] px-2 py-1 bg-gold/90 text-wood-dark border-2 border-gold-dark">
              {project.award}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-pixel text-[10px] text-wood-dark mb-2 leading-relaxed">
          {project.title}
        </h3>
        <p className="font-body text-xs text-foreground/70 leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="pixel-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
