import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import "../styles/dangoiz.css";

// 游戏数据 - 支持新的背景区域格式
const GAMES = [
  {
    id: 1,
    title: "《The Starry Night》",
    poster:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600",
    // 背景图片 - 类似 dangoiz.com 的效果
    backgroundImage:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=2000",
    tags: [
      { text: "独立游戏", color: "tag-purple" },
      { text: "冒险", color: "tag-teal" },
      { text: "艺术", color: "tag-green" },
    ],
    description:
      "一款探索梦境与现实边界的叙事冒险游戏。玩家将扮演一名迷失在星空下的旅行者，通过解开一个个唯美的视觉谜题，找回遗失的记忆片段。游戏采用独特的油画渲染风格，每一帧都如同梵高的画作般流动。",
    links: [
      { text: "Steam 页面", url: "#", primary: true },
      { text: "查看详情", url: "#", primary: false },
    ],
  },
  {
    id: 2,
    title: "《Cyber Neon》",
    poster:
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=600",
    backgroundImage:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
    tags: [
      { text: "动作", color: "tag-cyan" },
      { text: "赛博朋克", color: "tag-blue" },
      { text: "快节奏", color: "tag-indigo" },
    ],
    description:
      "霓虹闪烁的未来都市，一场关于黑客与AI的博弈。这是一款高机动性的横版动作游戏，强调流畅的连招和极致的反应速度。在光怪陆离的赛博空间中穿梭，通过 hack 敌人的义体来获得战斗优势。",
    links: [
      { text: "立即下载", url: "#", primary: true },
      { text: "预告片", url: "#", primary: false },
    ],
  },
  {
    id: 3,
    title: "《Forest Whispers》",
    poster:
      "https://images.unsplash.com/photo-1448375240586-dfd8d3f5d8db?auto=format&fit=crop&q=80&w=600",
    backgroundImage:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=2000",
    tags: [
      { text: "解谜", color: "tag-light-purple" },
      { text: "治愈", color: "tag-pink" },
      { text: "自然", color: "tag-green" },
    ],
    description:
      "倾听森林的声音，与自然万物共舞。这是一款轻松治愈的解谜游戏，玩家需要模仿森林中动物的声音来与环境互动，改变天气，生长植物，为迷路的小动物指引回家的方向。",
    links: [
      { text: "App Store", url: "#", primary: true },
      { text: "Google Play", url: "#", primary: false },
    ],
  },
];

// 背景区域组件 - 实现懒加载和毛玻璃效果
function BackgroundSection({ game }: { game: (typeof GAMES)[0] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // 使用 Intersection Observer 实现懒加载
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 加载背景图片
            const img = new Image();
            img.src = game.backgroundImage;
            img.onload = () => {
              setBgImage(game.backgroundImage);
              // 延迟移除模糊效果，创建过渡动画
              setTimeout(() => {
                setIsLoaded(true);
              }, 100);
            };
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [game.backgroundImage]);

  return (
    <section
      ref={sectionRef}
      className="dangoiz-bg-section"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : "none",
      }}
    >
      {/* 毛玻璃模糊层 - 图片加载完成前显示 */}
      <div className={`dangoiz-blurred-layer ${isLoaded ? "loaded" : ""}`} />

      <div className="container">
        <div className="row">
          <div className="col-left">
            <img
              src={game.poster}
              alt={game.title}
              className="game-image"
              loading="lazy"
            />
          </div>
          <div className="col-right">
            <h2 className="game-title">{game.title}</h2>
            <div className="game-tags">
              {game.tags.map((tag, idx) => (
                <span key={idx} className={`dangoiz-tag ${tag.color}`}>
                  {tag.text}
                </span>
              ))}
            </div>
            <p className="game-description">{game.description}</p>
            <div className="game-links">
              {game.links?.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  className={`game-link-btn ${link.primary ? "" : "secondary"}`}
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RecentGames() {
  const [, setLocation] = useLocation();

  return (
    <div className="dangoiz-page">
      {/* 导航栏 */}
      <nav className="dangoiz-navbar">
        <div className="dangoiz-navbar-container">
          <a
            href="/recent-games"
            className="dangoiz-navbar-logo"
            onClick={e => {
              e.preventDefault();
              setLocation("/recent-games");
            }}
          >
            <span style={{ fontSize: "24px" }}>🎮</span>
            <span>DaNGo_iz Studio</span>
          </a>
          <ul className="dangoiz-navbar-menu">
            <li>
              <button
                className="dangoiz-nav-link"
                onClick={() => setLocation("/")}
              >
                Return Home
              </button>
            </li>
            <li>
              <button className="dangoiz-nav-link active">独立游戏开发</button>
            </li>
            <li>
              <button className="dangoiz-nav-link">艺术创作</button>
            </li>
            <li>
              <button className="dangoiz-nav-link">世界观构建</button>
            </li>
            <li>
              <button className="dangoiz-nav-link">关于</button>
            </li>
          </ul>
          <div className="dangoiz-navbar-controls">
            <button className="dangoiz-btn">中文</button>
            <button className="dangoiz-btn">🌙</button>
          </div>
        </div>
      </nav>

      {/* 主容器 */}
      <main className="dangoiz-main-container" style={{ paddingTop: "64px" }}>
        {/* 页面标题 */}
        <section className="dangoiz-page-header">
          <h1>最新 & 已发布游戏</h1>
        </section>
      </main>

      {/* 特色游戏展示区 - 全宽背景图片区域 */}
      {GAMES.slice(0, 2).map(game => (
        <BackgroundSection key={game.id} game={game} />
      ))}

      {/* 更多游戏 - 传统卡片布局 */}
      <main className="dangoiz-main-container" style={{ paddingTop: "64px" }}>
        <section className="dangoiz-page-header">
          <h2 style={{ fontSize: "36px", marginBottom: "48px" }}>更多作品</h2>
        </section>

        <section className="dangoiz-games-container">
          {GAMES.map(game => (
            <article key={game.id} className="dangoiz-game-card">
              <div className="dangoiz-game-poster">
                <img src={game.poster} alt={game.title} loading="lazy" />
              </div>
              <div className="dangoiz-game-info">
                <h2 className="dangoiz-game-title">{game.title}</h2>
                <div className="dangoiz-game-tags">
                  {game.tags.map((tag, idx) => (
                    <span key={idx} className={`dangoiz-tag ${tag.color}`}>
                      {tag.text}
                    </span>
                  ))}
                </div>
                <p className="dangoiz-game-description">{game.description}</p>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* 页脚 */}
      <footer className="dangoiz-footer">
        <p>
          &copy; 2025 DaNGo_iz Game Studio. All rights reserved. | Refactored by
          Agent
        </p>
      </footer>
    </div>
  );
}
