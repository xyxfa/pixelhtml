import { jevArticle } from "./jevArticle";
import type { IdeaLocale } from "./ideaData";
import { sproutArticle } from "./sproutArticle";
import { noitaArticle } from "./noitaArticle";

type Copy = Record<IdeaLocale, string>;
const copy = (zh: string, en: string): Copy => ({ zh, en });
type SourceReference = { file: string; line: number; url?: string };
const github = (
  repo: string,
  sha: string,
  file: string,
  line: number
): SourceReference => ({
  file,
  line,
  url: `https://github.com/${repo}/blob/${sha}/${file.split("/").map(encodeURIComponent).join("/")}#L${line}`,
});
const levelSource = (file: string, line: number) =>
  github(
    "xyxfa/Kingdom_Select",
    "4e405083ce946cd8027cbf8b7c0770d15be32f5a",
    `Assets/Scripts/${file}`,
    line
  );
const shaderSource = (file: string, line: number) =>
  github(
    "xyxfa/shader_ASE_test_and_Cool_UI",
    "8d6dcbf01ce6786737a11d37993a0009c3468eb5",
    `Assets/${file}`,
    line
  );

export interface IdeaArticleSection {
  id: string;
  title: Copy;
  paragraphs: Copy[];
  points?: Copy[];
  flow?: Copy[];
  code?: { label: Copy; value: string; source?: SourceReference };
  image?: { src: string; width: number; height: number; caption: Copy };
  diagram?: "components" | "bfs" | "wake";
  sources?: string[];
  links?: { label: Copy; url: string }[];
  references?: SourceReference[];
}

