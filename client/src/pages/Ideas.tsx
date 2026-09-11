import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Braces, Film, Lightbulb, Play, Sparkles, Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useRoute } from "wouter";
import PixelNav from "@/components/PixelNav";
import { ideaProjects, type IdeaLocale, type IdeaProject } from "@/ideaData";
import "./Ideas.css";
import RecruitingShowcase, { RecruitingCover } from "./RecruitingShowcase";

function IdeaVideo({ idea, locale }: { idea: IdeaProject; locale: IdeaLocale }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="idea-video">
      {playing && idea.bilibiliId ? (
        <iframe
          src={`https://player.bilibili.com/player.html?bvid=${idea.bilibiliId}&page=1&autoplay=1&muted=0&danmaku=0`}
          title={`${idea.title[locale]} — Bilibili`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="idea-bilibili-player"
        />
      ) : playing ? (
        <video controls autoPlay playsInline preload="metadata" poster={idea.poster} aria-label={idea.subtitle[locale]}>
          <source src={idea.video} type="video/mp4" />
          <a href={idea.video}>{locale === "zh" ? "打开视频" : "Open video"}</a>
        </video>
      ) : (
        <button className="idea-video-launch" onClick={() => setPlaying(true)} aria-label={locale === "zh" ? "播放完整演示" : "Play full demo"}>
          <img src={idea.poster} width="1152" height="648" alt={idea.title[locale]} />
          <span className="idea-video-play"><Play aria-hidden="true" fill="currentColor" /><span>{locale === "zh" ? "播放完整演示" : "Play full demo"}</span><small>{idea.duration}</small></span>
        </button>
      )}
    </div>
  );
}

