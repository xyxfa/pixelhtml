import type { IdeaLocale } from "./ideaData";

type Copy = Record<IdeaLocale, string>;
const copy = (zh: string, en: string): Copy => ({ zh, en });
type SourceReference = { file: string; line: number; url?: string };
const github = (repo: string, sha: string, file: string, line: number): SourceReference => ({
  file, line, url: `https://github.com/${repo}/blob/${sha}/${file.split("/").map(encodeURIComponent).join("/")}#L${line}`,
});
const levelSource = (file: string, line: number) => github("xyxfa/Kingdom_Select", "4e405083ce946cd8027cbf8b7c0770d15be32f5a", `Assets/Scripts/${file}`, line);
const shaderSource = (file: string, line: number) => github("xyxfa/shader_ASE_test_and_Cool_UI", "8d6dcbf01ce6786737a11d37993a0009c3468eb5", `Assets/${file}`, line);

export interface IdeaArticleSection {
  id: string;
  title: Copy;
  paragraphs: Copy[];
  points?: Copy[];
  flow?: Copy[];
  code?: { label: Copy; value: string; source?: SourceReference };
  image?: { src: string; width: number; height: number; caption: Copy };
  sources?: string[];
  references?: SourceReference[];
}

export const ideaArticles: Record<string, IdeaArticleSection[]> = {
  "echo-unity-ai": [
    {
      id: "boundaries",
      title: copy("架构分层：LLM 规划、调度裁决、行为树执行", "Architecture: LLM planning, scheduling and behavior-tree execution"),
      paragraphs: [
        copy("ECHO 是一个 Unity AI 交互项目，包含角色单聊、群聊、记忆检索、协作解谜和多 Agent 远征。对话能力提供了交互入口；真正需要工程约束的部分，是让多个模型的建议进入一个持续变化的游戏世界。", "ECHO is a Unity AI project with character conversations, group chat, memory retrieval, cooperative puzzles and multi-agent expeditions. Conversation provides the interface. The engineering challenge is applying model suggestions to a game world that keeps changing."),
        copy("战斗不会等待网络响应，多个角色可能争抢同一项任务，已经过时的方案也可能在换关后才返回。因此，系统把模型协商、任务调度和实时行为树分开：模型提出分工偏好，Unity 决定当前哪些行动可以执行。", "Combat cannot wait for a network response. Characters may compete for the same task, and an old plan may arrive after a level change. The system separates model negotiation, task scheduling and local behavior trees: models suggest assignments, while Unity decides which actions are currently valid."),
      ],
      flow: [copy("世界状态 / 候选任务", "World state / candidate tasks"), copy("Python 模型协商", "Python negotiation"), copy("Unity 校验与调度", "Unity validation & scheduling"), copy("行为树执行 / 回执", "Behavior trees / receipts")],
      points: [
        copy("Unity / C#：交互界面、规则裁决、任务承诺、资源预约和实时行为树；uGUI / TextMeshPro 展示运行状态。", "Unity / C#: interaction, game rules, task commitments, resource reservations and real-time behavior trees; uGUI / TextMeshPro expose runtime state."),
        copy("Python / FastAPI / asyncio / py_trees：对话生成、异步模型作业和多角色协商流程。聊天使用 WebSocket，Agent 作业通过异步 HTTP 提交与轮询。", "Python / FastAPI / asyncio / py_trees: dialogue, asynchronous model jobs and multi-character negotiation. Chat uses WebSocket; agent jobs use asynchronous HTTP submission and polling."),
        copy("SQLite / LanceDB / BGE：来源记忆存储与向量检索，为对话提供可追溯的上下文。", "SQLite / LanceDB / BGE: source-backed memory and vector retrieval provide traceable conversation context."),
        copy("两层行为树承担不同职责：Python 的 py_trees 编排网络请求、复核和修订；Unity 的 ArenaNode 处理感知、接近、技能与中断。远端一轮可能跨越许多本地 tick，执行树不把网络等待当作行动前置条件。", "The two behavior-tree layers have different jobs: Python py_trees orchestrates requests, reviews and revisions; Unity ArenaNode handles perception, approach, skills and interrupts. A remote round spans many local ticks, so network completion is not a prerequisite for local action."),
      ],
    },
    {
      id: "async",
      title: copy("异步客户端：取消栅栏与迟到回包回收", "Async client: cancellation fences and late-response cleanup"),
      paragraphs: [
        copy("如果移动、攻击和救援都依赖一次模型请求返回，网络延迟就会变成角色发呆。ECHO 把请求提交与结果轮询放在异步流程里，本地行为树在等待期间继续处理战术行动；请求超时或服务失败时，也保留本地执行路径。", "If movement, attacks and rescues depend on a model response, network latency becomes idle characters. ECHO submits and polls jobs asynchronously while local behavior trees keep running tactical actions. Local execution remains available when a request times out or the service fails."),
        copy("另一个问题是迟到的结果。换关、重开、取消或玩家接管后，回包可能仍然成功，但已经不属于当前现场。不同链路会核对 generation、run_id、round、epoch、revision 以及当前实例等标识；只有仍匹配的结果才可以进入后续校验。暂停恢复后也需要重新判断有效性。", "A successful response can still be stale after a level change, restart, cancellation or player takeover. Depending on the workflow, generation, run_id, round, epoch, revision and current-instance checks gate the response. Resuming after a pause also requires validating that a result is still applicable."),
        copy("这解决的是响应时序与游戏状态不一致的问题。异步调用本身只让等待不阻塞；版本与实例校验才保证旧请求不会改写新一局。", "This addresses a mismatch between response timing and game state. Asynchronous calls make waiting non-blocking; version and instance checks keep old requests from mutating a new run."),
      ],
      code: { label: copy("POST 返回时再次检查本地代际 / 本地源码节选", "Recheck generation after POST / local excerpt"), value: "string id = (string)result?[\"id\"];\nif (generation != _generation)\n{\n    if (id != null) StartCoroutine(Delete(id));\n    yield break;\n}", source: { file: "Assets/Scripts/EchoDialogue/EchoArenaAgents.cs", line: 49 } },
      points: [copy("Cancel 先递增本地 _generation，立即撤销旧请求的执行资格；如果 POST 之后才返回 job id，仍主动 DELETE 远端任务。取消网络请求和拒绝旧结果分别处理。", "Cancel increments _generation to revoke execution permission immediately. If POST returns a job ID later, the client still deletes the remote job. Request cancellation and rejection of stale results are separate responsibilities."), copy("轮询使用 WaitForSecondsRealtime(0.5)，不会随游戏 timeScale 停住。暂停时 ready 结果留待恢复，TryAcceptReady 再核对模型实例、run_id、round、epoch、战斗阶段与关卡 revision，然后才应用分工。", "Polling uses WaitForSecondsRealtime(0.5), independent of game timeScale. A ready result waits through a pause. On resume, TryAcceptReady rechecks the model instance, run_id, round, epoch, fighting phase and level revision before applying assignments.")],
      references: [{ file: "Assets/Scripts/EchoDialogue/EchoArenaAgents.cs", line: 31 }, { file: "Assets/Scripts/EchoDialogue/EchoArenaAgents.cs", line: 55 }, { file: "Assets/Scripts/EchoDialogue/EchoArenaAgents.cs", line: 78 }],
    },
    {
      id: "job-lifecycle",
      title: copy("服务端作业：幂等、并发上限与取消传播", "Server jobs: idempotency, bounded concurrency and cancellation"),
      paragraphs: [
        copy("模型请求耗时长，客户端重试不能直接变成另一组付费调用。ArenaService 先验证 payload，再计算请求指纹；同一个 request_id 与同一份内容返回已有作业，ID 相同但内容不同则报 request_id_conflict。这让重试拥有明确的身份，而不是依靠客户端猜测请求是否成功。", "Long-running model requests make retries expensive. ArenaService validates the payload and computes a fingerprint. The same request_id and content return the existing job; reusing the ID with different content raises request_id_conflict. Retries have an explicit identity instead of relying on client guesses."),
        copy("作业管理在单进程内最多允许两条运行任务，忙时显式返回 agent_busy。创建作业时清理已完成缓存，将总缓存控制在 24 条以内，并惰性清理超过 900 秒的已完成项；单个作业由 asyncio.timeout(240) 限时。这些数值是当前资源边界，并非吞吐量或延迟指标。", "The single-process service permits two running jobs and explicitly returns agent_busy when full. Creation evicts completed jobs to keep the cache within 24 entries and lazily removes completed entries older than 900 seconds. asyncio.timeout(240) bounds each job. These values describe resource limits, not measured throughput or latency."),
        copy("取消先把公开状态改为 cancelled，清空 policy / assignments，再 cancel 异步任务；运行循环只在状态仍为 running 时发布成功结果，finally 回收取消或失败的叶节点。当前幂等索引存在内存中，服务重启或缓存淘汰后不会保留，适合本地演示服务；部署为多实例服务时需要额外设计共享状态。", "Cancellation first publishes cancelled and clears policy/assignments, then cancels the async task. The run loop publishes success only while still running; finally cleans up cancelled or failed leaves. Idempotency is in-memory and does not survive restart or eviction. Multi-instance hosting would require shared-state design."),
      ],
      code: { label: copy("请求身份与内容指纹 / 本地源码节选", "Request identity and payload fingerprint / local excerpt"), value: "old = self.requests.get(data['request_id'])\nfingerprint = digest(data)\nif old:\n    if old[1] != fingerprint:\n        raise ValueError('request_id_conflict')\n    return self.read(old[0])", source: { file: "backend/src/echo/arena.py", line: 24 } },
      references: [{ file: "backend/src/echo/arena.py", line: 22 }, { file: "backend/src/echo/arena.py", line: 51 }, { file: "backend/src/echo/arena.py", line: 61 }],
    },
    {
      id: "negotiation",
      title: copy("多 Agent 协商，怎样收敛成一个方案", "Converging on a multi-agent plan"),
      paragraphs: [
        copy("协商按固定阶段推进。成员基于候选任务和共享情报独立评估；队长汇总评估，提出负责人队列；成员再独立复核。收齐复核结果后决定采纳或修订，否决时最多再修订一次。这样可以保留不同角色的判断，同时给协商轮数设定明确上限。", "Negotiation proceeds through fixed stages. Members independently assess candidate tasks and shared information. A captain proposes assignee queues, then members independently review the plan. The workflow waits for every review and permits at most one revision after rejection, retaining multiple perspectives within a bounded process."),
        copy("后端使用 py_trees 的 ParallelPolicy.SuccessOnAll(synchronise=True)。同步锁存已经成功的叶子，等待其他成员完成，避免树在继续 tick 时重复发起已经完成的模型请求。方案就绪后还要经过 Unity 校验，不能直接等同于任务完成。", "The backend uses py_trees ParallelPolicy.SuccessOnAll(synchronise=True). Successful leaves remain synchronized while other members finish, preventing completed model requests from being reissued on later ticks. A ready plan must still pass Unity validation and does not mean a task has finished."),
        copy("界面将协商状态、公开的分工理由和战场并排展示。这里的理由是提供给使用者查看的摘要，配合执行回执用于核对分工是否落地。", "The interface places negotiation state, public assignment summaries and combat side by side. These summaries, together with execution receipts, help check whether a proposed assignment was applied."),
      ],
      flow: [copy("独立评估", "Independent assessment"), copy("队长分工", "Captain assignment"), copy("独立复核", "Independent review"), copy("采纳 / 一次修订", "Accept / one revision")],
      image: { src: "/ideas/echo/negotiation.webp", width: 1920, height: 1176, caption: copy("协商与战斗同时显示，分别观察方案进度和实际执行。", "Negotiation and combat remain visible together, exposing plan progress and actual execution separately.") },
      code: { label: copy("复核完成与赞成票分别表达 / 本地源码节选", "Completion and approval are separate / local excerpt"), value: "self.reviews[node.attempt].append(result['approve'])\nreturn True\n\n# resolve()\napproved = bool(self.reviews[int(node.npc)]) and all(self.reviews[int(node.npc)])", source: { file: "backend/src/echo/expedition_tree.py", line: 68 } },
      points: [copy("review 返回 True 表示本次复核已经完成，即使意见为否决，也让并行节点等齐其他成员；resolve 再用非空检查与 all 汇总赞成票。这样不会因第一张否决票提前结束本轮，使迟到的意见混入下一轮。", "review returns True when a review finishes, even for a rejection. The parallel node waits for other reviewers; resolve then checks for a non-empty set of unanimous approvals. A first rejection does not prematurely end a round and mix late reviews into the next one.")],
      references: [{ file: "backend/src/echo/expedition_tree.py", line: 16 }, { file: "backend/src/echo/expedition_tree.py", line: 63 }],
    },
    {
      id: "scheduling",
      title: copy("Utility AI：硬约束过滤与软偏好评分", "Utility AI: hard constraints and soft preferences"),
      paragraphs: [
        copy("远征中的任务存在前置关系。任务依赖图负责判断哪些任务已具备执行条件；本地调度每半秒为尚未承诺的任务评估负责人，综合职业、距离、风险、生命值、预算和疲劳等因素计算效用。", "Expedition tasks have prerequisites. A dependency graph determines which tasks are ready. Every half second, the local scheduler evaluates uncommitted tasks using role, distance, risk, health, budget and fatigue to score suitable assignees."),
        copy("分工还需要稳定性。一个角色至多持有一个长任务，模型的新偏好不会直接覆盖正在执行的承诺。否则，每次建议变化都会使角色放弃当前动作，表现成反复赶路和频繁切换。角色倒地、任务失败或前置失效时，释放受影响的任务，再进入后续分配。", "Assignments also need stability. Each actor holds at most one long task, and new model preferences do not directly overwrite ongoing commitments. Otherwise, every changed suggestion could make characters abandon work and repeatedly travel between tasks. Incapacitation, failure or invalid prerequisites release affected tasks for later assignment."),
      ],
      code: { label: copy("Score 的等价表达 / 变量名简化", "Equivalent Score expression / simplified variable names"), value: "score = priority\n      + (modelPreferred ? 32 : 0)\n      + (roleMatched ? 30 : 0)\n      - distance * 0.055\n      - risk * (actor.Kind == 0 ? 3 : 12)\n      - (1 - hp / maxHp) * 24\n      - budget * 0.2\n      - fatigue;", source: { file: "Assets/Scripts/EchoDialogue/EchoExpeditionDirector.cs", line: 146 } },
      points: [copy("硬约束先于评分：Ready 检查依赖已完成、重试冷却和任务期限；Eligible 排除倒地、危险区、救援目标本人等不可执行情况；Assign 再检查一人一任务并预约预算。高分不能绕过这些条件。", "Hard constraints precede scoring: Ready checks completed dependencies, retry cooldown and deadlines; Eligible excludes incapacitated actors, danger and self-rescue. Assign enforces one task per actor and reserves the budget. A high score cannot bypass these checks."), copy("模型分工只贡献 32 分偏好，职业适配贡献 30 分；距离、风险、伤势、预算和失败疲劳仍参与决策。失败后按尝试次数增加疲劳，降低同一成员反复接手同一失败任务的倾向。权重属于启发式配置，仍需场景测试调参。", "Model preference adds 32 points and role fit adds 30, while distance, risk, injury, budget and failure fatigue remain part of the decision. Failure increases fatigue by attempt count, discouraging repeated reassignment to the same actor. These are heuristic weights that require scenario-based tuning.")],
      references: [{ file: "Assets/Scripts/EchoDialogue/EchoExpeditionDirector.cs", line: 131 }, { file: "Assets/Scripts/EchoDialogue/EchoExpeditionDirector.cs", line: 155 }, { file: "Assets/Scripts/EchoDialogue/EchoExpeditionDirector.cs", line: 162 }],
    },
    {
      id: "task-contract",
      title: copy("任务 DAG 与模型输出的双端校验", "Task DAG validation and checks on both sides"),
      paragraphs: [
        copy("模型面对的是 Unity 提供的最多 16 个候选任务，包含稳定 ID、依赖、预算、合法成员与评分。后端逐项校验字段集合、任务 ID 唯一性、成员范围和有限数值；number 明确拒绝 bool、NaN 与 Infinity，避免异常值穿过成本比较。", "Models receive at most 16 Unity-defined tasks with stable IDs, dependencies, budgets, eligible members and scores. The backend validates field sets, unique IDs, membership and finite numeric values. The number helper rejects bool, NaN and Infinity so invalid values cannot cross cost comparisons."),
        copy("依赖校验逐轮移除前置已经满足的任务。只要 pending 非空且无法找到 ready，就存在循环依赖或缺失引用，直接拒绝。实现偏向可读性：反复扫描在当前 16 节点上限下足够简单；更大任务图可换为入度队列实现 O(V + E) 的拓扑检查。", "Dependency validation repeatedly removes tasks whose prerequisites have been resolved. If pending is non-empty and no task is ready, a cycle or missing reference is rejected. Repeated scans favor clarity at the current 16-node limit; a larger graph could use an indegree queue for O(V + E) topological validation."),
        copy("validate_assignments 再约束模型只能引用真实任务与 eligible 成员，同一任务不能重复分配，也不能只返回已经完成或失败的任务。Unity 收到结果后仍验证关卡版本、任务与角色身份；Apply 只登记未来偏好，实际可执行性在本地 Assign 时重新判断，覆盖协商期间现场状态变化。", "validate_assignments restricts output to real tasks and eligible members, rejects duplicate tasks and requires at least one active task. Unity rechecks the level version and task/actor identities. Apply records future preferences; Assign checks live executability again to account for changes during negotiation."),
      ],
      code: { label: copy("有界任务图的依赖检查 / 本地源码节选", "Dependency validation for a bounded task graph / local excerpt"), value: "pending = set(graph)\nresolved = set()\nwhile pending:\n    ready = {ident for ident in pending\n             if set(graph[ident]['dependencies']) <= resolved}\n    if not ready:\n        raise ValueError('cyclic_or_missing_dependency')\n    resolved.update(ready)\n    pending -= ready", source: { file: "backend/src/echo/expedition_contract.py", line: 38 } },
      references: [{ file: "backend/src/echo/expedition_contract.py", line: 8 }, { file: "backend/src/echo/expedition_contract.py", line: 60 }],
    },
    {
      id: "resources",
      title: copy("资源先预约，任务才真正成立", "Reserve resources before committing tasks"),
      paragraphs: [
        copy("救援任务和战斗技能可能消费同一份能量。如果两个系统分别检查余额，它们可能同时认为资源足够，直到真正执行才发现冲突。这里使用统一的资源预约账本：先检查可用额度并预约，再写入任务承诺。", "Rescue tasks and combat skills may spend the same energy. Separate balance checks can allow both systems to assume sufficient resources until execution reveals the conflict. A shared reservation ledger checks and reserves available energy before a task is committed."),
        copy("可用额度等于当前能量减去已预约额度。技能只消费未预约部分；任务实际消费时提交预算，取消、失败或结束时释放相应预约。它约束的是多个系统对同一资源的逻辑竞争，账本本身在 Unity 单线程执行路径里维护。", "Available energy is current energy minus held reservations. Skills consume only unreserved energy. Tasks commit spending or release reservations on cancellation, failure or completion. The ledger coordinates logical contention between systems within Unity's single-threaded execution path."),
      ],
      code: { label: copy("同一任务重复预约不重复占用 / 本地源码节选", "Idempotent task reservation / local excerpt"), value: "public bool Reserve(string key, float amount)\n{\n    if (_held.ContainsKey(key))\n        return Mathf.Approximately(_held[key], amount);\n    if (amount < 0 || Available + .001f < amount)\n        return false;\n    _held.Add(key, amount);\n    return true;\n}", source: { file: "Assets/Scripts/EchoDialogue/EchoExpeditionTasks.cs", line: 36 } },
      points: [copy("幂等性：同一个 key、相同额度再次预约直接成功；额度变化则拒绝，防止重试叠加占用。Release 删除对应 key，可被取消与失败路径重复调用。", "Idempotency: the same key and amount succeed without adding another hold; a changed amount is rejected. Release removes the key and can be called repeatedly by cancellation and failure paths."), copy("提交语义：Commit 先确认预约存在且当前能量足够，再扣除余额并移除预约。失败时保留预约，由后续恢复路径处理，避免账本和任务承诺无声脱节。", "Commit semantics: verify the reservation and current energy before spending and removing the hold. A failed commit retains the reservation for recovery, keeping the ledger aligned with task commitments.")],
      references: [{ file: "Assets/Scripts/EchoDialogue/EchoExpeditionTasks.cs", line: 43 }, { file: "Assets/Scripts/EchoDialogue/EchoExpeditionTasks.cs", line: 50 }],
    },
    {
      id: "behavior-tree",
      title: copy("行为树既要持续执行，也要能被中断", "Behavior trees that persist and interrupt"),
      paragraphs: [
        copy("接近目标、开始任务、持续执行是一个有阶段的过程，不能每帧从头开始；但角色遇到危险时，又必须及时改变行为。这里用 MemorySequence 保存执行阶段，用响应式 Selector 持续检查更高优先级的条件，感知与行动并行推进。", "Approaching a target, starting a task and performing it form a staged process that should not restart every frame. Danger still requires an immediate response. MemorySequence retains progress, a responsive Selector rechecks higher-priority conditions, and perception runs alongside action."),
        copy("中断不只是切换一个节点。OnAbort 需要释放任务与资源预约，超时、重试和失败恢复也要回到一致的状态。否则角色虽然离开了旧任务，旧预约却可能继续占用预算，影响后续分工。", "Interrupting means more than selecting another node. OnAbort releases task and resource reservations, while timeout, retry and failure paths restore consistent state. Without cleanup, a character could leave a task while its old reservation still blocks later assignments."),
        copy("完整行为树面板展示节点运行状态与访问次数。结合战场，可以进一步区分条件未通过、叶子持续运行和分支没有机会执行等情况，将“角色不动了”定位到具体阶段。", "The complete tree panel exposes node states and visit counts. Alongside combat, it helps distinguish unmet conditions, continuously running leaves and branches that never execute, turning an idle-character symptom into a more specific investigation."),
      ],
      image: { src: "/ideas/echo/behavior-tree.webp", width: 1920, height: 1176, caption: copy("运行中的完整行为树；面板状态来自实际执行。", "The full behavior tree at runtime, with state from execution.") },
      points: [copy("TaskBranch 的执行阶段为 Approach → Start → Perform。接近分支配置 Retry(3)，完整流程外包 Timeout(36 秒)；失败分支记录原因并释放任务预约。", "TaskBranch runs Approach → Start → Perform. Approach uses Retry(3), and the lifecycle has a 36-second timeout. Its failure branch records the cause and releases the task reservation."), copy("进入前依次校验任务类型、依赖与目标、角色存活且未冻结。OnAbort 再核对当前任务类型后调用 Interrupt，避免旧分支误中断其他类型的新任务。", "Entry guards validate task type, dependencies and target, then actor health and freeze state. OnAbort checks the current task type before Interrupt, preventing an old branch from interrupting a new task of another type.")],
      references: [{ file: "Assets/Scripts/EchoDialogue/EchoExpeditionBrain.cs", line: 51 }, { file: "Assets/Scripts/EchoDialogue/EchoExpeditionBrain.cs", line: 60 }, { file: "Assets/Scripts/EchoDialogue/EchoExpeditionBrain.cs", line: 67 }],
    },
    {
      id: "memory-puzzle",
      title: copy("RAG：短期原文选择与长期来源过滤", "RAG: short-term context selection and long-term source filtering"),
      paragraphs: [
        copy("长期对话中，历史越多不代表上下文越有效。ECHO 结合近期原文与长期来源记忆，SQLite 保存来源，LanceDB 与 BGE 负责向量检索。候选、召回保留和实际注入分别记录，并按会话作用域组织，便于检查某次回答究竟使用了哪些信息。", "More conversation history does not automatically produce better context. ECHO combines recent dialogue with long-term source memory. SQLite stores sources; LanceDB and BGE support vector retrieval. Candidates, retained recall and actual context injection are recorded separately and organized by conversation scope."),
        copy("短期承接与长期检索分开。EchoConversation.previous 从最新用户发言之前取最近两轮、最多 24 条可见原文；route 只允许模型返回整数索引，校验范围并去重，再把原文放回上下文。选择失败时标记 fallback_previous 并保留有界候选，不让选择器重新编写事实。", "Short-term continuity and long-term retrieval are separate. EchoConversation.previous takes up to 24 visible messages from the two preceding turns. route accepts only in-range integer indices, deduplicates them and preserves original wording. Failure is labeled fallback_previous and retains the bounded candidates instead of letting the selector rewrite facts."),
        copy("长期来源经 SQLite / LanceDB 检索后，还按与最新用户话题的文本重合或 BGE 相似度 ≥ 0.75 过滤。每条来源保留 node_id，并记录 text_match、semantic_match 或 topic_filtered；候选命中不等于最终注入，注入也不能证明模型在回答中真正使用。0.75 是当前门槛，需要结合实际问答样本评估误召回和漏召回。", "Retrieved sources are filtered by text overlap with the latest user topic or BGE similarity of at least 0.75. Each keeps its node_id and a text_match, semantic_match or topic_filtered reason. A hit is not necessarily injected, and injection does not prove use in an answer. The threshold needs evaluation on real questions for false positives and missed recall."),
        copy("作用域由角色 ID 与排序后的固定成员集合生成，减少私聊与不同群组之间的记忆串用。来源 ID 关联原消息；忘记时排除该角色在该范围内的来源，历史消息仍保留。自动群聊的检索锚点继续使用最新用户原话，避免把上一位 NPC 的回应不断当作新主题扩写。", "The memory scope combines the character ID with the sorted fixed member set, separating private and differently composed group memories. Source IDs map to original messages. Forgetting excludes a source for that character and scope while retaining visible history. Automatic group discussion continues to anchor retrieval to the latest user message instead of drifting through NPC replies."),
      ],
      image: { src: "/ideas/echo/memory.webp", width: 1920, height: 1080, caption: copy("检索过程与角色对话并排呈现，检查进入上下文的记忆来源。", "Retrieval and character dialogue are shown together to inspect the sources entering context.") },
      code: { label: copy("长期来源保留稳定 ID / 本地源码节选", "Preserve stable source IDs / local excerpt"), value: "return [(nid, item) for nid, item in entries\n        if cls.relevant(item['value'], query, False)\n        or similarities.get(nid, 0) >= .75]", source: { file: "backend/src/echo/conversation.py", line: 37 } },
      references: [{ file: "backend/src/echo/conversation.py", line: 41 }, { file: "backend/src/echo/conversation.py", line: 48 }, { file: "backend/src/echo/memory.py", line: 75 }, { file: "backend/src/echo/state.py", line: 28 }],
    },
    {
      id: "puzzle-tool",
      title: copy("规则工具：用 GF(2) 高斯消元提供可验证候选", "Rule tool: verifiable candidates through GF(2) elimination"),
      paragraphs: [
        copy("5×5 熄灯游戏的每次点击都会翻转一组格子；同一格点击两次互相抵消，因此可写成 GF(2) 上的 Ax = b。A 的每一列表示点击一个格子的影响，b 是当前亮灯状态，x 表示哪些格子需要点击。这里的加法就是 XOR。", "In the 5×5 Lights Out game, each click toggles a set of cells, and two clicks cancel. This gives Ax = b over GF(2): each column of A is one click's effect, b is the current board and x identifies cells to click. Addition is XOR."),
        copy("Solve 使用 25 个 uint 表示增广矩阵：低 25 位存系数，第 25 位存右端项。找到主元后交换行，再用异或消去其他行；检查零系数行是否带非零右端项，发现矛盾就返回空结果。自由变量保持为零，得到一个可行解，未搜索最少点击次数。", "Solve stores the augmented matrix in 25 uint values: the lower 25 bits hold coefficients and bit 25 holds the right-hand side. It swaps in pivots, XOR-eliminates other rows and rejects a zero coefficient row with a nonzero right-hand side. Free variables remain zero, yielding one feasible solution without minimizing clicks."),
        copy("工具负责确定性规则计算，模型参与选择、解释与复核，最终动作由 Unity 根据合法动作和棋盘 revision 校验后执行。玩家接管或重开会使旧代际失效，让算对了的旧棋盘答案也不能应用到新现场。这条边界使解谜能力具有可复现的规则依据。", "The tool handles deterministic rules; models select, explain and review candidates. Unity validates the action and board revision before execution. Player takeover or restart invalidates the old generation, preventing a correct answer for an old board from being applied to a new one."),
      ],
      code: { label: copy("位运算消元 / 本地源码节选", "Bitwise elimination / local excerpt"), value: "uint temp = rows[rank];\nrows[rank] = rows[found];\nrows[found] = temp;\nfor (int row = 0; row < 25; row++)\n    if (row != rank && (rows[row] & (1u << column)) != 0)\n        rows[row] ^= rows[rank];\npivots.Add(column);\nrank++;", source: { file: "Assets/Scripts/EchoDialogue/EchoArcadeModel.cs", line: 190 } },
      references: [{ file: "Assets/Scripts/EchoDialogue/EchoArcadeModel.cs", line: 175 }, { file: "Assets/Scripts/EchoDialogue/EchoArcadeModel.cs", line: 194 }],
    },
    {
      id: "takeaways",
      title: copy("复盘：先把执行链路变得可检查", "Takeaway: make execution inspectable"),
      paragraphs: [
        copy("源码依据：本文代码与文件位置对应当前本地 ECHO 实现；已核对的公开仓库主分支尚未包含这些模块，因此这里保留路径与行号，不提供无效的公开代码链接。", "Source provenance: code and file locations refer to the current local ECHO implementation. These modules are absent from the inspected public main branch, so references show paths and line numbers without broken public links."),
        copy("这个项目的工程重点，是把模型建议接入可执行、可中断、可追溯的游戏系统。模型协商负责选择方向，任务调度负责承诺与预算，行为树负责现场动作，日志与界面负责解释每个阶段发生了什么。出现问题时，可以先判断它来自检索、模型输出、结果过期、调度条件还是执行中断。", "The engineering focus is connecting model suggestions to a game system that can execute, interrupt and trace actions. Negotiation chooses direction, scheduling manages commitments and budgets, behavior trees act locally, and logs and UI expose each stage. Debugging can then distinguish retrieval, model output, stale results, scheduling conditions and execution interruptions."),
        copy("演示覆盖了单聊、群聊、协作解谜、远征协商与行为树运行。它展示的是已有实现及运行片段；本文没有用这些片段推导通关率、性能提升或最优策略。超时和过期回包等保护机制按实现说明，仍需专项故障注入与重复跑测来量化可靠性。", "The demo covers individual and group conversations, cooperative puzzles, expedition negotiation and behavior-tree execution. These are implementation and runtime examples, not evidence of completion rates, performance gains or optimal strategies. Timeout and stale-response protections are described as implemented mechanisms; quantifying reliability still needs dedicated fault injection and repeated runs."),
      ],
    },
  ],
  "level-select": [
    {
      id: "interaction-goal",
      title: copy("经纬角配置与双轴相机支架", "Angle configuration and a two-axis camera rig"),
      paragraphs: [
        copy("关卡位置由可序列化的 Kingdom 配置承载：name、x、y 记录名称和方向角，范围为 x ∈ [-180, 180]、y ∈ [-89, 89]。KingdomSelect 依次生成地标、球面标记和按钮，标记的 localEulerAngles 为 (y + offsetY, -x - offsetX, 0)。这样，空间布局由关卡数据驱动，按钮索引连接到对应预览资源。", "A serializable Kingdom stores a name and two angles: x in [-180, 180], y in [-89, 89]. KingdomSelect creates landmarks, markers and buttons. Marker localEulerAngles are (y + offsetY, -x - offsetX, 0), so configuration drives spatial layout and button indices connect to preview assets."),
        copy("相机支架分成两层：cameraParent 绕 X 轴改变俯仰，cameraPivot 绕 Y 轴转向目标。LookAtKingdom 分别调用 DOLocalRotate，共享 lookDuration 与 lookEase，同时把 FollowTarget.target 指向关卡的 visualPoint。将两个轴拆开，便于单独调整球面布局和镜头手感。", "The rig uses two transforms: cameraParent handles X-axis pitch, and cameraPivot handles Y-axis heading. LookAtKingdom calls DOLocalRotate on each with shared duration and easing, then assigns FollowTarget.target to the level's visualPoint. Separating axes makes the rig easier to tune."),
      ],
      code: { label: copy("双层相机旋转 / 源码节选", "Two-level rotation / excerpt"), value: "cameraParent.DOLocalRotate(\n    new Vector3(k.y, 0, 0), lookDuration, RotateMode.Fast\n).SetEase(lookEase);\ncameraPivot.DOLocalRotate(\n    new Vector3(0, -k.x, 0), lookDuration, RotateMode.Fast\n).SetEase(lookEase);", source: levelSource("KingdomSelect.cs", 84) },
      references: [levelSource("KingdomSelect.cs", 49), levelSource("KingdomSelect.cs", 84)],
    },
    {
      id: "bezier-path",
      title: copy("二次贝塞尔：用三个控制点生成关卡路径", "Quadratic Bezier paths from three control points"),
      paragraphs: [
        copy("Bezier.cs 通过三个控制点描述相邻关卡之间的弧线。P0 和 P2 来自当前、下一个标记的子节点，P1 由父节点欧拉角的均值和端点距离构造；distanceAmount 控制中间点沿前向偏移的幅度。它是为视觉连接服务的控制点构造，并非球面最短路径求解。", "Bezier.cs describes the link between neighboring levels using three points. P0 and P2 come from marker children. P1 is constructed from averaged parent Euler angles and endpoint distance; distanceAmount controls its forward offset. This is a visual curve construction, not a spherical shortest-path solver."),
        copy("绘制时将曲线采样到 positions 数组，再一次性传给 LineRenderer.SetPositions。仓库当前固定 50 个采样点，t = i / numPoints，因此最后一个样本是 0.98，未包含精确终点。这里保留原实现；若继续打磨，应把端点覆盖、跨 ±180° 的角度平均，以及采样密度一起纳入验证。", "The curve is sampled into a positions array and passed to LineRenderer.SetPositions. The current code uses 50 samples with t = i / numPoints, ending at 0.98 rather than the exact endpoint. Further refinement should verify endpoint coverage, angle averaging across ±180°, and sampling density."),
      ],
      code: { label: copy("二次贝塞尔计算 / 源码节选", "Quadratic Bezier evaluation / excerpt"), value: "float u = 1 - t;\nfloat tt = t * t;\nfloat uu = u * u;\nVector3 p = uu * p0;\np += 2 * u * t * p1;\np += tt * p2;\nreturn p;", source: levelSource("Bezier.cs", 75) },
      references: [levelSource("Bezier.cs", 36), levelSource("Bezier.cs", 64)],
    },
    {
      id: "state-feedback",
      title: copy("EventSystem 如何联动选中反馈与预览图", "Connecting EventSystem selection to preview feedback"),
      paragraphs: [
        copy("KingdomButton 实现 ISelectHandler、IDeselectHandler、ISubmitHandler 和指针进出回调。OnSelect 更新文字、底板与圆点颜色，并触发缩放反馈和 SwitchPanelImage；OnSubmit 也调用图片切换。相机朝向通过 Button.onClick 接入 LookAtKingdom，因此选择态反馈和点击执行各有入口。", "KingdomButton implements selection, deselection, submit and pointer callbacks. OnSelect changes text, background and marker colors, triggers a scale punch and switches the preview. OnSubmit also switches the preview. Camera rotation is wired through Button.onClick to LookAtKingdom, separating selection feedback from click execution."),
        copy("图片切换从 KingdomSelectImages 按 kingdomIndex 取 Sprite，再以 DOFade 淡出、OnComplete 替换图片、DOFade 淡入。0.3 秒的过渡被分成前后各一半，使图片替换发生在不可见时。指针悬停还会检查当前 EventSystem 选择对象，避免覆盖已选中按钮的颜色。", "The preview resolves a Sprite by kingdomIndex, fades out, replaces the sprite in OnComplete and fades back in. A 0.3-second transition is split in half so replacement happens while hidden. Pointer hover checks EventSystem selection before changing colors."),
      ],
      flow: [copy("Button / EventSystem", "Button / EventSystem"), copy("kingdomIndex", "kingdomIndex"), copy("Sprite + 相机目标", "Sprite + camera target"), copy("DOTween 过渡", "DOTween transition")],
      code: { label: copy("先淡出再替换图片 / 源码节选", "Fade before replacing the image / excerpt"), value: "sharedPanelImage.DOFade(0, fadeDuration / 2)\n    .OnComplete(() => {\n        sharedPanelImage.sprite = newSprite;\n        sharedPanelImage.DOFade(1, fadeDuration / 2);\n    });", source: levelSource("KingdomButton.cs", 79) },
      references: [levelSource("KingdomButton.cs", 51), levelSource("KingdomSelectImages.cs", 20)],
    },
    {
      id: "interaction-review",
      title: copy("交互实现的边界与进一步改进", "Implementation boundaries and next refinements"),
      paragraphs: [
        copy("这套原型把关卡数据、空间表现和界面反馈串成了可调试的链路，动画插值复用 DOTween。读取源码后，也能明确下一步的改进位置：缓存 LookAtKingdom 中的对象引用；将五个独立 Sprite 字段改为可扩展配置；对连续点击建立目标状态与动画取消策略。", "The prototype connects level data, spatial presentation and interface feedback, using DOTween for interpolation. Source review also identifies concrete improvements: cache references used by LookAtKingdom, replace five separate Sprite fields with extensible configuration, and define target-state and cancellation behavior for rapid selection changes."),
        copy("尤其需要区分两个已有实现。PanelManager 带 currentIndex 和 isSwitching 判断，但当前 KingdomButton 调用的是自己的 SwitchPanelImage；不能因此宣称按钮链路已经具备 PanelManager 的防重入保护。继续迭代时应收敛这两条图片切换路径，并测试快速切换后的相机、图片和选择态是否一致。", "PanelManager has currentIndex and isSwitching guards, but KingdomButton calls its own SwitchPanelImage. The guards in one class therefore do not prove that the button path is protected. A future iteration should consolidate these paths and test camera, preview and selection consistency after rapid changes."),
      ],
      references: [levelSource("PanelManager.cs", 42), levelSource("KingdomButton.cs", 71)],
    },
  ],
  "ase-shader": [
    {
      id: "dissolve-math",
      title: copy("从 ASE 节点追到溶解函数", "Trace ASE nodes into the dissolve function"),
      paragraphs: [
        copy("效果视频记录了手电筒显隐、溶解、刀光等练习；公开仓库还包含 UI 动画与渲染实验。下面选择能由源码核验的实现展开，不把某个 shader 文件强行等同于视频中的全部效果。rongjie.shader 的文件头标明由 ASE 生成，核心逻辑位于 surf 函数。", "The video records reveal, dissolve and slash studies; the public repository also contains UI and rendering experiments. The following sections focus on source-verifiable implementations without equating one shader with every effect in the recording. rongjie.shader is ASE-generated, with its main logic in surf."),
        copy("溶解场由 UV.y 的幂函数减去滚动噪声构成，再用 smoothstep 把阈值附近映射为连续遮罩。_Float1 控制噪声强度，_Float3 控制过渡宽度。开启 _KEYWORD0_ON 时阈值使用 frac(_Time.y * 0.35)，形成循环推进；关闭时使用固定值。遮罩乘到原贴图 Alpha 上，完成显隐。", "The dissolve field subtracts scrolling noise from a power of UV.y, then smoothstep maps the threshold region into a continuous mask. _Float1 controls noise strength and _Float3 controls transition width. _KEYWORD0_ON selects a repeating frac(_Time.y * 0.35) threshold; otherwise a constant is used. The mask multiplies the source texture's alpha."),
        copy("发光边缘单独计算：根据遮罩到 _Float4 的距离生成窄带，再乘颜色和 _Float6 写入 Emission。可见性和边缘亮度分开控制，调节发光强度时不会改变可见区域。这里主表面采用 alpha:fade；阴影 Pass 另有抖动采样与 clip，二者不应混为同一个透明裁剪策略。", "An emissive band is calculated separately from the distance between the mask and _Float4, then multiplied by color and _Float6. Visibility and edge brightness can therefore be tuned independently. The surface uses alpha:fade, while the shadow pass uses dithering and clip; these are different transparency paths."),
      ],
      code: { label: copy("溶解与边缘 / 按源码重命名的等价表达", "Dissolve and edge / equivalent expression with renamed variables"), value: "field = pow(uv.y, 2.043477) - noise * noiseStrength;\nmask = smoothstep(threshold, threshold + width, field);\nedge = saturate(1 - abs(mask - edgeCenter) / 0.1634783);\nalpha = textureAlpha * mask;\nemission = edgeColor * intensity * edge;", source: shaderSource("ase test 2/rongjie.shader", 48) },
      references: [shaderSource("ase test 2/rongjie.shader", 42), shaderSource("ase test 2/rongjie.shader", 126)],
    },
    {
      id: "uv-distortion",
      title: copy("双路 UV Panner 与噪声驱动的采样坐标", "Two UV panners and noise-driven sampling"),
      paragraphs: [
        copy("ase_next.shader 使用两路由 _Time.y 驱动的 UV。第一路沿 _Vector0 平移，第二路沿 _Vector1 平移并采样噪声；噪声红通道复制成 float2 后，与第一路坐标通过 lerp 混合，结果用于采样效果贴图。动画主要来自采样坐标随时间变化，无需逐帧更换纹理。", "ase_next.shader uses two UV panners driven by _Time.y. One moves along _Vector0. The other moves along _Vector1 and samples noise. Its red channel is duplicated into float2 and lerped with the first coordinates before sampling the effect texture. Motion comes from changing coordinates over time."),
        copy("源码中的混合是 lerp(baseUV, noiseRR, strength)，而不是常见的 baseUV + noiseOffset。两者在 strength 较大时差异明显：前者会把采样坐标拉向噪声值。最终效果叠加又受到基础贴图 Alpha、_Color0 和顶点色调制。区分坐标混合与坐标偏移，才能解释参数改变后的画面，而不只依靠试数值。", "The code uses lerp(baseUV, noiseRR, strength), rather than baseUV + noiseOffset. At higher strength it pulls sampling coordinates toward noise values. The final effect is modulated by base-texture alpha, _Color0 and vertex color. Distinguishing coordinate blending from offsets explains why parameters change the image."),
      ],
      code: { label: copy("噪声坐标混合 / 源码节选", "Noise-coordinate blend / excerpt"), value: "float2 temp_cast_0 =\n    (tex2D(_TextureSample0, panner5).r).xx;\nfloat2 lerpResult9 = lerp(panner3, temp_cast_0, _Float0);", source: shaderSource("First/ase_next.shader", 143) },
      references: [shaderSource("First/ase_next.shader", 137)],
    },
    {
      id: "material-scope",
      title: copy("MaterialPropertyBlock：把纹理绑定限制在对象内", "MaterialPropertyBlock: scope texture bindings per object"),
      paragraphs: [
        copy("SetBackgroundTexture 接受普通 Texture 或 RenderTexture，先通过 Shader.PropertyToID 缓存属性 ID，再创建并复用 MaterialPropertyBlock。Apply 中先 GetPropertyBlock，保留对象已有的参数，再 SetTexture 并写回 Renderer。SpriteRenderer 与普通 Renderer 分开处理。", "SetBackgroundTexture accepts a Texture or RenderTexture, caches its property ID with Shader.PropertyToID and reuses a MaterialPropertyBlock. Apply reads the existing property block before setting the texture and writing it back, preserving other per-object values. SpriteRenderer and Renderer have separate paths."),
        copy("这样，背景纹理赋值作用于指定 Renderer，避免全局 Shader 参数影响其他对象，也避免为了单个属性复制整份材质。这个选择并不自动等于批处理性能更好：具体渲染管线与 SRP Batcher 兼容性仍需实测。若只是同一 RenderTexture 的内容更新，也可进一步判断是否需要每帧重新绑定。", "This limits the binding to the selected renderer, avoids global shader state and does not require duplicating a material for one property. It is not automatically a batching optimization: render-pipeline and SRP Batcher behavior still need measurement. Updating the contents of the same RenderTexture may also not require rebinding every frame."),
      ],
      code: { label: copy("保留已有属性再覆盖纹理 / 源码节选", "Preserve existing properties before overriding / excerpt"), value: "meshRenderer.GetPropertyBlock(materialPropertyBlock);\nmaterialPropertyBlock.SetTexture(texturePropertyId, backgroundTexture);\nmeshRenderer.SetPropertyBlock(materialPropertyBlock);", source: shaderSource("water shader/SetBackgroundTexture.cs", 70) },
      references: [shaderSource("water shader/SetBackgroundTexture.cs", 23), shaderSource("water shader/SetBackgroundTexture.cs", 55)],
    },
    {
      id: "stencil-lighting",
      title: copy("Stencil 与光照：分开理解像素可见性和着色", "Stencil and lighting: separate visibility from shading"),
      paragraphs: [
        copy("ShowRoom_Stencil.shader 是 URP 的 UniversalForward Pass。Stencil 设置为 Ref 1、Comp NotEqual、Pass Replace：模板值不等于 1 的像素才通过，成功后写入引用值。其效果依赖先前写入的模板值与渲染顺序，不能仅看到这段设置就认定已经完成整套遮罩系统。", "ShowRoom_Stencil.shader uses a URP UniversalForward pass with Ref 1, Comp NotEqual and Pass Replace. Pixels whose stencil value differs from 1 pass, and successful fragments write the reference value. The result depends on previous stencil writes and render order."),
        copy("着色部分先把物体坐标和法线转换到世界空间，采样主贴图与可选遮罩；直接光使用法线与主光方向的点积，再乘阴影衰减，环境部分调用 ThreeColorAmbient。Stencil 决定片元能否通过，光照函数决定通过后是什么颜色，二者负责不同层面的问题。", "Shading transforms positions and normals into world space, samples the base texture and optional mask, evaluates direct light with a normal/light dot product and shadow attenuation, and adds ThreeColorAmbient. Stencil gates fragments; lighting determines the color of fragments that pass."),
      ],
      code: { label: copy("模板测试 / 源码节选", "Stencil test / excerpt"), value: "Stencil\n{\n    Ref 1\n    Comp NotEqual\n    Pass Replace\n}", source: shaderSource("library/Shader/ShowRoom_Stencil.shader", 25) },
      references: [shaderSource("library/Shader/ShowRoom_Stencil.shader", 75), shaderSource("library/Shader/ShowRoom_Stencil.shader", 87)],
    },
    {
      id: "ui-clock",
      title: copy("游戏暂停时，UI 动画为什么还能继续", "Why UI animation continues while gameplay is paused"),
      paragraphs: [
        copy("PauseMenuController.Show 保存原来的 Time.timeScale，再将其置零。若界面动画也使用缩放时间，它会和游戏一起停住。DOTween 路径为动画指定 SetUpdate(true)，协程路径则使用 Time.unscaledDeltaTime，给 UI 保留独立的时间来源。Hide 在退场完成回调里恢复保存的时间倍率。", "PauseMenuController.Show saves Time.timeScale and sets it to zero. Animations that use scaled time would freeze too. Its DOTween path uses SetUpdate(true), while the coroutine path uses Time.unscaledDeltaTime. Hide restores the saved time scale after the exit transition completes."),
        copy("交互还要跟随显隐状态：CanvasGroup.interactable 与 blocksRaycasts 控制菜单是否可操作、是否拦截点击。动画前调用 KillAllTweens 停止旧过渡；按钮悬停也先 Kill 当前目标的动画，再启动新动画。时间、输入和过渡生命周期一起处理，才能避免暂停后按钮不响应或退场后仍挡住游戏。", "CanvasGroup.interactable and blocksRaycasts coordinate interaction with visibility. KillAllTweens stops previous transitions; hover animations also kill prior tweens on their targets. Timing, input and animation lifecycle must work together to avoid frozen controls or invisible UI blocking gameplay."),
      ],
      code: { label: copy("暂停期间使用独立更新 / 源码节选", "Independent updates during pause / excerpt"), value: "overlay.DOFade(overlayTargetColor.a, showDur)\n    .SetEase(moveEase)\n    .SetUpdate(true);", source: shaderSource("Scripts/PauseMenuController.cs", 823) },
      references: [shaderSource("Scripts/PauseMenuController.cs", 263), shaderSource("Scripts/PauseMenuController.cs", 795), shaderSource("Scripts/PauseMenuController.cs", 1046)],
    },
  ],
  "ai-recruiting": [
    {
      id: "extension-boundaries",
      title: copy("MV3：页面解析和网络请求分开承担职责", "MV3: separate page parsing from network requests"),
      paragraphs: [
        copy("浏览器端基于 GoodHR 扩展框架做实际招聘流程适配。Content Script 接触招聘页面，各站点解析器负责选择器、候选人卡片和详情提取；background.js 作为 MV3 Service Worker 处理 AI 请求代理。业务层使用解析后的候选人资料与岗位配置，降低对具体 DOM 结构的耦合。", "The browser implementation adapts the GoodHR extension framework to the recruiting workflow. Content scripts access the page, site parsers handle selectors and profile extraction, and background.js is the MV3 service worker that proxies AI requests. Business logic consumes parsed profiles and job configuration."),
        copy("这条边界让页面适配、模型调用和展示逻辑可以分别排查：资料没有采到先检查站点解析器；网络失败检查代理返回；结果不易理解则检查归一化和卡片渲染。扩展与简历邮件工具是两套互补工具，当前内容不将它们描述为一个已经打通的后台服务。", "These boundaries give debugging separate entry points: missing profile data points to a parser, network failure to the proxy, and unclear decisions to normalization or rendering. The browser extension and mail filing program are complementary tools, not a single integrated backend."),
      ],
      flow: [copy("站点 DOM", "Site DOM"), copy("解析器 + 岗位", "Parser + role"), copy("后台 AI 请求", "Background AI request"), copy("结果回写卡片", "Card feedback")],
      references: [{ file: "GoodHR/manifest.json", line: 118, url: "/downloads/goodhr-share.zip" }, { file: "GoodHR/background.js", line: 36 }],
    },
    {
      id: "decision-contract",
      title: copy("两阶段筛选与统一的结果形状", "Two-stage screening and a consistent result shape"),
      paragraphs: [
        copy("初筛使用候选人概要和岗位要求，决定是否需要打开详情；通过后再补充完整经历进行二筛。页面流程区分打开详情失败、模型调用失败、筛选未通过以及后续操作失败，让“这次没成功”对应到具体阶段。筛选与沟通行为分别控制。", "Initial screening uses the profile summary and job requirements to decide whether to inspect details. A second stage evaluates fuller experience. The UI distinguishes detail-loading failure, model failure, rejection and downstream action failure. Screening and outreach are controlled separately."),
        copy("normalizeAIResult 将输出归一为 isok、msg、detail、matchedPoints 和 risks。不存在对象时返回失败结果，文字和数组分别归一，再由 buildDecisionLines 生成卡片上的短说明。这里的归一化解决 UI 消费形状的问题；isok 使用 !! 转换，因此还不能称为严格的模型响应 Schema 校验，字符串布尔值是需要进一步收紧的边界。", "normalizeAIResult produces isok, msg, detail, matchedPoints and risks. Missing objects become failure results; strings and arrays are normalized before buildDecisionLines creates short card annotations. This normalizes the UI contract, but !! coercion is not strict response-schema validation; string booleans remain an area to tighten."),
      ],
      code: { label: copy("结果归一化 / 分发包源码节选", "Result normalization / distribution excerpt"), value: "return {\n    isok: !!result.isok,\n    msg: String(result.msg || fallbackMessage).trim(),\n    detail: String(result.detail || '').trim(),\n    matchedPoints: Array.isArray(result.matchedPoints)\n        ? result.matchedPoints : [],\n    risks: Array.isArray(result.risks) ? result.risks : []\n};", source: { file: "GoodHR/content_scripts/index.js", line: 423, url: "/downloads/goodhr-share.zip" } },
      references: [{ file: "GoodHR/content_scripts/index.js", line: 413 }, { file: "GoodHR/content_scripts/index.js", line: 431 }],
    },
    {
      id: "deduplication",
      title: copy("岗位级去重：重复运行不等于重复处理", "Role-scoped deduplication across repeated runs"),
      paragraphs: [
        copy("同一候选人可能出现在不同岗位下，直接用姓名去重会混淆上下文。getCandidateDedupeKey 组合站点、当前岗位和稳定候选人标识；拿不到稳定标识时，才退回归一化后的资料文本组合。已有的平台沟通记录也单独检查。", "The same candidate may appear under multiple roles, so name-only deduplication conflates context. getCandidateDedupeKey combines the site, current role and stable candidate identifiers, falling back to normalized profile text when stable identifiers are unavailable. Platform contact history is checked separately."),
        copy("处理记录保存在 chrome.storage.local。pruneProcessedCandidateMap 按 30 天 TTL 过滤过期项，按时间倒序排序，最多保留 3000 条。它约束存储增长，也为重复执行提供已处理状态。文本降级键仍可能碰撞，清理记录或超出 TTL 后也可能再次处理，因此这是有限窗口内的去重机制。", "Records live in chrome.storage.local. pruneProcessedCandidateMap applies a 30-day TTL, sorts newest first and retains at most 3,000 entries. This bounds storage and supports repeated runs. Text fallback keys can collide, and cleared or expired records can be processed again, so deduplication has a finite window."),
      ],
      code: { label: copy("处理记录裁剪 / 分发包源码节选", "Pruning processed records / distribution excerpt"), value: "const entries = Object.entries(map || {})\n    .filter(([, value]) => value?.time && now - value.time <= ttlMs)\n    .sort((a, b) => (b[1]?.time || 0) - (a[1]?.time || 0))\n    .slice(0, PROCESSED_CANDIDATE_MAX_COUNT);\nreturn Object.fromEntries(entries);", source: { file: "GoodHR/content_scripts/index.js", line: 1025, url: "/downloads/goodhr-share.zip" } },
      references: [{ file: "GoodHR/content_scripts/index.js", line: 978 }, { file: "GoodHR/content_scripts/index.js", line: 1022 }],
    },
    {
      id: "mail-pipeline",
      title: copy("邮件归档：消息身份和附件身份分别去重", "Mail filing: distinguish message and attachment identity"),
      paragraphs: [
        copy("邮件工具按日期与已读范围通过 IMAP SSL 取件，再解析 MIME 附件并抽取 PDF / DOCX 文本。岗位识别优先关注明确的求职意向，再结合关键词与相似度回退，归档到日期与岗位目录并输出汇总。这把取件、解析、分类与文件落盘拆成可排查的阶段。", "The mail tool selects messages by date and read status using IMAP SSL, parses MIME attachments and extracts PDF / DOCX text. Classification prioritizes explicit application intent, with keyword and similarity fallbacks, then writes date/role folders and summaries."),
        copy("邮件 UID 记录已经处理的邮件，SHA256 识别附件内容，分别应对重复扫描和同一份附件被重复投递。二者不能相互替代：新邮件可能带着旧附件，旧邮件也有独立的处理状态。这里依据已核验的工具实现说明流程，公开下载只提供浏览器扩展，不包含公司邮件和简历数据。", "Mail UIDs track processed messages, while SHA256 identifies attachment contents. They address rescans and duplicate submissions separately: a new message can contain an old attachment. The public download contains the browser extension, not company mail or resume data."),
      ],
      points: [copy("输入范围显式化：当天、未读、补收和重扫分别选择。", "Make scope explicit: today, unread, catch-up and rescans are separate choices."), copy("分阶段记录结果：区分采集、解析、岗位分类和归档问题。", "Record stage outcomes separately: collection, parsing, classification and filing."), copy("下一步评估：用人工标注样本检查岗位分类，分别统计提取失败、分类错误与重复归档，定位改进环节。", "Next evaluation: check role classification against manually labeled samples and track extraction failures, misclassification and duplicate filing separately.")],
    },
  ],
};
