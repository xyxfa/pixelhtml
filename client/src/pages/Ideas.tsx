import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUp, ArrowUpRight, BookOpen, Clock, Code2, Film, Github, Lightbulb, List, Play, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useRoute } from "wouter";
import PixelNav from "@/components/PixelNav";
import { ideaProjects, type IdeaCategory, type IdeaLocale, type IdeaProject } from "@/ideaData";
import { ideaArticles } from "@/ideaArticles";
import RecruitingShowcase, { RecruitingCover } from "./RecruitingShowcase";
import ThemedMotion, { type MotionTheme } from "@/components/ThemedMotion";
import "./Ideas.css";

const categories: { id: "all" | IdeaCategory; zh: string; en: string }[] = [
  { id: "all", zh: "全部", en: "All" },
  { id: "ai", zh: "AI 与游戏", en: "AI & games" },
  { id: "interaction", zh: "交互设计", en: "Interaction" },
  { id: "graphics", zh: "图形渲染", en: "Graphics" },
  { id: "automation", zh: "自动化", en: "Automation" },
];
const timestamp = (time: number) => `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`;

function IdeaVideo({ idea, locale }: { idea: IdeaProject; locale: IdeaLocale }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [currentTime, setCurrentTime] = useState(-1);
  const video = useRef<HTMLVideoElement>(null);
  const pendingTime = useRef(0);
  const zh = locale === "zh";
  const playFrom = (time: number) => {
    pendingTime.current = time;
    setCurrentTime(time);
    if (video.current) {
      video.current.currentTime = time;
      void video.current.play().catch(() => undefined);
    } else setPlaying(true);
  };
  return <section id="demo" className="idea-demo" aria-label={zh ? "项目演示" : "Project demo"}>
    <div className="idea-video">
      {playing && idea.bilibiliId ? (
        <iframe src={`https://player.bilibili.com/player.html?bvid=${idea.bilibiliId}&page=1&autoplay=1&muted=0&danmaku=0`}
          title={`${idea.title[locale]} | Bilibili`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin" className="idea-bilibili-player" />
      ) : playing ? (
        <video ref={video} controls autoPlay playsInline preload="metadata" poster={idea.poster}
          aria-label={idea.subtitle[locale]} onError={() => setFailed(true)}
          onLoadedMetadata={() => { if (video.current) video.current.currentTime = pendingTime.current; }}
          onTimeUpdate={() => setCurrentTime(video.current?.currentTime ?? 0)}>
          <source src={idea.video} type="video/mp4" />
          <a href={idea.video}>{zh ? "打开视频" : "Open video"}</a>
        </video>
      ) : (
        <button className="idea-video-launch" onClick={() => playFrom(0)} aria-label={zh ? "播放完整演示" : "Play full demo"}>
          <img src={idea.poster} width="1600" height="980" alt={idea.title[locale]} />
          <span className="idea-video-play"><Play aria-hidden="true" fill="currentColor" /><span>{zh ? "播放完整演示" : "Play full demo"}</span><small>{idea.duration}</small></span>
        </button>
      )}
    </div>
    {failed && <p role="alert" className="idea-video-error">{zh ? "视频暂时无法播放。" : "Video could not be loaded. "}<a href={idea.video} target="_blank" rel="noopener noreferrer">{zh ? "单独打开视频" : "Open video directly"}</a></p>}
    {idea.chapters && <div className="idea-chapters" aria-label={zh ? "视频章节" : "Video chapters"}>
      {idea.chapters.map((chapter, index) => <button key={chapter.time} type="button" onClick={() => playFrom(chapter.time)}
        aria-pressed={currentTime >= chapter.time && currentTime < (idea.chapters?.[index + 1]?.time ?? Infinity)}>
        <span>{timestamp(chapter.time)}</span>{chapter.title[locale]}
      </button>)}
    </div>}
    {idea.externalUrl && <div className="idea-external-watch"><a href={idea.externalUrl} target="_blank" rel="noopener noreferrer"><Film aria-hidden="true" />{zh ? "在 Bilibili 观看" : "Watch on Bilibili"}<ArrowUpRight aria-hidden="true" /></a></div>}
  </section>;
}

function ArticleMeta({ idea, locale }: { idea: IdeaProject; locale: IdeaLocale }) {
  return <div className="idea-meta">
    <span className="idea-category">{categories.find(category => category.id === idea.category)?.[locale]}</span>
    {idea.publishedAt && <time dateTime={idea.publishedAt}>{idea.publishedAt.replaceAll("-", ".")}</time>}
    <span><Clock aria-hidden="true" />{locale === "zh" ? `约 ${idea.readingMinutes} 分钟` : `${idea.readingMinutes} min read`}</span>
  </div>;
}

function ArticleBody({ idea, locale }: { idea: IdeaProject; locale: IdeaLocale }) {
  const sections = ideaArticles[idea.slug] ?? [];
  const zh = locale === "zh";
  const toc = [
    { id: "overview", title: zh ? "关于这个项目" : "About the project" },
    ...(idea.video ? [{ id: "demo", title: zh ? "运行演示" : "Runtime demo" }] : []),
    ...sections.map(section => ({ id: section.id, title: section.title[locale] })),
    ...(idea.slug === "ai-recruiting" ? [{ id: "implementation", title: zh ? "实现流程" : "Implementation" }] : []),
    ...(idea.gallery.length ? [{ id: "gallery", title: zh ? "效果截图" : "Gallery" }] : []),
  ];
  return <div className="idea-reading-layout">
    <aside className="idea-toc"><nav aria-label={zh ? "文章目录" : "Article contents"}>
      <p><List aria-hidden="true" />{zh ? "本文目录" : "CONTENTS"}</p>
      <ol>{toc.map((item, index) => <li key={item.id}><a href={`#${item.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{item.title}</a></li>)}</ol>
      <a className="idea-top" href="#article-title"><ArrowUp aria-hidden="true" />{zh ? "回到顶部" : "Back to top"}</a>
    </nav></aside>
    <article className="idea-reading" aria-labelledby="article-title">
      <section id="overview" className="idea-prose-section"><h2>{zh ? "关于这个项目" : "About the project"}</h2><p>{idea.description[locale]}</p><ul className="idea-points">{idea.technicalPoints.map((point, index) => <li key={index}>{point[locale]}</li>)}</ul>{idea.repositoryUrl && <a className="idea-repository" href={idea.repositoryUrl} target="_blank" rel="noopener noreferrer"><Github aria-hidden="true" />{zh ? "查看项目源码" : "Project source"}<ArrowUpRight aria-hidden="true" /></a>}</section>
      {idea.video ? <IdeaVideo key={idea.slug} idea={idea} locale={locale} /> : idea.slug === "ai-recruiting" ? <RecruitingCover locale={locale} /> : null}
      {sections.map((section, index) => <section id={section.id} className="idea-prose-section" key={section.id}>
        <div className="idea-section-number">{String(index + 1).padStart(2, "0")}</div><h2>{section.title[locale]}</h2>
        {section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph[locale]}</p>)}
        {section.flow && <ol className="idea-flow">{section.flow.map((step, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{step[locale]}{i < section.flow!.length - 1 && <ArrowUpRight aria-hidden="true" />}</li>)}</ol>}
        {section.points && <ul className="idea-points">{section.points.map((point, i) => <li key={i}>{point[locale]}</li>)}</ul>}
        {section.code && <figure className="idea-code"><figcaption><span><Code2 aria-hidden="true" />{section.code.label[locale]}</span>{section.code.source && (section.code.source.url ? <a href={section.code.source.url} target="_blank" rel="noopener noreferrer">{section.code.source.file}:{section.code.source.line}<ArrowUpRight aria-hidden="true" /></a> : <code>{section.code.source.file}:{section.code.source.line}</code>)}</figcaption><pre tabIndex={0}><code>{section.code.value}</code></pre></figure>}
        {section.image && <figure className="idea-article-image"><a href={section.image.src} target="_blank" rel="noopener noreferrer" aria-label={`${zh ? "查看原图：" : "Open image: "}${section.image.caption[locale]}`}><img src={section.image.src} width={section.image.width} height={section.image.height} alt={section.image.caption[locale]} loading="lazy" decoding="async" /></a><figcaption>{section.image.caption[locale]}</figcaption></figure>}
        {section.sources && <p className="idea-sources"><span>{zh ? "实现位置" : "Implementation"}</span>{section.sources.map(source => <code key={source}>{source}</code>)}</p>}
        {section.references && <p className="idea-sources"><span>{zh ? "源码依据" : "Source references"}</span>{section.references.map(source => source.url ? <a key={`${source.file}:${source.line}`} href={source.url} target="_blank" rel="noopener noreferrer"><code>{source.file}:{source.line}</code><ArrowUpRight aria-hidden="true" /></a> : <code key={`${source.file}:${source.line}`}>{source.file}:{source.line}</code>)}</p>}
      </section>)}
      {idea.slug === "ai-recruiting" && <section id="implementation"><RecruitingShowcase locale={locale} /></section>}
      {idea.gallery.length > 0 && <section id="gallery" className="idea-prose-section">
        <h2>{idea.galleryTitle?.[locale] ?? (zh ? "效果截图" : "Gallery")}</h2>
        <div className="idea-gallery">{idea.gallery.map(shot => <figure key={shot.image}>
          <a href={shot.image} target="_blank" rel="noopener noreferrer"><img src={shot.image} alt={shot.title[locale]} width="1152" height="648" loading="lazy" decoding="async" /></a>
          <figcaption><h3>{shot.title[locale]}</h3><p>{shot.caption[locale]}</p></figcaption>
        </figure>)}</div>
      </section>}
      <footer className="idea-article-footer"><BookOpen aria-hidden="true" /><span>{zh ? "奇思妙想 / 技术博客" : "Ideas / Engineering journal"}</span><Link href="/ideas">{zh ? "全部文章" : "All articles"}<ArrowUpRight aria-hidden="true" /></Link></footer>
    </article>
  </div>;
}

export default function Ideas() {
  const { t, i18n } = useTranslation();
  const locale: IdeaLocale = i18n.language.startsWith("en") ? "en" : "zh";
  const [isDetail, params] = useRoute("/ideas/:slug");
  const selected = isDetail ? ideaProjects.find(idea => idea.slug === params?.slug) : undefined;
  const [category, setCategory] = useState<"all" | IdeaCategory>("all");
  const [query, setQuery] = useState("");
  const zh = locale === "zh";
  const theme: MotionTheme = selected?.slug === "level-select" ? "map" : selected?.slug === "ase-shader" ? "shader" : selected?.slug === "ai-recruiting" ? "recruiting" : "ideas";
  const filtered = ideaProjects.filter(idea => {
    const text = [idea.title.zh, idea.title.en, idea.subtitle.zh, idea.subtitle.en, idea.description[locale], ...idea.tags.zh, ...idea.tags.en,
      ...idea.technicalPoints.map(point => point[locale]),
      ...(ideaArticles[idea.slug] ?? []).flatMap(section => [section.title[locale], ...section.paragraphs.map(p => p[locale]), ...(section.points ?? []).map(point => point[locale]), section.code?.value ?? ""])].join(" ").toLocaleLowerCase();
    return (category === "all" || idea.category === category) && query.trim().toLocaleLowerCase().split(/\s+/).every(term => text.includes(term));
  });
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${selected ? `${selected.title[locale]} · ` : ""}${t("nav.ideas")} | XYXYA`;
    const hashTarget = document.getElementById(window.location.hash.slice(1));
    if (hashTarget) hashTarget.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: "instant" });
    return () => { document.title = previousTitle; };
  }, [selected, locale, t]);
  return <div className={`ideas-page ${selected ? "ideas-page-detail" : ""}`} style={{ backgroundImage: `url(${selected?.background ?? "/ideas/level-select/background.webp"})` }}>
    <ThemedMotion key={theme} theme={theme} /><PixelNav />
    <main className="ideas-shell">
      {isDetail && !selected ? <div className="ideas-missing"><Lightbulb aria-hidden="true" /><h1>{zh ? "这篇文章还没收录" : "This article isn't here yet"}</h1><Link href="/ideas">{zh ? "返回奇思妙想" : "Back to Ideas"}</Link></div> : selected ? <>
        <Link href="/ideas" className="ideas-back"><ArrowLeft aria-hidden="true" />{zh ? "所有奇思妙想" : "All ideas"}</Link>
        <header className="idea-detail-heading" id="article-title"><ArticleMeta idea={selected} locale={locale} /><h1>{selected.title[locale]}</h1><p className="idea-detail-subtitle">{selected.subtitle[locale]}</p><div className="idea-tags">{selected.tags[locale].map(tag => <span key={tag}>{tag}</span>)}</div></header>
        <ArticleBody idea={selected} locale={locale} />
      </> : <>
        <header className="ideas-heading"><div><p className="ideas-eyebrow"><BookOpen aria-hidden="true" />{zh ? "开发笔记" : "DEV NOTES"}</p><h1>{t("nav.ideas")}<span aria-hidden="true"> /</span></h1><p className="ideas-intro">{zh ? "这里放一些做过的项目和小实验。有运行效果，也有代码、实现思路，以及还想继续改的地方。" : "Projects and small experiments, with demos, code, implementation notes and things I still want to improve."}</p></div><div className="ideas-count"><strong>{String(ideaProjects.length).padStart(2, "0")}</strong><span>{zh ? "篇开发记录" : "project notes"}</span></div></header>
        <div className="ideas-toolbar">
          <div className="ideas-filters" role="group" aria-label={zh ? "文章分类" : "Article categories"}>{categories.map(item => <button key={item.id} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item[locale]}<span>{item.id === "all" ? ideaProjects.length : ideaProjects.filter(idea => idea.category === item.id).length}</span></button>)}</div>
          <div className="ideas-search"><Search aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={zh ? "搜索文章、技术栈…" : "Search articles, technologies…"} aria-label={zh ? "搜索文章" : "Search articles"} />{query && <button type="button" title={zh ? "清空搜索" : "Clear search"} aria-label={zh ? "清空搜索" : "Clear search"} onClick={() => setQuery("")}><X aria-hidden="true" /></button>}</div>
        </div>
        <p className="ideas-results" role="status">{zh ? `${filtered.length} 篇文章` : `${filtered.length} articles`}</p>
        <div className="ideas-list">{filtered.map((idea, index) => <article className="idea-card" key={idea.slug}>
          <Link href={`/ideas/${idea.slug}`} className="idea-card-cover" aria-label={`${zh ? "阅读" : "Read"} ${idea.title[locale]}`}><img src={idea.poster} alt={idea.title[locale]} width="1600" height="980" loading={index === 0 ? "eager" : "lazy"} decoding="async" />{idea.duration && <span className="idea-cover-type"><Play aria-hidden="true" />{idea.duration}</span>}</Link>
          <div className="idea-card-copy"><ArticleMeta idea={idea} locale={locale} /><h2><Link href={`/ideas/${idea.slug}`}>{idea.title[locale]}</Link></h2><p className="idea-card-summary">{(idea.summary ?? idea.description)[locale]}</p><ul className="idea-technical-points">{idea.technicalPoints.map((point, i) => <li key={i}>{point[locale]}</li>)}</ul><div className="idea-card-bottom"><div className="idea-tags">{idea.tags[locale].map(tag => <span key={tag}>{tag}</span>)}</div><Link href={`/ideas/${idea.slug}`} className="idea-open">{zh ? "阅读全文" : "Read article"}<ArrowUpRight aria-hidden="true" /></Link></div></div>
        </article>)}</div>
        {filtered.length === 0 && <div className="ideas-empty"><Search aria-hidden="true" /><h2>{zh ? "没有找到匹配的文章" : "No matching articles"}</h2><button onClick={() => { setQuery(""); setCategory("all"); }}>{zh ? "查看全部文章" : "Show all articles"}</button></div>}
        <footer className="ideas-growing"><span>UNITY / AI / INTERACTION</span><p>{zh ? "新的尝试会继续放在这里。" : "More experiments to come."}</p></footer>
      </>}
    </main>
  </div>;
}