export default function Ideas() {
  const { t, i18n } = useTranslation();
  const locale: IdeaLocale = i18n.language.startsWith("en") ? "en" : "zh";
  const [isDetail, params] = useRoute("/ideas/:slug");
  const selected = isDetail ? ideaProjects.find((idea) => idea.slug === params?.slug) : undefined;
  const zh = locale === "zh";

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${selected ? `${selected.subtitle[locale]} · ` : ""}${t("nav.ideas")} | XYXYA`;
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => { document.title = previousTitle; };
  }, [selected, locale, t]);

  return (
    <div className="ideas-page" style={{ backgroundImage: `url(${(selected || ideaProjects[0])?.background})` }}>
      <PixelNav />
      <main className="ideas-shell">
        {isDetail && !selected ? (
          <div className="ideas-missing"><Lightbulb aria-hidden="true" /><h1>{zh ? "这个灵感还没收录" : "This idea isn't here yet"}</h1><Link href="/ideas">{zh ? "返回奇思妙想" : "Back to Ideas"}</Link></div>
        ) : selected ? (
          <>
            <Link href="/ideas" className="ideas-back"><ArrowLeft aria-hidden="true" />{zh ? "所有奇思妙想" : "All ideas"}</Link>
            <header className="idea-detail-heading">
              <p className="ideas-eyebrow"><Sparkles aria-hidden="true" />{selected.kind === "technical" ? (zh ? "工程实践" : "ENGINEERING IN PRACTICE") : (zh ? "灵感实验" : "IDEA EXPERIMENT")} / {selected.number}</p>
              <h1>{selected.title[locale]}</h1>
              <p className="idea-detail-subtitle">{selected.subtitle[locale]}</p>
              <div className="idea-tags">{selected.tags[locale].map(tag => <span key={tag}>{tag}</span>)}</div>
            </header>
            {selected.kind === "technical" ? <RecruitingCover locale={locale} /> : <IdeaVideo key={selected.slug} idea={selected} locale={locale} />}
            {selected.externalUrl && <div className="idea-external-watch"><a href={selected.externalUrl} target="_blank" rel="noopener noreferrer"><Film aria-hidden="true" />{zh ? "在 Bilibili 观看" : "Watch on Bilibili"}<ArrowUpRight aria-hidden="true" /></a></div>}
            <section className="idea-about" aria-labelledby="idea-about-title">
              <h2 id="idea-about-title">{selected.kind === "technical" ? (zh ? "为实际招聘流程做的工具" : "Tools for a real recruiting workflow") : (zh ? "这次，想试试什么？" : "What's the idea?")}</h2>
              <p>{selected.description[locale]}</p>
            </section>
            {selected.kind === "technical" && <RecruitingShowcase locale={locale} />}
            {selected.gallery.length > 0 && <section aria-labelledby="idea-gallery-title">
              <div className="ideas-section-label"><h2 id="idea-gallery-title">{selected.galleryTitle?.[locale] ?? (zh ? "界面切片" : "A closer look")}</h2><span>{zh ? "从演示中挑出的几个瞬间" : "Selected moments from the demo"}</span></div>
              <div className="idea-gallery">{selected.gallery.map((shot, index) => (
                <figure key={shot.image}>
                  <img src={shot.image} alt={shot.title[locale]} width="1152" height="648" loading="lazy" decoding="async" />
                  <figcaption><span className="idea-shot-number">0{index + 1}</span><div><h3>{shot.title[locale]}</h3><p>{shot.caption[locale]}</p></div></figcaption>
                </figure>
              ))}</div>
            </section>}
            <Link href="/ideas" className="ideas-back ideas-bottom-back"><ArrowLeft aria-hidden="true" />{zh ? "回到灵感收集册" : "Back to the collection"}</Link>
          </>
        ) : (
          <>
            <header className="ideas-heading">
              <div>
                <p className="ideas-eyebrow"><Lightbulb aria-hidden="true" />{zh ? "灵感收集册" : "THE IDEA COLLECTION"}</p>
                <h1>{t("nav.ideas")}<span className="ideas-title-star" aria-hidden="true">✦</span></h1>
                <p className="ideas-intro">{zh ? "不妨先试试看。" : "Let's give it a try."}<br /><span>{zh ? "把一闪而过的念头，做成看得见的小实验。" : "Turning passing thoughts into little experiments you can see."}</span></p>
              </div>
              <div className="ideas-count"><strong>{String(ideaProjects.length).padStart(2, "0")}</strong><span>{zh ? "个灵感，持续生长中" : "ideas, and growing"}</span></div>
            </header>
            <div className="ideas-section-label"><h2>{zh ? "全部灵感" : "All experiments"}</h2><span>{zh ? "交互 · 视觉 · 小脑洞" : "Interaction · Visuals · What ifs"}</span></div>
            <div className="ideas-grid">
              {ideaProjects.map((idea, index) => (
                <article className={`idea-card ${index === 0 ? "idea-card-featured" : ""}`} key={idea.slug}>
                  <Link href={`/ideas/${idea.slug}`} className="idea-card-cover" aria-label={`${zh ? "查看" : "View"} ${idea.subtitle[locale]}`}>
                    {idea.kind === "technical" ? <RecruitingCover locale={locale} compact /> : <img src={idea.poster} alt={idea.title[locale]} width="1152" height="648" loading={index === 0 ? "eager" : "lazy"} decoding="async" />}
                    <span className="idea-cover-type">{idea.kind === "technical" ? <Braces aria-hidden="true" /> : <Film aria-hidden="true" />}{idea.kind === "technical" ? (zh ? "技术实践" : "Engineering") : (zh ? "动态演示" : "Video demo")}<i />{idea.kind === "technical" ? (zh ? "实际应用" : "In use") : idea.duration}</span>
                    <span className="idea-cover-arrow"><ArrowUpRight aria-hidden="true" /></span>
                  </Link>
                  <div className="idea-card-copy">
                    <p className="ideas-eyebrow"><span className="idea-index">{idea.number}</span>{idea.subtitle[locale]}</p>
                    <h2><Link href={`/ideas/${idea.slug}`}>{idea.title[locale]}</Link></h2>
                    <p className="idea-card-summary">{(idea.summary || idea.description)[locale]}</p>
                    <div className="idea-tags">{idea.tags[locale].map(tag => <span key={tag}>{tag}</span>)}</div>
                    <Link href={`/ideas/${idea.slug}`} className="idea-open">{idea.kind === "technical" ? (zh ? "看看实现细节" : "Explore the implementation") : (zh ? "看看这个脑洞" : "Explore this idea")}<ArrowUpRight aria-hidden="true" /></Link>
                  </div>
                </article>
              ))}
            </div>
            <footer className="ideas-growing"><Sprout aria-hidden="true" /><p>{zh ? "下一颗灵感，正在发芽。" : "The next idea is taking root."}</p><span>{zh ? "想到什么，就做一点。" : "One thought. One little experiment."}</span></footer>
          </>
        )}
      </main>
    </div>
  );
}
