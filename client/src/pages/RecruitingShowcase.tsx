import { useState } from "react";
import { ArrowRight, Bot, Braces, Check, Download, FileText, FolderOpen, GitBranch, Layers, Mail, Monitor, ShieldCheck } from "lucide-react";
import type { IdeaLocale } from "@/ideaData";
import "./RecruitingShowcase.css";

type Copy = Record<IdeaLocale, string>;
const copy = (zh: string, en: string): Copy => ({ zh, en });
const workflows = [
  {
    name: copy("AI 招聘助手", "AI recruiting assistant"),
    product: "GoodHR",
    icon: Monitor,
    summary: copy("把 AI 判断放进招聘同事正在使用的页面。", "Bring AI-assisted screening into the page recruiters already use."),
    stack: ["JavaScript", "Chrome MV3", "DOM", "LLM API"],
    steps: [
      {
        title: copy("岗位与资料", "Requirements & profiles"),
        subtitle: copy("浏览器页面采集", "Browser data collection"),
        detail: copy("通过站点适配脚本读取候选人卡片和详情，结合所选岗位说明与筛选条件，组织成后续判断的输入。每个站点单独处理 DOM 差异，页面改版时也能单独修改。", "Site-specific scripts read candidate cards and details. The selected job description and screening criteria are combined with profile information, while each site's layout is handled by its own parser."),
        input: copy("岗位说明 + 候选人页面", "Job description + candidate page"),
        output: copy("可供判断的候选人资料", "Candidate information ready for screening"),
        technical: ["Content Scripts", "Site Parsers", "DOM Extraction"],
      },
      {
        title: copy("AI 初筛", "Initial AI screening"),
        subtitle: copy("先看是否值得深入", "A first pass over the profile"),
        detail: copy("把岗位要求和候选人概要交给模型，结合规则条件完成初筛。输出通过状态、判断说明和匹配线索，卡片据此显示通过原因和需要继续确认的地方。", "The model compares job requirements with the candidate summary, alongside configured rules. It returns a decision, explanation and matching points that the extension can use."),
        input: copy("岗位要求 + 候选人概要", "Requirements + profile summary"),
        output: copy("初筛状态 + 匹配理由", "Initial decision + matching reasons"),
        technical: ["LLM API", "Job Context", "Structured Output"],
      },
      {
        title: copy("详情二筛", "Detail screening"),
        subtitle: copy("补充信息，再作判断", "A second pass with more context"),
        detail: copy("对初筛通过的候选人打开详情，补充更完整的经历后再次判断。详情打开失败、AI 请求失败等情况以独立状态展示，方便使用者看到流程停在哪一步。", "Profiles that pass the first stage are opened for a second assessment with fuller experience details. Failures to open details or request an AI response are surfaced as distinct states."),
        input: copy("初筛通过 + 完整经历", "First-stage pass + detailed experience"),
        output: copy("二筛结果或明确的异常状态", "Second-stage result or a visible error state"),
        technical: ["Two-stage Screening", "State Handling", "Detail Parsing"],
      },
      {
        title: copy("结果与沟通", "Results & outreach"),
        subtitle: copy("结果直接回到卡片", "Write results back to the card"),
        detail: copy("将判断状态、说明、匹配点和风险信息整理后回写到候选人卡片。筛选与打招呼分别控制，使用者确认结果后，可按设置继续沟通、索要简历等操作。", "Decisions, explanations, matching points and risks are normalized and written back onto candidate cards. Screening and greetings have separate controls, with configured follow-up actions available after the user reviews results."),
        input: copy("结构化判断 + 用户设置", "Structured decision + user settings"),
        output: copy("卡片标注 + 可控的后续操作", "Card annotations + controlled follow-up"),
        technical: ["isok / msg / detail", "matchedPoints / risks", "UI Feedback"],
      },
    ],
  },
  {
    name: copy("简历邮件归档", "Resume mail filing"),
    product: "ResumeMailClassifier",
    icon: Mail,
    summary: copy("把邮箱里的附件变成按日期、岗位整理好的文件。", "Turn inbox attachments into files organized by date and role."),
    stack: ["Python", "IMAP / MIME", "PDF / DOCX", "PowerShell"],
    steps: [
      {
        title: copy("按需收件", "Select & collect"),
        subtitle: copy("明确日期与已读范围", "Explicit date and read-status scope"),
        detail: copy("通过 IMAP 读取指定范围的邮件，再解析 MIME 附件。Windows 启动界面把今天收集、今天未读、昨天补收和本月重扫拆成独立入口，减少日常使用时的范围误选。", "IMAP retrieves messages in the chosen scope and MIME parsing exposes their attachments. The Windows launcher separates today's collection, unread mail, yesterday's catch-up and monthly rescans."),
        input: copy("日期范围 + 收件模式", "Date range + collection mode"),
        output: copy("待处理邮件与简历附件", "Messages and resume attachments to process"),
        technical: ["IMAP SSL", "MIME", "Date Windows"],
      },
      {
        title: copy("附件解析", "Extract attachment text"),
        subtitle: copy("提取正文，保留主题和文件名", "Make documents classifiable"),
        detail: copy("提取 PDF、DOCX 等附件的文本，结合邮件主题与文件名作为分类依据。无法提取正文时保留回退路径，继续使用主题和文件名，同时在日志里标明这一情况。", "Text from attachments such as PDF and DOCX is combined with the email subject and filename. If text extraction fails, classification falls back to the subject and filename and records that condition."),
        input: copy("附件 + 邮件主题 + 文件名", "Attachment + subject + filename"),
        output: copy("正文文本与分类上下文", "Document text and classification context"),
        technical: ["pypdf", "DOCX / XML", "Extraction Fallback"],
      },
      {
        title: copy("岗位分类", "Classify by role"),
        subtitle: copy("规则匹配与意向校正", "Rules and intent correction"),
        detail: copy("先按岗位关键词评分，未命中时使用文本相似度回退。再对 PDF 中明确的“求职意向”“应聘岗位”等字段作二次校正，减少经历里提到的技能干扰实际投递意向。这里使用规则与文本处理完成归类。", "Role keywords are scored first, with text similarity as a fallback. A later PDF pass checks explicit application-intent fields to correct filing, helping distinguish the intended role from skills mentioned elsewhere. Classification uses rules and text processing."),
        input: copy("正文 + 岗位分类规则", "Document text + role rules"),
        output: copy("岗位分类 + 分类依据", "Role category + classification evidence"),
        technical: ["Keyword Scoring", "SequenceMatcher", "Intent Fields"],
      },
      {
        title: copy("去重归档", "Deduplicate & file"),
        subtitle: copy("支持重复运行与补漏", "Repeat runs and catch-up"),
        detail: copy("记录已处理邮件 UID 与附件 SHA-256，跳过重复内容；按日期和岗位保存简历。分类校正前保留备份，运行结束输出收集、跳过与失败情况，方便补收和排查。", "Processed message UIDs and attachment SHA-256 hashes track duplicate content. Resumes are filed by date and role, corrections keep backups, and the run summary reports collected, skipped and failed items for follow-up."),
        input: copy("岗位结果 + 附件指纹", "Role category + attachment fingerprint"),
        output: copy("日期／岗位目录 + 运行摘要", "Date / role folders + run summary"),
        technical: ["SHA-256", "UID State", "Backup & Summary"],
      },
    ],
  },
];