export const ideaArticles: Record<string, IdeaArticleSection[]> = {
  "jev-game-decisions": jevArticle,
  "noita-simulator": noitaArticle,
  "sprout-squad": sproutArticle,
  "echo-unity-ai": [
    {
      id: "boundaries",
      title: copy(
        "模型做分工，Unity 负责把事情做完",
        "Let models propose work and Unity execute it"
      ),
      paragraphs: [
        copy(
          "ECHO 可以和角色单聊、群聊，也可以让几个 Agent 一起解谜、执行远征任务。我关注的是对话之后那一步：模型说好谁去救援、谁去战斗，角色要能在场景里真正行动，而且遇到变化还能调整。",
          "ECHO supports character conversations, group chat, cooperative puzzles and expeditions. I focus on what comes after the conversation: once agents agree who rescues and who fights, the characters need to act and respond to changes in the scene."
        ),
        copy(
          "因此我把分工建议、任务调度和行为树分开。Python 侧等待模型评估和复核，Unity 侧检查任务能不能做、资源够不够，再交给本地行为树执行。模型还在思考时，移动和战斗可以继续；新方案回来后，也先经过当前场景的校验。",
          "I separate proposed assignments, task scheduling and behavior-tree execution. Python waits for model assessments and reviews; Unity checks availability and resources, then executes through local trees. Movement and combat continue while models think, and returned plans are checked against the current scene."
        ),
      ],
      flow: [
        copy("世界状态 / 候选任务", "World state / candidate tasks"),
        copy("Python 模型协商", "Python negotiation"),
        copy("Unity 校验与调度", "Unity validation & scheduling"),
        copy("行为树执行 / 回执", "Behavior trees / receipts"),
      ],
    },
    {
      id: "async",
      title: copy(
        "换了一局，上一局的回答怎么办",
        "Handling an answer that arrives after a restart"
      ),
      paragraphs: [
        copy(
          "模型请求要等待网络，也可能超时。客户端把提交和轮询放在异步流程里，让本地行为树继续运行。不过“没有卡住主线程”只解决了一半问题：请求发出以后，玩家可能已经重开、换关或接管角色。",
          "Model calls wait on the network and can time out. Asynchronous submission and polling let local behavior trees continue, but a player can restart, change levels or take control before a response arrives."
        ),
        copy(
          "取消时先递增 _generation，旧请求立刻失去执行资格。如果 POST 迟到，还带回了一个 job id，就补发 DELETE 回收远端任务。远征结果进入场景前还会核对 run_id、round、epoch 和 revision；暂停期间收到的结果，恢复时也重新检查。",
          "Cancellation increments _generation immediately. If a late POST returns a job ID, the client deletes that remote job. Expedition results also pass run_id, round, epoch and revision checks; results held during a pause are checked again on resume."
        ),
      ],
      code: {
        label: copy(
          "POST 返回时再次检查本地代际 / 代码节选",
          "Recheck generation after POST / local excerpt"
        ),
        value:
          'string id = (string)result?["id"];\nif (generation != _generation)\n{\n    if (id != null) StartCoroutine(Delete(id));\n    yield break;\n}',
        source: {
          file: "Assets/Scripts/EchoDialogue/EchoArenaAgents.cs",
          line: 49,
        },
      },

      references: [
        { file: "Assets/Scripts/EchoDialogue/EchoArenaAgents.cs", line: 31 },
        { file: "Assets/Scripts/EchoDialogue/EchoArenaAgents.cs", line: 55 },
        { file: "Assets/Scripts/EchoDialogue/EchoArenaAgents.cs", line: 78 },
      ],
    },
    {
      id: "job-lifecycle",
      title: copy(
        "重试一次，不该多开一组模型请求",
        "Retries should reuse the same job"
      ),
      paragraphs: [
        copy(
          "客户端没等到响应时，很难知道请求到底有没有创建成功。ArenaService 用 request_id 和内容指纹一起判断：两者都相同就返回已有作业；ID 相同但内容变了，返回 request_id_conflict。这样重试不会悄悄变成另一组模型调用。",
          "After a timeout, the client may not know whether a job was created. ArenaService compares request_id and a payload fingerprint. Matching both returns the existing job; changed content under the same ID returns request_id_conflict."
        ),
        copy(
          "本地服务同时最多跑两个作业，满了返回 agent_busy。完成记录最多保留 24 条，创建新任务时清理超过 900 秒的旧记录；单任务超时设为 240 秒。取消先更新公开状态，再取消异步任务，完成回调也要检查状态，避免取消后又写回成功。",
          "The local service runs at most two jobs and returns agent_busy when full. It retains up to 24 records, lazily removes completed records older than 900 seconds, and gives each job 240 seconds. Cancellation updates public state before cancelling the task, and completion checks that state before publishing success."
        ),
        copy(
          "这些记录目前在进程内存里，重启后会丢失。如果把后端扩成多个实例，request_id 索引和作业状态就需要移到共享存储。这是服务部署方式变化时需要一起改的部分。",
          "These records currently live in process memory. Multiple backend instances would need shared storage for request IDs and job state, and restarts would otherwise lose them."
        ),
      ],
      code: {
        label: copy(
          "请求身份与内容指纹 / 代码节选",
          "Request identity and payload fingerprint / local excerpt"
        ),
        value:
          "old = self.requests.get(data['request_id'])\nfingerprint = digest(data)\nif old:\n    if old[1] != fingerprint:\n        raise ValueError('request_id_conflict')\n    return self.read(old[0])",
        source: { file: "backend/src/echo/arena.py", line: 24 },
      },
      references: [
        { file: "backend/src/echo/arena.py", line: 22 },
        { file: "backend/src/echo/arena.py", line: 51 },
        { file: "backend/src/echo/arena.py", line: 61 },
      ],
    },
    {
      id: "negotiation",
      title: copy(
        "几个 Agent 有分歧时，怎么结束这一轮",
        "Bringing an agent discussion to a decision"
      ),
      paragraphs: [
        copy(
          "协商分成独立评估、队长分工、成员复核三步。成员先根据候选任务和共享情报给出判断，队长汇总成负责人队列，再让成员检查。出现否决时最多修订一次，给讨论留出空间，也给等待设一个上限。",
          "Members assess candidate tasks independently, a captain proposes assignee queues, and members review the proposal. Rejection permits one revision, allowing disagreement without an open-ended discussion."
        ),
        copy(
          "py_trees 的并行节点等待所有成员完成，并锁存已经成功的叶子，避免下次 tick 又发送相同请求。复核节点返回 True 只表示“看完了”，是否赞成另存一份。这样第一张否决票不会提前结束本轮，后到的意见也不会串进下一轮。",
          "The py_trees parallel node waits for every member and keeps completed leaves synchronized so later ticks do not resend requests. A review returning True means it finished; approval is stored separately. The first rejection therefore does not end the round before the remaining reviews arrive."
        ),
      ],
      flow: [
        copy("独立评估", "Independent assessment"),
        copy("队长分工", "Captain assignment"),
        copy("独立复核", "Independent review"),
        copy("采纳 / 一次修订", "Accept / one revision"),
      ],
      image: {
        src: "/ideas/echo/negotiation.webp",
        width: 1920,
        height: 1176,
        caption: copy(
          "协商与战斗同时显示，分别观察方案进度和实际执行。",
          "Negotiation and combat remain visible together, exposing plan progress and actual execution separately."
        ),
      },
      code: {
        label: copy(
          "复核完成与赞成票分别表达 / 代码节选",
          "Completion and approval are separate / local excerpt"
        ),
        value:
          "self.reviews[node.attempt].append(result['approve'])\nreturn True\n\n# resolve()\napproved = bool(self.reviews[int(node.npc)]) and all(self.reviews[int(node.npc)])",
        source: { file: "backend/src/echo/expedition_tree.py", line: 68 },
      },

      references: [
        { file: "backend/src/echo/expedition_tree.py", line: 16 },
        { file: "backend/src/echo/expedition_tree.py", line: 63 },
      ],
    },
    {
      id: "scheduling",
      title: copy(
        "分工不能每次讨论完就全部推倒重来",
        "Keep assignments stable while the plan changes"
      ),
      paragraphs: [
        copy(
          "模型给出的分工只是一项偏好。Unity 每半秒检查尚未承诺的任务，先排除依赖没完成、角色倒地、预算不足等情况，再根据职业、距离、风险、生命值和疲劳评分。代码里模型偏好加 32 分，职业适配加 30 分，其他代价继续参与比较。",
          "Model assignments contribute a preference. Every half second, Unity checks uncommitted tasks, filters out invalid prerequisites, incapacitated actors and insufficient resources, then scores role, distance, risk, health and fatigue. Model preference adds 32 points and role fit adds 30."
        ),
        copy(
          "已经在执行的长任务会保留承诺，每个角色最多接一个。否则新建议一来，角色就可能放下手里的事，反复在路上切换目标。倒地、失败或前置失效时才释放受影响的任务；失败次数还会增加疲劳，降低同一个角色再次接手的倾向。",
          "An actor keeps its committed long task instead of abandoning it on every new suggestion. Each actor holds at most one. Incapacitation, failure or invalid prerequisites release affected tasks, while repeated failure adds fatigue and makes reassignment to the same actor less attractive."
        ),
      ],
      code: {
        label: copy(
          "Score 的等价表达 / 变量名简化",
          "Equivalent Score expression / simplified variable names"
        ),
        value:
          "score = priority\n      + (modelPreferred ? 32 : 0)\n      + (roleMatched ? 30 : 0)\n      - distance * 0.055\n      - risk * (actor.Kind == 0 ? 3 : 12)\n      - (1 - hp / maxHp) * 24\n      - budget * 0.2\n      - fatigue;",
        source: {
          file: "Assets/Scripts/EchoDialogue/EchoExpeditionDirector.cs",
          line: 146,
        },
      },

      references: [
        {
          file: "Assets/Scripts/EchoDialogue/EchoExpeditionDirector.cs",
          line: 131,
        },
        {
          file: "Assets/Scripts/EchoDialogue/EchoExpeditionDirector.cs",
          line: 155,
        },
        {
          file: "Assets/Scripts/EchoDialogue/EchoExpeditionDirector.cs",
          line: 162,
        },
      ],
    },
    {
      id: "task-contract",
      title: copy(
        "先检查任务图，再接收模型分工",
        "Check the task graph before accepting assignments"
      ),
      paragraphs: [
        copy(
          "Unity 提供最多 16 个候选任务，包含 ID、依赖、预算和可执行成员。后端先校验字段、重复 ID 和成员范围，数值也必须是有限值，bool、NaN 和 Infinity 都会拒绝。任务成本要进入比较，类型检查不能留给后面的评分函数。",
          "Unity supplies up to 16 tasks with IDs, prerequisites, budgets and eligible actors. The backend validates fields, duplicate IDs, membership and finite numeric values, rejecting bool, NaN and Infinity before costs reach scoring."
        ),
        copy(
          "依赖检查逐轮移走前置已满足的任务。还有任务剩下，却一个都取不出来，就说明存在环或缺失引用。16 个节点时反复扫描很直观；规模更大可以改成入度队列。模型返回分工后，再检查真实任务、合法成员和重复分配，Unity 实际 Assign 时还要看一遍最新场景。",
          "Dependency checking repeatedly removes tasks whose prerequisites are resolved. If tasks remain but none can be removed, a cycle or missing reference exists. Repeated scans are simple at 16 nodes; larger graphs could use an indegree queue. Returned assignments are checked for valid tasks, eligible actors and duplicates, then rechecked against live state when Unity assigns them."
        ),
      ],
      code: {
        label: copy(
          "有界任务图的依赖检查 / 代码节选",
          "Dependency validation for a bounded task graph / local excerpt"
        ),
        value:
          "pending = set(graph)\nresolved = set()\nwhile pending:\n    ready = {ident for ident in pending\n             if set(graph[ident]['dependencies']) <= resolved}\n    if not ready:\n        raise ValueError('cyclic_or_missing_dependency')\n    resolved.update(ready)\n    pending -= ready",
        source: { file: "backend/src/echo/expedition_contract.py", line: 38 },
      },
      references: [
        { file: "backend/src/echo/expedition_contract.py", line: 8 },
        { file: "backend/src/echo/expedition_contract.py", line: 60 },
      ],
    },
    {
      id: "resources",
      title: copy(
        "救援和技能，不能花同一份能量",
        "Rescues and skills share one energy budget"
      ),
      paragraphs: [
        copy(
          "假设救援和技能都要消耗能量，分别看一次余额是不够的：两个系统可能同时觉得“还够用”。我用一份预约账本扣住已承诺的预算，可用能量等于当前余额减去预约额。任务先预约再成立，技能只能使用剩下的部分。",
          "If rescues and skills both spend energy, separate balance checks can let both assume enough is available. A reservation ledger holds committed budgets. Available energy is the balance minus reservations; tasks reserve before committing and skills use the remainder."
        ),
        copy(
          "同一任务重复预约相同额度直接返回成功，不再多扣一份。真正执行时 Commit 扣余额并移除预约；取消或失败走 Release。账本在 Unity 单线程里维护，解决的是两个业务流程对同一资源的重复承诺。",
          "Repeating a reservation with the same task key and amount succeeds without another hold. Commit spends the balance and removes the reservation; cancellation or failure releases it. The ledger lives on Unity’s single thread and coordinates commitments from different systems."
        ),
      ],
      code: {
        label: copy(
          "同一任务重复预约不重复占用 / 代码节选",
          "Idempotent task reservation / local excerpt"
        ),
        value:
          "public bool Reserve(string key, float amount)\n{\n    if (_held.ContainsKey(key))\n        return Mathf.Approximately(_held[key], amount);\n    if (amount < 0 || Available + .001f < amount)\n        return false;\n    _held.Add(key, amount);\n    return true;\n}",
        source: {
          file: "Assets/Scripts/EchoDialogue/EchoExpeditionTasks.cs",
          line: 36,
        },
      },

      references: [
        {
          file: "Assets/Scripts/EchoDialogue/EchoExpeditionTasks.cs",
          line: 43,
        },
        {
          file: "Assets/Scripts/EchoDialogue/EchoExpeditionTasks.cs",
          line: 50,
        },
      ],
    },
    {
      id: "behavior-tree",
      title: copy(
        "走到一半遇到危险，行为树要能接得住",
        "Interrupting a task without losing track of it"
      ),
      paragraphs: [
        copy(
          "接近目标、开始任务、持续执行需要记住进度，所以任务分支用 MemorySequence。危险检测又要随时插进来，所以外层 Selector 会重新检查高优先级条件。感知持续更新，行动保留阶段，两者配合才能让角色边做事边应对变化。",
          "Approach, start and perform need retained progress, so task branches use MemorySequence. The outer reactive Selector keeps checking higher-priority conditions, while perception continues to update alongside the staged action."
        ),
        copy(
          "切走之前还要收拾旧任务。OnAbort 释放任务和预约，并核对当前任务类型，避免旧分支中断刚接到的新任务。接近阶段最多重试三次，整段任务有 36 秒超时。面板把节点状态和访问次数显示出来，角色不动时就能看出是在等条件、跑叶子，还是根本没进入分支。",
          "OnAbort cleans up the task and reservation, checking task type so an old branch cannot interrupt a newly assigned task. Approach allows three retries and the full task has a 36-second timeout. Node states and visit counts help distinguish waiting conditions, running leaves and unvisited branches."
        ),
      ],
      image: {
        src: "/ideas/echo/behavior-tree.webp",
        width: 1920,
        height: 1176,
        caption: copy(
          "运行中的完整行为树；面板状态来自实际执行。",
          "The full behavior tree at runtime, with state from execution."
        ),
      },

      references: [
        {
          file: "Assets/Scripts/EchoDialogue/EchoExpeditionBrain.cs",
          line: 51,
        },
        {
          file: "Assets/Scripts/EchoDialogue/EchoExpeditionBrain.cs",
          line: 60,
        },
        {
          file: "Assets/Scripts/EchoDialogue/EchoExpeditionBrain.cs",
          line: 67,
        },
      ],
    },
    {
      id: "memory-puzzle",
      title: copy(
        "角色记住了什么，要能回头查",
        "Keeping character memory inspectable"
      ),
      paragraphs: [
        copy(
          "对话变长以后，我把近期原话和长期记忆分开处理。近期上下文取最新用户发言之前的两轮、最多 24 条可见消息。模型只返回要保留的整数索引，程序校验范围、去重，再把原文放进去。选择失败就回退到这批有界候选，避免筛选阶段改写事实。",
          "I handle recent dialogue and long-term memory separately. Recent context uses up to 24 visible messages from the preceding two turns. The model returns integer indices; code validates and deduplicates them, then restores the original text. Selection failure falls back to the bounded candidate set."
        ),
        copy(
          "长期来源存在 SQLite，LanceDB 和 BGE 负责检索，之后按话题文字重合或相似度 0.75 再过滤。每条记忆保留 node_id，也记录入选或被过滤的原因。调试时可以顺着来源查回原消息，区分“没召回”和“召回后没放进上下文”。",
          "SQLite stores long-term sources, with LanceDB and BGE handling retrieval. Text overlap or a 0.75 similarity threshold filters the candidates. Each memory keeps its node_id and selection reason, making it possible to trace an answer’s context back to original messages."
        ),
        copy(
          "记忆范围由角色 ID 和排序后的群成员集合确定，私聊与不同群组分别保存。自动群聊仍用最新用户原话作为检索主题，避免角色们接着彼此的回复越聊越偏。忘记某条记忆时排除对应来源，聊天历史本身仍然保留。",
          "Memory scope combines character identity with the sorted group membership. Automatic group chat keeps retrieval anchored to the latest user message. Forgetting excludes a source within that scope while leaving visible chat history intact."
        ),
      ],
      image: {
        src: "/ideas/echo/memory.webp",
        width: 1920,
        height: 1080,
        caption: copy(
          "检索过程与角色对话并排呈现，检查进入上下文的记忆来源。",
          "Retrieval and character dialogue are shown together to inspect the sources entering context."
        ),
      },
      code: {
        label: copy(
          "长期来源保留稳定 ID / 代码节选",
          "Preserve stable source IDs / local excerpt"
        ),
        value:
          "return [(nid, item) for nid, item in entries\n        if cls.relevant(item['value'], query, False)\n        or similarities.get(nid, 0) >= .75]",
        source: { file: "backend/src/echo/conversation.py", line: 37 },
      },
      references: [
        { file: "backend/src/echo/conversation.py", line: 41 },
        { file: "backend/src/echo/conversation.py", line: 48 },
        { file: "backend/src/echo/memory.py", line: 75 },
        { file: "backend/src/echo/state.py", line: 28 },
      ],
    },
    {
      id: "puzzle-tool",
      title: copy(
        "熄灯游戏，交给位运算来算",
        "Solving Lights Out with bit operations"
      ),
      paragraphs: [
        copy(
          "5×5 熄灯游戏里，点一下翻转一组格子，点两下又回到原状，因此可以写成 GF(2) 上的 Ax = b。A 的一列表示一次点击影响哪些格子，b 是当前棋盘，x 就是要点的位置。加法对应 XOR，正好适合用位运算处理。",
          "In 5×5 Lights Out, each click toggles cells and two clicks cancel. This gives Ax = b over GF(2): a column of A describes one click, b is the board and x identifies the clicks. Addition becomes XOR."
        ),
        copy(
          "Solve 用 25 个 uint 存增广矩阵，低 25 位放系数，第 25 位放右端项。选主元、交换行、异或消元，遇到矛盾行返回空结果。自由变量取零，得到一个可行解。模型可以选择和解释候选动作，Unity 执行前再核对棋盘 revision，重开后的旧答案就不会继续点下去。",
          "Solve stores the augmented matrix in 25 uints, with coefficients in the lower 25 bits and the right-hand side in bit 25. Pivoting, row swaps and XOR elimination produce a feasible solution with free variables set to zero. Models can select and explain candidate moves; Unity checks the board revision before applying them."
        ),
      ],
      code: {
        label: copy(
          "位运算消元 / 代码节选",
          "Bitwise elimination / local excerpt"
        ),
        value:
          "uint temp = rows[rank];\nrows[rank] = rows[found];\nrows[found] = temp;\nfor (int row = 0; row < 25; row++)\n    if (row != rank && (rows[row] & (1u << column)) != 0)\n        rows[row] ^= rows[rank];\npivots.Add(column);\nrank++;",
        source: {
          file: "Assets/Scripts/EchoDialogue/EchoArcadeModel.cs",
          line: 190,
        },
      },
      references: [
        { file: "Assets/Scripts/EchoDialogue/EchoArcadeModel.cs", line: 175 },
        { file: "Assets/Scripts/EchoDialogue/EchoArcadeModel.cs", line: 194 },
      ],
    },
    {
      id: "takeaways",
      title: copy(
        "把“角色为什么没动”变成能查的问题",
        "Making an idle character easier to debug"
      ),
      paragraphs: [
        copy(
          "ECHO 需要同时处理两种节奏：模型按请求返回，游戏按帧更新。我的做法是让任务承诺、版本检查和行为树连接这两边。角色没有按预期行动时，可以依次检查模型是否返回、结果是否过期、任务有没有分配、资源是否预约、行为树走到了哪里。",
          "ECHO has two clocks: model requests complete when they can, while the game updates every frame. Task commitments, version checks and behavior trees connect them. When an actor does not behave as expected, I can check the response, its validity, assignment, reservation and execution stage in order."
        ),
        copy(
          "视频收录了单聊、群聊、协作解谜和远征运行片段。文中的文件位置对应本地 ECHO 版本。后续我想继续补的是异常场景的重复验证，尤其是换关后迟到的结果、任务取消和资源回收——这些平时不显眼，却直接影响角色能不能可靠地继续做事。",
          "The video includes conversations, puzzles and expedition runs; source paths refer to the local ECHO version. Further validation should repeatedly exercise late responses after level changes, cancellation and resource cleanup, because these determine whether actors can reliably continue."
        ),
      ],
    },
  ],
  "level-select": [
    {
      id: "interaction-goal",
      title: copy("让关卡围着一个球面排开", "Arranging levels around a sphere"),
      paragraphs: [
        copy(
          "这个选关界面把每个关卡做成一座小浮岛。位置不用手调一组世界坐标，而是放进 Kingdom 配置里的 x、y 两个角度：x 控制水平方向，y 控制俯仰。生成地标、球面标记和按钮时共用这份配置，按钮索引再对应预览图。",
          "Each level is a miniature floating island. Rather than hand-placing world coordinates, Kingdom stores horizontal and vertical angles. Landmarks, markers and buttons share that configuration, and button indices map to preview images."
        ),
        copy(
          "相机挂在两层 Transform 下，cameraParent 管 X 轴，cameraPivot 管 Y 轴。点击关卡后分别做 DOLocalRotate，共用持续时间和缓动曲线，再把跟随目标指向关卡的 visualPoint。把两个轴拆开，调整岛屿位置和镜头转动手感都比较直接。",
          "The camera uses two parent transforms: cameraParent handles pitch and cameraPivot handles heading. Selecting a level rotates both with shared timing and easing and updates the follow target to its visualPoint. Each axis can then be tuned independently."
        ),
      ],
      code: {
        label: copy("双层相机旋转 / 代码节选", "Two-level rotation / excerpt"),
        value:
          "cameraParent.DOLocalRotate(\n    new Vector3(k.y, 0, 0), lookDuration, RotateMode.Fast\n).SetEase(lookEase);\ncameraPivot.DOLocalRotate(\n    new Vector3(0, -k.x, 0), lookDuration, RotateMode.Fast\n).SetEase(lookEase);",
        source: levelSource("KingdomSelect.cs", 84),
      },
      references: [
        levelSource("KingdomSelect.cs", 49),
        levelSource("KingdomSelect.cs", 84),
      ],
    },
    {
      id: "bezier-path",
      title: copy(
        "用一条贝塞尔曲线连起两座岛",
        "Connecting islands with a Bezier curve"
      ),
      paragraphs: [
        copy(
          "路径用二次贝塞尔。两端 P0、P2 取自相邻关卡标记，中间的 P1 根据两端朝向和距离构造，distanceAmount 决定拱起多少。这个参数主要调视觉上的弧度，让路线从球面上抬起来。",
          "The path is a quadratic Bezier curve. P0 and P2 come from neighboring level markers; the middle point uses their orientations and distance. distanceAmount controls how far the curve arches above the sphere."
        ),
        copy(
          "曲线采样后一次性传给 LineRenderer.SetPositions。当前用了 50 个点，t = i / numPoints，最后一个点其实只到 0.98，离精确终点还差一点。这是这版实现里可以继续修的地方；跨越 ±180° 时的角度平均，也需要单独处理。",
          "The sampled curve is submitted in one LineRenderer.SetPositions call. The current 50-point loop uses t = i / numPoints, so the last sample reaches 0.98 rather than the endpoint. Endpoint coverage and angle averaging across ±180° are two details still worth improving."
        ),
      ],
      code: {
        label: copy(
          "二次贝塞尔计算 / 代码节选",
          "Quadratic Bezier evaluation / excerpt"
        ),
        value:
          "float u = 1 - t;\nfloat tt = t * t;\nfloat uu = u * u;\nVector3 p = uu * p0;\np += 2 * u * t * p1;\np += tt * p2;\nreturn p;",
        source: levelSource("Bezier.cs", 75),
      },
      references: [levelSource("Bezier.cs", 36), levelSource("Bezier.cs", 64)],
    },
    {
      id: "state-feedback",
      title: copy(
        "镜头转过去，按钮和图片也要跟上",
        "Keeping the button, camera and preview in sync"
      ),
      paragraphs: [
        copy(
          "KingdomButton 接收 EventSystem 的选择、取消选择、提交和指针事件。选中时更新文字、底板、圆点颜色并做缩放反馈，同时切换预览图；点击事件再通知 LookAtKingdom 转动相机。悬停前先检查当前选中对象，避免鼠标移入时盖掉选择态的颜色。",
          "KingdomButton handles EventSystem selection, deselection, submit and pointer events. Selection updates colors, scale feedback and the preview; clicking rotates the camera through LookAtKingdom. Hover checks the current selection so it does not overwrite selected colors."
        ),
        copy(
          "图片过渡分两段：先 DOFade 到不可见，在回调里换 Sprite，再淡入。总共 0.3 秒，前后各一半。替换发生在透明时，就不会看到两张图片突然切换的那一下。",
          "Preview transitions fade out, replace the Sprite in the completion callback, then fade in. Each half takes 0.15 seconds, hiding the image replacement at zero opacity."
        ),
      ],
      flow: [
        copy("Button / EventSystem", "Button / EventSystem"),
        copy("kingdomIndex", "kingdomIndex"),
        copy("Sprite + 相机目标", "Sprite + camera target"),
        copy("DOTween 过渡", "DOTween transition"),
      ],
      code: {
        label: copy(
          "先淡出再替换图片 / 代码节选",
          "Fade before replacing the image / excerpt"
        ),
        value:
          "sharedPanelImage.DOFade(0, fadeDuration / 2)\n    .OnComplete(() => {\n        sharedPanelImage.sprite = newSprite;\n        sharedPanelImage.DOFade(1, fadeDuration / 2);\n    });",
        source: levelSource("KingdomButton.cs", 79),
      },
      references: [
        levelSource("KingdomButton.cs", 51),
        levelSource("KingdomSelectImages.cs", 20),
      ],
    },
    {
      id: "interaction-review",
      title: copy(
        "连续快速切换，还有哪些地方要补",
        "What rapid switching still needs"
      ),
      paragraphs: [
        copy(
          "这版把关卡配置、相机旋转、路径和按钮反馈接在了一起。继续打磨时，我会先缓存 LookAtKingdom 的对象引用，再把五个独立 Sprite 字段整理成列表，增加关卡时就不用继续加字段。",
          "This version connects level configuration, camera rotation, paths and button feedback. Next I would cache LookAtKingdom references and replace the five separate Sprite fields with a list so adding levels does not require adding more fields."
        ),
        copy(
          "快速点击也值得专门处理。项目里 PanelManager 有 isSwitching 保护，但 KingdomButton 走的是另一套图片切换方法。两条路径需要统一，再决定新输入是打断当前过渡，还是等过渡结束。最终要保证镜头停在哪里，选中态和预览图就对应哪里。",
          "Rapid clicking needs a clear policy. PanelManager has an isSwitching guard, but KingdomButton uses a separate image transition method. Those paths should be unified before choosing whether new input interrupts or waits. Camera, selection and preview should finish on the same level."
        ),
      ],
      references: [
        levelSource("PanelManager.cs", 42),
        levelSource("KingdomButton.cs", 71),
      ],
    },
  ],
  "ase-shader": [
    {
      id: "dissolve-math",
      title: copy(
        "溶解的形状和边缘，分别怎么算",
        "Building a dissolve mask and its glowing edge"
      ),
      paragraphs: [
        copy(
          "这是大三上期末做的一组 Shader 和 UI 练习，视频里有手电筒显隐、溶解、刀光和水渍等效果。这里选几段代码展开。rongjie.shader 是 ASE 生成的，沿着 surf 函数看，可以把复杂节点图还原成几个比较清楚的运算。",
          "These shader and UI studies were made at the end of my third-year first semester. The video includes flashlight reveals, dissolves, slashes and wet surfaces. Looking through the ASE-generated rongjie.shader surf function helps break the node graph into a few understandable operations."
        ),
        copy(
          "溶解场先用 UV.y 的幂函数减去滚动噪声，再用 smoothstep 得到阈值附近的过渡。_Float1 调噪声强度，_Float3 调边缘宽度；开启自动推进时，阈值取 frac(_Time.y * 0.35)。最后把遮罩乘到原图 Alpha 上，决定哪里留下、哪里消失。",
          "The dissolve field subtracts scrolling noise from a power of UV.y. smoothstep softens the threshold, _Float1 controls noise strength and _Float3 controls the edge width. Automatic progression uses frac(_Time.y * 0.35). The mask multiplies the texture alpha."
        ),
        copy(
          "发光另算一条窄带，乘颜色和 _Float6 后写入 Emission，所以调亮边缘不会顺带改变溶解面积。主表面用 alpha:fade，阴影 Pass 另做抖动采样和 clip，检查效果时需要两边一起看。",
          "A separate narrow band feeds Emission through color and _Float6, so brightness can change independently of coverage. The main surface uses alpha:fade, while the shadow pass uses dithering and clip; both need checking."
        ),
      ],
      code: {
        label: copy(
          "溶解与边缘 / 按源码重命名的等价表达",
          "Dissolve and edge / equivalent expression with renamed variables"
        ),
        value:
          "field = pow(uv.y, 2.043477) - noise * noiseStrength;\nmask = smoothstep(threshold, threshold + width, field);\nedge = saturate(1 - abs(mask - edgeCenter) / 0.1634783);\nalpha = textureAlpha * mask;\nemission = edgeColor * intensity * edge;",
        source: shaderSource("ase test 2/rongjie.shader", 48),
      },
      references: [
        shaderSource("ase test 2/rongjie.shader", 42),
        shaderSource("ase test 2/rongjie.shader", 126),
      ],
    },
    {
      id: "uv-distortion",
      title: copy(
        "让纹理动起来，动的是采样坐标",
        "Moving the sampling coordinates"
      ),
      paragraphs: [
        copy(
          "ase_next.shader 里有两路随 _Time.y 移动的 UV。一路沿 _Vector0 移动，另一路沿 _Vector1 移动并采样噪声。噪声的红通道复制成 float2，和第一路 UV 混合后，再拿去采样效果贴图。纹理本身没有换，流动来自每帧读的位置不同。",
          "ase_next.shader has two UV streams driven by _Time.y. One moves along _Vector0; the other moves along _Vector1 and samples noise. Its red channel is duplicated into float2 and blended with the first UV before sampling the effect texture."
        ),
        copy(
          "这里用的是 lerp(baseUV, noiseRR, strength)。强度增大时，坐标会逐渐靠近噪声值，和直接加一个偏移量的效果不同。调参数前先看清这个运算，再结合基础贴图 Alpha、顶点色和 _Color0 看最终叠加，会比只凭感觉试数值更容易定位。",
          "The blend is lerp(baseUV, noiseRR, strength), so increasing strength pulls coordinates toward the noise values. That behaves differently from adding an offset. Base alpha, vertex color and _Color0 then modulate the final effect."
        ),
      ],
      code: {
        label: copy(
          "噪声坐标混合 / 代码节选",
          "Noise-coordinate blend / excerpt"
        ),
        value:
          "float2 temp_cast_0 =\n    (tex2D(_TextureSample0, panner5).r).xx;\nfloat2 lerpResult9 = lerp(panner3, temp_cast_0, _Float0);",
        source: shaderSource("First/ase_next.shader", 143),
      },
      references: [shaderSource("First/ase_next.shader", 137)],
    },
    {
      id: "material-scope",
      title: copy("只改这个物体的纹理", "Changing a texture on one object"),
      paragraphs: [
        copy(
          "SetBackgroundTexture 可以接普通 Texture，也可以接 RenderTexture。属性名先转成 ID，MaterialPropertyBlock 创建一次后复用。写入前先 GetPropertyBlock，把已有参数取回来，再覆盖目标纹理，避免顺手清掉对象上的其他设置。",
          "SetBackgroundTexture accepts a Texture or RenderTexture. It caches the property ID and reuses a MaterialPropertyBlock. GetPropertyBlock preserves the object’s existing properties before the texture is overridden."
        ),
        copy(
          "这样纹理绑定只作用于指定 Renderer，不需要为一个参数复制整份材质。性能上还要看所用管线和 SRP Batcher 的配合。另外，如果只是同一张 RenderTexture 的内容在更新，引用没变，也可以减少重复绑定。",
          "The binding applies to the selected Renderer without duplicating its material. Performance still depends on the render pipeline and SRP Batcher behavior. If a RenderTexture’s contents change but its reference does not, repeated binding may also be unnecessary."
        ),
      ],
      code: {
        label: copy(
          "保留已有属性再覆盖纹理 / 代码节选",
          "Preserve existing properties before overriding / excerpt"
        ),
        value:
          "meshRenderer.GetPropertyBlock(materialPropertyBlock);\nmaterialPropertyBlock.SetTexture(texturePropertyId, backgroundTexture);\nmeshRenderer.SetPropertyBlock(materialPropertyBlock);",
        source: shaderSource("water shader/SetBackgroundTexture.cs", 70),
      },
      references: [
        shaderSource("water shader/SetBackgroundTexture.cs", 23),
        shaderSource("water shader/SetBackgroundTexture.cs", 55),
      ],
    },
    {
      id: "stencil-lighting",
      title: copy(
        "先决定像素能不能画，再算颜色",
        "Stencil first, shading second"
      ),
      paragraphs: [
        copy(
          "ShowRoom_Stencil.shader 的模板配置是 Ref 1、Comp NotEqual、Pass Replace。当前模板值不等于 1 才通过，通过后写入 1。调这个效果时要同时看谁先写过模板、物体按什么顺序画，否则单改比较方式很容易得到意外结果。",
          "ShowRoom_Stencil.shader uses Ref 1, Comp NotEqual and Pass Replace: fragments pass when the stored value differs from one, then write one. Previous stencil writes and draw order are essential to understanding the result."
        ),
        copy(
          "通过测试的片元再走光照：位置和法线转到世界空间，采样贴图和可选遮罩，用法线与主光方向的点积算直接光，乘阴影衰减，再叠加 ThreeColorAmbient。这样排查时可以先分清，是模板挡住了像素，还是光照把它算暗了。",
          "Shading then transforms position and normal to world space, samples textures, computes direct light from the normal-light dot product, applies shadow attenuation and adds ThreeColorAmbient. This helps distinguish a stencil rejection from a lighting issue."
        ),
      ],
      code: {
        label: copy("模板测试 / 代码节选", "Stencil test / excerpt"),
        value: "Stencil\n{\n    Ref 1\n    Comp NotEqual\n    Pass Replace\n}",
        source: shaderSource("library/Shader/ShowRoom_Stencil.shader", 25),
      },
      references: [
        shaderSource("library/Shader/ShowRoom_Stencil.shader", 75),
        shaderSource("library/Shader/ShowRoom_Stencil.shader", 87),
      ],
    },
    {
      id: "ui-clock",
      title: copy(
        "游戏暂停了，菜单不能也停住",
        "Keeping the pause menu animated"
      ),
      paragraphs: [
        copy(
          "暂停菜单出现时会保存原来的 timeScale，再置零。UI 如果仍用缩放时间，入场动画就会跟着停住。所以 DOTween 动画用 SetUpdate(true)，协程用 Time.unscaledDeltaTime，关闭菜单后再恢复之前的时间倍率。",
          "The pause menu saves timeScale and sets it to zero. Its animations use DOTween SetUpdate(true) or Time.unscaledDeltaTime so the transition can continue. Closing the menu restores the previous scale."
        ),
        copy(
          "显隐还要和输入一起处理。CanvasGroup 的 interactable 和 blocksRaycasts 决定什么时候能点、什么时候挡住底下的游戏。新过渡开始前 Kill 旧动画，避免快速开关后出现看不见的面板还在拦点击。",
          "CanvasGroup interactable and blocksRaycasts follow visibility so an invisible menu does not intercept gameplay. New transitions kill previous tweens, keeping rapid opening and closing from leaving stale interaction state."
        ),
      ],
      code: {
        label: copy(
          "暂停期间使用独立更新 / 代码节选",
          "Independent updates during pause / excerpt"
        ),
        value:
          "overlay.DOFade(overlayTargetColor.a, showDur)\n    .SetEase(moveEase)\n    .SetUpdate(true);",
        source: shaderSource("Scripts/PauseMenuController.cs", 823),
      },
      references: [
        shaderSource("Scripts/PauseMenuController.cs", 263),
        shaderSource("Scripts/PauseMenuController.cs", 795),
        shaderSource("Scripts/PauseMenuController.cs", 1046),
      ],
    },
  ],
  "ai-recruiting": [
    {
      id: "extension-boundaries",
      title: copy(
        "从招聘页面里拿到可用资料",
        "Getting usable data out of recruiting pages"
      ),
      paragraphs: [
        copy(
          "招聘里有不少重复步骤：打开候选人、对照岗位、查看经历，再收集简历。我在 GoodHR 扩展框架上做流程适配，另做了一个邮件归档工具，两套工具已经用于任职公司的招聘流程。这里先说浏览器部分。",
          "Recruiting involves repeated profile visits, requirement checks and resume collection. I adapted the GoodHR extension and built a separate mail-filing tool for my employer’s workflow. The browser tool starts with page extraction."
        ),
        copy(
          "Content Script 负责读页面，各站点解析器把 DOM 整理成候选人资料，MV3 Service Worker 代理 AI 请求，结果再回写卡片。网站改版时主要查解析器；资料正常但请求失败，就看 background.js 的返回。把这几层分开，问题比较容易找。",
          "Content scripts read the page, site parsers produce candidate data, the MV3 service worker proxies model requests, and results appear on cards. Site changes point me toward parsers; network failures point toward background.js."
        ),
      ],
      flow: [
        copy("站点 DOM", "Site DOM"),
        copy("解析器 + 岗位", "Parser + role"),
        copy("后台 AI 请求", "Background AI request"),
        copy("结果回写卡片", "Card feedback"),
      ],
      references: [
        {
          file: "GoodHR/manifest.json",
          line: 118,
          url: "/downloads/goodhr-share.zip",
        },
        { file: "GoodHR/background.js", line: 36 },
      ],
    },
    {
      id: "decision-contract",
      title: copy(
        "先看概要，再补完整经历",
        "Screen summaries before opening full profiles"
      ),
      paragraphs: [
        copy(
          "初筛把候选人概要和岗位要求一起交给模型，值得继续看时再打开详情，补充完整经历做二筛。打开详情失败、接口失败和筛选未通过分别记录，方便知道流程停在哪一步。筛选和后续沟通也可以分别开启。",
          "Initial screening combines a profile summary and job requirements. Profiles worth inspecting are opened for a second review with fuller experience. Detail loading, API failure and screening outcomes have separate states, and outreach is controlled independently."
        ),
        copy(
          "模型输出经过 normalizeAIResult 整理成 isok、msg、detail、matchedPoints 和 risks，卡片只消费这一种结构。缺少数组就补空数组，文字统一处理。当前 isok 仍用 !! 转换，字符串布尔值还需要收紧；继续迭代时，我会把这部分改成明确的类型校验。",
          "normalizeAIResult provides one shape for cards: isok, msg, detail, matchedPoints and risks. Missing arrays become empty arrays and text is normalized. The current !! conversion for isok should be tightened with explicit type validation, particularly for string booleans."
        ),
      ],
      code: {
        label: copy(
          "结果归一化 / 代码节选",
          "Result normalization / distribution excerpt"
        ),
        value:
          "return {\n    isok: !!result.isok,\n    msg: String(result.msg || fallbackMessage).trim(),\n    detail: String(result.detail || '').trim(),\n    matchedPoints: Array.isArray(result.matchedPoints)\n        ? result.matchedPoints : [],\n    risks: Array.isArray(result.risks) ? result.risks : []\n};",
        source: {
          file: "GoodHR/content_scripts/index.js",
          line: 423,
          url: "/downloads/goodhr-share.zip",
        },
      },
      references: [
        { file: "GoodHR/content_scripts/index.js", line: 413 },
        { file: "GoodHR/content_scripts/index.js", line: 431 },
      ],
    },
    {
      id: "deduplication",
      title: copy(
        "同一个人，换了岗位还要重新判断",
        "Deduplicate within the role, not just by name"
      ),
      paragraphs: [
        copy(
          "候选人是否合适取决于岗位，所以去重键不能只有姓名。getCandidateDedupeKey 组合站点、当前岗位和稳定候选人标识，拿不到标识时才用归一化资料文本回退。平台上已有的沟通记录也会单独检查。",
          "Suitability depends on the role, so the deduplication key combines site, role and stable candidate identity. Normalized profile text is a fallback when an ID is unavailable. Existing platform contact history is checked separately."
        ),
        copy(
          "记录放在 chrome.storage.local，保留 30 天，按时间排序后最多留下 3000 条。这样重复运行可以跳过近期处理过的条目，存储也不会一直长大。文本回退键可能碰撞，过期记录会重新处理，这两个条件都要和使用预期对上。",
          "Records live in chrome.storage.local for 30 days, with the newest 3,000 retained. Repeated runs can skip recent work without unbounded storage growth. Text fallback collisions and reprocessing after expiry remain part of how the tool behaves."
        ),
      ],
      code: {
        label: copy(
          "处理记录裁剪 / 代码节选",
          "Pruning processed records / distribution excerpt"
        ),
        value:
          "const entries = Object.entries(map || {})\n    .filter(([, value]) => value?.time && now - value.time <= ttlMs)\n    .sort((a, b) => (b[1]?.time || 0) - (a[1]?.time || 0))\n    .slice(0, PROCESSED_CANDIDATE_MAX_COUNT);\nreturn Object.fromEntries(entries);",
        source: {
          file: "GoodHR/content_scripts/index.js",
          line: 1025,
          url: "/downloads/goodhr-share.zip",
        },
      },
      references: [
        { file: "GoodHR/content_scripts/index.js", line: 978 },
        { file: "GoodHR/content_scripts/index.js", line: 1022 },
      ],
    },
    {
      id: "mail-pipeline",
      title: copy(
        "邮件和附件，要分两层去重",
        "Track the message and the attachment separately"
      ),
      paragraphs: [
        copy(
          "邮件工具通过 IMAP SSL 按日期和已读范围取件，解析 MIME 附件，再提取 PDF / DOCX 正文。岗位分类先看明确的求职意向，找不到时再用关键词和相似度补充，最后写入日期与岗位目录并生成摘要。正文提取失败时还能参考邮件主题和文件名。",
          "The mail tool fetches messages by date and read status over IMAP SSL, parses MIME attachments and extracts PDF or DOCX text. Classification prioritizes explicit application intent, with keywords and similarity as fallbacks, then files by date and role. Subject and filename provide fallback context when extraction fails."
        ),
        copy(
          "UID 用来判断邮件有没有处理过，SHA256 用来判断附件内容有没有收过。新邮件也可能附着一份旧简历，分开记录才能同时应对重扫和重复投递。页面下方提供的是浏览器扩展分享版；邮件归档工具独立运行。",
          "UID tracks whether a message has been processed, while SHA256 identifies an attachment already received. A new message can carry an old resume, so both are needed for rescans and repeat submissions. The browser extension is available below; the mail tool runs separately."
        ),
      ],
    },
  ],
};
