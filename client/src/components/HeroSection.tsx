import { ArrowDown } from "lucide-react";
import { usePreviewBackground } from "@/components/BackgroundPreviewSwitcher";

export default function HeroSection() {
  const { background } = usePreviewBackground();


  return (
    <section id="hero" className="editorial-hero crafted-hero">
      <img src={background} alt="卡通游戏机与像素世界" className="editorial-hero-bg" />
      <div className="editorial-hero-overlay" aria-hidden="true" />
      <div className="container editorial-hero-inner">
        <div className="editorial-hero-copy">
          <h1>XYXYA</h1>
        </div>
      </div>
      <button type="button" onClick={() => document.querySelector("#gamejam")?.scrollIntoView({ behavior: "smooth" })} className="editorial-scroll"><span>SCROLL TO EXPLORE</span><ArrowDown aria-hidden="true" /></button>
    </section>
  );
}
