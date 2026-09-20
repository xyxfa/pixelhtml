import type { IdeaArticleSection } from "./ideaArticles";

export const jevArticle: IdeaArticleSection[] = [
  {
    "id": "why-speed",
    "title": {
      "zh": "为什么是 Jev？首先，因为它快",
      "en": "Why Jev? Speed comes first"
    },
    "paragraphs": [
      {
        "zh": "我选择 Jev 的核心原因是速度。游戏里的局面不会停下来等模型写完一段回答：敌人在靠近、资源在变化、刚才安全的位置可能已经失守。反馈慢，模型就容易对过时的局面做决定；反馈足够快，决策才有机会成为玩法的一部分。",
        "en": "Speed is my main reason for choosing Jev. Enemies move, resources change and safe positions disappear while a request is in flight. Lower latency gives decisions a better chance of staying relevant to play."
      },
      {
        "zh": "TypeSafe 在 2026 年 9 月 15 日的发布文章中报告，Jev 的端到端响应时间为 70–500 ms，并在特定 System One 查询中报告 40–200 倍的速度优势。这些是厂商测试结果，测试通常从美国西海岸发起，并非本项目的实测延迟，也不能推广到所有模型和任务。",
        "en": "TypeSafe’s September 15, 2026 announcement reports 70–500 ms end-to-end responses and 40–200× speedups on specified System One queries. These are vendor results, typically measured from the US West Coast, not measurements of this game or universal comparisons."
      },
      {
        "zh": "速度的意义不是把云端模型塞进每一帧。移动、碰撞和攻击仍交给本地程序；模型在关键事件或合适的间隔重新判断策略。实际体验还取决于网络、输入长度、请求排队，以及一次行动需要串行调用几次。",
        "en": "Cloud inference does not belong in every frame. Local code still handles movement, collisions and attacks; the model reassesses at meaningful events or intervals. Network conditions, input size, queuing and serial calls also affect responsiveness."
      }
    ]
  },
  {
    "id": "different-models",
    "title": {
      "zh": "它和聊天模型、传统游戏 AI 有什么区别？",
      "en": "How does it differ from chat models and traditional game AI?"
    },
    "paragraphs": [
      {
        "zh": "状态机和行为树由开发者明确组织条件与行为，执行速度快、可控，适合游戏底层。Jev 的作用是：当“当前应该选哪个行动”难以穷举规则时，读取给定局面，在开发者允许的范围内作判断。它可以与行为树配合，而不是全面替代本地逻辑。",
        "en": "State machines and behavior trees explicitly organize conditions and actions. They are fast and controllable. Jev can judge which permitted action fits the current state when hand-written rules become cumbersome, working alongside local logic."
      },
      {
        "zh": "常见聊天大模型以生成文本为主要接口，也能通过结构化输出和工具调用参与决策。Jev 则把类型化问题作为核心接口：Choice 选择、Score 评分、Noul 判断，返回程序可直接使用的值；Choice 和 Score 还返回概率分布与置信度。区别在于设计目标和输出机制，不是其他模型不会决策。",
        "en": "Chat models can make decisions through structured outputs and tool calls. Jev centers typed questions: Choice, Score and Noul. Choice and Score also return probability distributions and confidence. The distinction is the design and output mechanism, not exclusive decision-making ability."
      },
      {
        "zh": "官方解释，Jev 不逐 token 生成自由文本，而是并行产生结构化输出；同一次请求中的独立问题可一起评估。这是它追求低延迟的重要设计。输出符合类型并不等于战术正确：状态遗漏、目标冲突或模型判断错误，仍可能带来糟糕的行动。",
        "en": "According to TypeSafe, Jev produces structured outputs in parallel rather than generating free-form text token by token. Independent questions can share a request. Type safety does not guarantee good tactics: missing state, conflicting objectives and incorrect judgments can still lead to bad actions."
      }
    ]
  },
  {
    "id": "game-experiment",
    "title": {
      "zh": "已有实验：让模型决定种什么、种哪里",
      "en": "The experiment: deciding what to plant and where"
    },
    "paragraphs": [
      {
        "zh": "当前实现先收集阳光、冷却、敌人位置、各路有效火力和剩余波次，再构建可执行候选。Jev 先选植物或等待，再为选中的植物选择位置；返回后，本地程序重新检查格子、资源和冷却，最后执行种植。自动收集阳光与开局选卡由程序处理。",
        "en": "The implementation gathers sun, cooldowns, enemies, effective lane damage and remaining spawns, then builds candidates. Jev chooses a plant or wait, then a location. Local code rechecks the cell, resources and cooldown before planting. Sun collection and opening card selection are automated locally."
      },
      {
        "zh": "两阶段选择更容易组织候选，但两次调用有依赖，需要串行完成；不能把官方单次请求的延迟直接当作一整次种植决策的耗时。录像展示的是实际集成过程，尚没有足够的延迟统计来报告本项目的 p50 / p95。",
        "en": "The two stages organize candidates but must run sequentially. Single-request vendor latency is not full planting latency. The recording shows the integration; this project does not yet have sufficient latency measurements to report p50 / p95."
      },
      {
        "zh": "曾经反复等待、不种植物，并不只靠“换一个更聪明的模型”解决。我补充了夜晚无收入、射程方向和残局阶段信息，并限制经济植物的数量与位置。模型仍选择动作，但它看到的事实和允许的候选更贴近实际游戏。",
        "en": "Repeated waiting was addressed by clarifying night-time income, firing direction, range and cleanup state, and constraining economy placement and counts. The model still chooses actions within a more accurate representation of the game."
      },
      {
        "zh": "所附无声录像来自一次困难夜晚实验：58 只僵尸，58 次决策，56 次种植、2 次等待，最终获胜。观看版把完整录屏再加速 2 倍；游戏本身也以 2 倍速运行，因此视频不用于证明接口响应速度。单局胜利也不代表稳定胜率。",
        "en": "The silent recording shows one hard-night run: 58 zombies, 58 decisions, 56 plants and 2 waits, ending in victory. This viewing edition doubles the recording speed; the game itself also ran at 2×, so the video is not evidence of API latency or a general win rate."
      }
    ],
    "flow": [
      {
        "zh": "游戏局面",
        "en": "Game state"
      },
      {
        "zh": "合法候选",
        "en": "Valid candidates"
      },
      {
        "zh": "Jev 选择植物 → 位置",
        "en": "Jev: plant → position"
      },
      {
        "zh": "执行校验与反馈",
        "en": "Validation and feedback"
      }
    ]
  },
  {
    "id": "future-play",
    "title": {
      "zh": "未来玩法：玩家塑造角色做决定的方式",
      "en": "Future play: players shape how characters decide"
    },
    "paragraphs": [
      {
        "zh": "下面是基于这次实验的玩法设想，尚未实现。低延迟的重要性在于让角色能够持续回应局势，而不是偶尔接收一次长计划。",
        "en": "The following are proposals, not implemented features. Low latency matters because characters could respond repeatedly as conditions change, rather than occasionally receiving a long plan."
      },
      {
        "zh": "意图指挥：玩家告诉小队“保护伤员，尽量节省弹药”，队员根据局势选择掩护、撤退或反击。玩家调整的是目标和优先级，具体行动交给角色与本地执行系统协作完成。",
        "en": "Intent-based command: tell a squad to protect the wounded and conserve ammunition. Characters choose cover, retreat or counterattack as conditions change, while local systems execute the actions."
      },
      {
        "zh": "性格成为机制：谨慎、冒险、护短不只写在对白里，而是进入候选行动的判断标准。同一场危机，不同角色会有不同取舍；玩家通过观察和调整原则来建立一支真正有行为差异的队伍。",
        "en": "Personality as a mechanic: caution, risk-taking and loyalty influence action criteria, not just dialogue. Players observe tradeoffs and adjust principles to build a team with distinct behavior."
      },
      {
        "zh": "会应变的对手与协作伙伴：敌方指挥官根据可见信息调整路线与资源，同伴在任务发生变化时重新分工。设计上仍要限制信息、能力和反应频率，保留玩家能理解和利用的规律。",
        "en": "Adaptive opponents and companions: commanders adjust routes and resources from visible information, while teammates redistribute work. Information, abilities and decision frequency must remain bounded so players can learn and respond."
      },
      {
        "zh": "下一步我想验证的不是“AI 能不能一直赢”，而是“玩家是否能理解它、影响它，并享受协作”。需要测量端到端延迟、失败与超时比例、每局成本，同时设计低置信度时的保守动作和本地兜底。",
        "en": "The next question is whether players can understand, influence and enjoy collaborating with these characters. That requires latency, failure, timeout and cost measurements, plus conservative actions and local fallback behavior."
      }
    ]
  },
  {
    "id": "reading",
"links":[{"label": {"zh": "TypeSafe：Jev 发布文章与性能测试条件", "en": "TypeSafe: Jev announcement and benchmark conditions"}, "url": "https://typesafe.ai/blog/introducing-system-one-models-and-jev"}, {"label": {"zh": "TypeSafe 文档：类型化问题、概率与置信度", "en": "TypeSafe docs: typed questions, probabilities and confidence"}, "url": "https://docs.typesafe.ai/introduction"}, {"label": {"zh": "游戏基础：PythonPlantsVsZombies 社区项目", "en": "Game foundation: PythonPlantsVsZombies community project"}, "url": "https://github.com/marblexu/PythonPlantsVsZombies"}],
    "title": {
      "zh": "资料与实现来源",
      "en": "Sources and implementation"
    },
    "paragraphs": [
      {
        "zh": "模型机制与速度数据来自下列 TypeSafe 官方资料，查阅日期为 2026 年 9 月 20 日。文中的未来玩法是我的设计设想，游戏数据来自本地单局记录。",
        "en": "Model mechanisms and speed figures come from the TypeSafe sources below, accessed September 20, 2026. Future game formats are design proposals; game results come from one local run."
      }
    ]
  }
];