export function RecruitingCover({ locale, compact = false }: { locale: IdeaLocale; compact?: boolean }) {
  const zh = locale === "zh";
  return <div className={`recruiting-cover ${compact ? "recruiting-cover-compact" : ""}`}>
    <img src="/ideas/ai-recruiting/cover.webp" alt={zh ? "AI 助手整理候选人资料与邮件的像素概念插画" : "Pixel illustration of an AI assistant organizing profiles and mail"} width="1440" height="810" loading={compact ? "lazy" : "eager"} decoding="async" />
    <div className="recruiting-cover-copy"><span>AI × RECRUITING</span><strong>{zh ? <>AI判断<br />收集简历程序</> : <>AI screening<br />& resume collection</>}</strong><p>{zh ? "按岗位要求筛选，自动收集简历。" : "Screen for the role. Collect resumes."}</p></div>
    {!compact && <span className="recruiting-art-label">{zh ? "AI 概念插画" : "AI concept illustration"}</span>}
  </div>;
}

export default function RecruitingShowcase({ locale }: { locale: IdeaLocale }) {
  const [toolIndex, setToolIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const zh = locale === "zh";
  const tool = workflows[toolIndex];
  const step = tool.steps[stepIndex];
  return <div className="recruiting-showcase">
    <section className="recruiting-download" aria-labelledby="recruiting-download-title">
      <div><span className="recruiting-micro">GOODHR / CHROME · EDGE</span><h2 id="recruiting-download-title">{zh ? "下载 AI 判断与简历收集程序" : "Download the screening & collection tool"}</h2><p>{zh ? "输入岗位要求，程序会帮你查看候选人、给出是否合适的判断，再按你的设置索要和下载简历。" : "Enter the job requirements to review candidates with AI, see matching decisions, and request or download resumes according to your settings."}</p><small>{zh ? "浏览器扩展 ZIP · 分享版不含 Key，安装后需填写自己的 AI Key。此下载为 GoodHR，不含邮件归档工具。" : "Browser extension ZIP · Bring your own AI API key. This download includes GoodHR, not the mail filing tool."}</small></div>
      <a href="/downloads/goodhr-share.zip" download="GoodHR-AI招聘助手-分享版.zip"><Download aria-hidden="true" />{zh ? "下载安装包" : "Download ZIP"}<span>ZIP</span></a>
      <details><summary>{zh ? "怎么安装和使用？" : "How do I install it?"}</summary><ol><li>{zh ? "下载并解压 ZIP，保留里面的 GoodHR 文件夹。" : "Download and extract the ZIP, keeping the GoodHR folder."}</li><li>{zh ? "打开 Chrome 或 Edge 的扩展管理页面，开启“开发者模式”，点击“加载已解压的扩展程序”，选择 GoodHR 文件夹。" : "Open Chrome or Edge extensions, enable Developer mode, choose Load unpacked, and select the GoodHR folder."}</li><li>{zh ? "点击扩展里的“配置自己的 AI Key”，填写接口地址、模型和自己的 Key，再填写岗位要求并保存。" : "Open the extension's AI configuration, enter your endpoint, model and API key, then save your job requirements."}</li><li>{zh ? "登录招聘网站，先用少量候选人检查筛选结果，再按需要开启沟通和简历收集。详细说明也放在压缩包里。" : "Sign into the recruiting site, review a small batch first, then enable outreach and resume collection as needed. Full instructions are included in the ZIP."}</li></ol></details>
    </section>
    <section className="recruiting-facts" aria-label={zh ? "项目概况" : "Project overview"}>
      <div><Check aria-hidden="true" /><span>{zh ? "实际落地" : "In use"}</span><strong>{zh ? "任职公司招聘流程" : "My employer's recruiting workflow"}</strong></div>
      <div><Braces aria-hidden="true" /><span>{zh ? "技术组合" : "Built with"}</span><strong>JavaScript + Python + LLM</strong></div>
      <div><Layers aria-hidden="true" /><span>{zh ? "制作内容" : "What I built"}</span><strong>{zh ? "浏览器扩展 / 桌面工具" : "Browser extension / desktop tool"}</strong></div>
    </section>
    <section aria-labelledby="recruiting-workflow-title">
      <div className="ideas-section-label"><h2 id="recruiting-workflow-title">{zh ? "自动化是怎么跑起来的" : "How the automation works"}</h2><span>{zh ? "点选步骤，查看技术实现" : "Select a step to explore the implementation"}</span></div>
      <div className="recruiting-tool-switch" role="group" aria-label={zh ? "选择工具流程" : "Choose a workflow"}>
        {workflows.map((item, index) => <button key={item.product} aria-pressed={index === toolIndex} onClick={() => { setToolIndex(index); setStepIndex(0); }}>
          <item.icon aria-hidden="true" /><span><strong>{item.name[locale]}</strong><small>{item.product}</small></span><ArrowRight aria-hidden="true" />
        </button>)}
      </div>
      <div className="recruiting-workbench">
        <header><div><span className="recruiting-micro">{zh ? "流程示意" : "WORKFLOW MAP"} / 0{toolIndex + 1}</span><h3>{tool.summary[locale]}</h3></div><div className="recruiting-stack">{tool.stack.map(tag => <span key={tag}>{tag}</span>)}</div></header>
        <ol className="recruiting-steps">{tool.steps.map((item, index) => <li key={item.title.en}><button aria-current={index === stepIndex ? "step" : undefined} onClick={() => setStepIndex(index)} aria-controls="recruiting-step-detail"><span>0{index + 1}</span><strong>{item.title[locale]}</strong><small>{item.subtitle[locale]}</small></button></li>)}</ol>
        <div key={`${toolIndex}-${stepIndex}`} id="recruiting-step-detail" className="recruiting-step-detail" aria-live="polite">
          <div className="recruiting-step-copy"><span className="recruiting-micro">STEP 0{stepIndex + 1}</span><h4>{step.title[locale]}</h4><p>{step.detail[locale]}</p><div className="recruiting-stack">{step.technical.map(tag => <span key={tag}>{tag}</span>)}</div></div>
          <div className="recruiting-io"><div><FileText aria-hidden="true" /><span>{zh ? "输入" : "INPUT"}</span><p>{step.input[locale]}</p></div><ArrowRight className="recruiting-io-arrow" aria-hidden="true" /><div><FolderOpen aria-hidden="true" /><span>{zh ? "输出" : "OUTPUT"}</span><p>{step.output[locale]}</p></div></div>
        </div>
      </div>
    </section>
    <section className="recruiting-engineering" aria-labelledby="recruiting-engineering-title">
      <div className="ideas-section-label"><h2 id="recruiting-engineering-title">{zh ? "日常使用时要处理的几个细节" : "Built for everyday use"}</h2><span>{zh ? "结果展示、解析失败和重复扫描" : "Three engineering priorities"}</span></div>
      <div className="recruiting-engineering-grid">
        <article><Bot aria-hidden="true" /><h3>{zh ? "理由直接放回候选人卡片" : "Make model output usable"}</h3><p>{zh ? "卡片显示通过状态、理由、匹配点和风险，使用者不用再翻接口返回。筛选和沟通分别控制。" : "Normalize model decisions into status, reasons, matching points and risks, then map them to cards and follow-up actions."}</p></article>
        <article><GitBranch aria-hidden="true" /><h3>{zh ? "正文提取失败时怎么办" : "Handle imperfect inputs"}</h3><p>{zh ? "附件读不出正文时，先用主题和文件名继续分类，并把失败记进日志。明确的求职意向再用于校正。" : "Use site adapters for layout differences, subject and filename fallback for unreadable attachments, and explicit application intent for filing corrections."}</p></article>
        <article><ShieldCheck aria-hidden="true" /><h3>{zh ? "重新扫描也能跳过已收附件" : "Track repeated runs"}</h3><p>{zh ? "邮件 UID 记录处理进度，附件哈希识别重复文件。分类校正前保留备份，结束后输出收集和失败摘要。" : "Track message UIDs and attachment hashes, retain correction backups and produce run summaries to support catch-up and troubleshooting."}</p></article>
      </div>
    </section>
  </div>;
}
