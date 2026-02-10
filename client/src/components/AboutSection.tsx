/**
 * AboutSection - Stardew Valley style character info panel
 * Design: Warm wood-framed character card with skill bars
 */
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const AVATAR = "https://private-us-east-1.manuscdn.com/sessionFile/68QuHX5bxB538qT9YMizQK/sandbox/CoFdBaHLuYs6HNCYRmYbx2-img-4_1770551699000_na1fn_c3RhcmRldy1hdmF0YXI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNjhRdUhYNWJ4QjUzOHFUOVlNaXpRSy9zYW5kYm94L0NvRmRCYUhMdVlzNkhOQ1lSbVlieDItaW1nLTRfMTc3MDU1MTY5OTAwMF9uYTFmbl9jM1JoY21SbGR5MWhkbUYwWVhJLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=u1udvkLZJ9J5J2UeeA2SRIDn2qwJilPWW9diA7sd-A4sEx69JgYNwNNd2xjDVWFsWDFWn215jsw2zD8ZhbacljNMF8uS-nHCRQqXjdhWVfBMoQsN2iQwtVHgL0MFuEL2fsr58YPM7nKqELg9XzYL9OzKEKd4uGFU9Z2TzEBp588CVB10erEQjbovcvn11~TNFo3IT~F3~C1TwEOjICbvtyHXX4KsBWSuBy3EBXRMMAtg54UXejH2tEKmU3jPt~umUIEpSOZw0jdNivOLuQ3qm7DqTbf~HUIS71H~1hEoXL8B-jnYG~R-gsjXQKa2ydsszmUy0FWfWTfvjevHNDlHhQ__";

const skills = [
  { name: "Unity", level: 90, color: "bg-leaf" },
  { name: "Unreal Engine", level: 75, color: "bg-sky" },
  { name: "VR 開發", level: 85, color: "bg-coral" },
  { name: "3D 建模", level: 70, color: "bg-lavender" },
  { name: "遊戲設計", level: 88, color: "bg-gold" },
  { name: "C# / C++", level: 80, color: "bg-leaf-muted" },
];

const tools = ["Unity", "Unreal Engine", "Blender", "Meta Quest", "SteamVR", "Git"];

const stats = [
  { label: "作品數", value: "12+" },
  { label: "GameJam", value: "8+" },
  { label: "VR 項目", value: "5+" },
  { label: "Game Design", value: "Level 88" },
];

export default function AboutSection() {
  const { t } = useTranslation();
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-20 bg-cream" ref={ref}>
      <div className="container">
        {/* Section Title */}
        <div className="text-center mb-14">
          <h2 className="font-pixel text-base sm:text-lg text-wood inline-block">
            {t("about.title")}
          </h2>
          <p className="font-body text-sm text-wood-light mt-2"></p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start max-w-5xl mx-auto">
          {/* Left: Character Card */}
          <div className="lg:col-span-2">
            <div className="wood-panel p-6 text-center">
              <div className="w-40 h-40 mx-auto mb-4 border-4 border-wood rounded-lg overflow-hidden"
                style={{ boxShadow: "4px 4px 0 0 oklch(0.35 0.08 55 / 0.3)" }}>
                <img src={AVATAR} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-pixel text-xs text-wood-dark mb-1">YOUR NAME</h3>
              <p className="font-pixel text-[7px] text-leaf mb-4">GAME DEVELOPER</p>

              <div className="border-t-2 border-wood/20 pt-4 mt-4">
                <p className="font-pixel text-[7px] text-wood-light mb-3">裝備欄</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {tools.map((tool) => (
                    <span key={tool} className="pixel-tag">{tool}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t-2 border-wood/20">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-pixel text-sm text-coral">{s.value}</div>
                    <div className="font-pixel text-[6px] text-wood-light mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Bio + Skills */}
          <div className="lg:col-span-3 space-y-6">
            <div className="wood-panel p-6">
              <h4 className="font-pixel text-[9px] text-leaf mb-4">{t("about.title")}</h4>
              <div className="space-y-3 font-body text-sm text-foreground/80 leading-relaxed">
                <p>{t("about.description")}</p>
              </div>
            </div>

            <div className="wood-panel p-6">
              <h4 className="font-pixel text-[9px] text-leaf mb-5">{t("about.skills")}</h4>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-pixel text-[7px] text-wood-dark">{skill.name}</span>
                      <span className="font-pixel text-[7px] text-wood-light">Lv.{skill.level}</span>
                    </div>
                    <div className="skill-bar-bg rounded-sm">
                      <div
                        className={`skill-bar-fill rounded-sm ${skill.color}`}
                        style={{ width: animated ? `${skill.level}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
