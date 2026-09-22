import { useState, type CSSProperties } from "react";
import { ArrowUpRight, Check, Gamepad2, Mail, RotateCcw, Sprout } from "lucide-react";
import IdeasCompanion from "@/components/IdeasCompanion";
import { ideasCompanionVariants, type IdeasCompanionVariant } from "@/components/ideasCompanionVariants";
import "./CompanionPreview.css";

export default function CompanionPreview() {
  const [selected, setSelected] = useState<IdeasCompanionVariant>("black-cat");
  const [take, setTake] = useState(0);
  const current = ideasCompanionVariants.find(item => item.id === selected)!;

  return <main className="companion-lab">
    <div className="companion-lab-shell">
      <header className="companion-lab-header">
        <span className="companion-lab-eyebrow"><Sprout size={15} /> XYXYA · 小伙伴试衣间</span>
        <h1>谁来照看你的奇思妙想？</h1>
        <p>8 款像素小动物。入口位置不动，只换一个小搭子。</p>
      </header>
      <section className="companion-lab-stage" aria-label="原导航入口效果">
        <img className="companion-lab-landscape" src="/tech-journal/connected-world.png" alt="" />
        <div className="farm-nav companion-lab-nav">
          <span className="companion-lab-brand">XYXYA</span>
          <div className="farm-nav-menu">
            <button type="button" tabIndex={-1} aria-disabled="true"><Gamepad2 /><span>GameJam</span></button>
            <IdeasCompanion key={`${selected}-${take}`} label="奇思妙想" variant={selected} autoPlay onClick={() => { window.location.href = `/?companion=${selected}`; }} />
            <button type="button" tabIndex={-1} aria-disabled="true"><Mail /><span>信箱</span></button>
          </div>
        </div>
        <div className="companion-lab-stage-caption"><span>正在试穿</span><strong>{current.name}</strong><small>32 px · 原导航位置</small></div>
        <div className="companion-lab-stage-actions">
          <button type="button" onClick={() => setTake(value => value + 1)}><RotateCcw size={14} /> 再动一下</button>
          <a href={`/?companion=${selected}`}>放到首页看 <ArrowUpRight size={15} /></a>
        </div>
      </section>
      <div className="companion-lab-section-label"><span>选择你喜欢的气质</span><small>放大看像素，顶部看实际大小</small></div>
      <div className="companion-lab-grid">
        {ideasCompanionVariants.map((item, index) => <button key={item.id} type="button" className="companion-lab-card" aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setTake(value => value + 1); }} style={{ "--swatch": item.color } as CSSProperties}>
          <span className="companion-lab-card-number">0{index + 1}</span>
          <span className="companion-lab-card-check">{selected === item.id && <Check size={13} />}</span>
          <span className="companion-lab-sprite"><img src={`/ideas-guide/${item.id}-open.svg`} width="80" height="80" alt="" /></span>
          <strong>{item.name}</strong><span className="companion-lab-mood">{item.mood}</span>
        </button>)}
      </div>
      <p className="companion-lab-footnote">也可以先选喜欢的角色，再调整它的颜色、表情和小动作。</p>
    </div>
  </main>;
}
