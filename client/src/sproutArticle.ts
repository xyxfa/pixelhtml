import type { IdeaArticleSection } from "./ideaArticles";

const copy = (zh: string, en: string) => ({ zh, en });
const source = (file: string, line: number) => ({
  file: `Assets/${file}`,
  line,
});

export const sproutArticle: IdeaArticleSection[] = [
  {
    id: "architecture",
    title: copy("先把一帧里要做的事拆开", "What happens in a frame"),
    paragraphs: [
      copy(
        "萌芽小队里，兔子和小芽会成批生成、接受移动指令，还要参与战斗。数量上来以后，移动、绘制和联机都在争同一帧的时间。我把这几部分分开处理：状态集中存储，模拟交给 Jobs，画面按实例提交，网络只从房主取世界状态。",
        "The rabbits and sprouts spawn in groups, move on command and take part in combat. At larger counts, movement, rendering and networking compete for frame time. I keep state in shared arrays, schedule simulation as jobs, submit instance batches and replicate the host world."
      ),
      copy(
        "具体到代码，UnitRegister 管数组，UnitBus 安排模拟顺序，ToyInstanceRenderer 整理可见单位，ToyNetworkSession 打包快照。客户端收到状态后做显示插值。分工明确以后，排查卡顿就有了入口：先看模拟耗时，再看可见实例和网络队列。",
        "UnitRegister owns the arrays, UnitBus schedules simulation, ToyInstanceRenderer gathers visible units and ToyNetworkSession packs snapshots. Clients interpolate received state. This gives me concrete places to inspect: simulation time, visible instances and the network queue."
      ),
    ],
    flow: [
      copy("状态数组 / 稳定 ID", "State arrays / stable IDs"),
      copy("Jobs 模拟 / 空间查询", "Simulation / spatial queries"),
      copy("可见实例 / GPU 表现", "Visible instances / GPU"),
      copy("快照 / 客户端插值", "Snapshots / client interpolation"),
    ],

    references: [
      source("Scripts/RTS/Unit/UnitBus.cs", 279),
      source("Scripts/Coreline/ToyInstanceRenderer.cs", 52),
      source("Scripts/Network/ToyNetworkSession.cs", 17),
    ],
  },
  {
    id: "dense-state",
    title: copy(
      "单位会被删除，下标也会变",
      "Keeping identity when array slots move"
    ),
    paragraphs: [
      copy(
        "位置、速度、半径和生命值分别放在 NativeArray 里，同一下标指向同一个单位。这样更新位置时可以连续读写位置和速度，不必逐个绕到 GameObject 上找组件。容量不够就按倍数扩容；渲染缓冲也保留已经申请过的容量，供下一批单位复用。",
        "Positions, velocities, radii and health live in separate NativeArrays, sharing an index. Movement jobs read the fields they need without walking through GameObject components. Arrays grow geometrically, and render buffers retain capacity for later batches."
      ),
      copy(
        "这里有个容易漏的细节：删除单位时，最后一个单位会补进空槽，所以数组下标不能拿来当永久身份。我另外保留 spawnIds，搬动槽位时一起复制。动画缓存也要检查这个 ID，否则刚补进来的兔子可能接着播放前一个单位的步态。下面这段就是换人时重置动画状态的地方。",
        "Deletion fills the vacant slot with the last unit, so an array index cannot serve as a permanent identity. spawnIds move with the data. Animation caches check the ID too; otherwise a rabbit moved into a slot could inherit the previous occupant’s gait. The excerpt resets that state."
      ),
    ],
    code: {
      label: copy(
        "按身份重建动画状态 / 代码节选",
        "Reset animation on identity changes / reformatted excerpt"
      ),
      value:
        "var state = motion[i];\nfloat2 position = positions[i];\nif (state.id != ids[i])\n    state = new MotionState {\n        id = ids[i], position = position,\n        phase = (ids[i] % 251) * .025f\n    };",
      source: source("Scripts/Coreline/ToyInstanceRenderer.cs", 126),
    },
    references: [
      source("Scripts/RTS/Unit/UnitRegister.cs", 11),
      source("Scripts/RTS/Unit/UnitRegister.cs", 43),
      source("Scripts/RTS/Unit/UnitRegister.cs", 82),
    ],
  },
  {
    id: "job-dependencies",
    title: copy("哪些 Job 能一起跑，哪些必须等", "Which jobs can overlap?"),
    paragraphs: [
      copy(
        "空间索引和网格索引可以同时准备。速度上限要等网格索引，前进方向要等速度；避让既要查邻居，也要知道前进方向，因此在这里合并两个 JobHandle。之后再更新速度和位置。这段调度顺序基本就是一帧模拟的数据依赖图。",
        "Spatial and grid indexing can start together. Speed limits need the grid, direction needs speed, and avoidance needs both the spatial index and direction. Their handles join before velocity and position updates. The scheduling code is effectively the frame’s dependency graph."
      ),
      copy(
        "最后一次旋转或 Transform 更新会 Complete，保证表现代码读到的是本帧结果，也让扩容和释放数组有安全的时间点。这个做法比较直接，但 Complete 仍可能让主线程等待。继续优化时，我会优先看最长的那条任务链，而不只是增加 Job 数量。",
        "The final rotation or Transform update completes before presentation reads state or arrays can be resized and disposed. That makes lifetime management straightforward, but Complete can still make the main thread wait. Further work should target the longest dependency path."
      ),
    ],
    code: {
      label: copy(
        "模拟依赖链 / 代码节选",
        "Simulation dependencies / source excerpt"
      ),
      value:
        "JobHandle spatial = UpdateCellToUnitBurst();\nJobHandle grid = UpdateUnitGridIndexBurst();\nJobHandle speed = UpdateUnitCurMaxSpeedBurst(grid);\nJobHandle direction = UpdateUnitDirAccBurst(speed);\nJobHandle boids = UpdateUnitBoidsAccBurst(\n    JobHandle.CombineDependencies(spatial, direction));\nJobHandle velocity = UpdateUnitVelocitiesBurst(boids);\nJobHandle position = UpdateUnitPositionBurst(velocity);",
      source: source("Scripts/RTS/Unit/UnitBus.cs", 286),
    },
  },
  {
    id: "shared-flow",
    title: copy(
      "同一个目标，没必要重复算几万条路",
      "One destination, one shared direction field"
    ),
    paragraphs: [
      copy(
        "一次移动命令先生成代价场，再生成方向场，被选中的单位共用一个 dirMapID。每个格子查看周围哪一格代价更低，把那个方向存下来。单位移动时查所在格的方向即可，同一编队不需要重复计算整条路径。",
        "A move command builds a cost field and a direction field, then assigns the selected units one dirMapID. Each cell stores the direction of a lower-cost neighbor. Units look up that direction as they move, sharing the work across the formation."
      ),
      copy(
        "流场负责“往哪里走”，避让负责“眼前挤不挤”。不同目标仍然要各算一份，频繁下命令也会增加开销。旧流场的回收同样要处理：重新分配目标或删除单位后，扫描还在使用的 ID，把没人引用的 NativeArray 释放掉。",
        "The field gives the overall direction; avoidance handles immediate crowding. Different destinations still need separate fields, and frequent commands add generation work. After reassignment or deletion, the code scans active IDs and disposes fields with no remaining users."
      ),
    ],
    code: {
      label: copy(
        "方向场选择 / 代码节选",
        "Direction selection / source excerpt"
      ),
      value:
        "int newIndex = nx * size.y + ny;\nfloat newHeat = heatMap[newIndex];\nif (newHeat < minHeat)\n{\n    minHeat = newHeat;\n    baseDir = new(dx, dy);\n}",
      source: source("Scripts/JobStruct/FlowFieldJob.cs", 43),
    },
    references: [
      source("Scripts/RTS/Unit/UnitBus.cs", 221),
      source("Scripts/RTS/Unit/UnitBus.cs", 62),
    ],
  },
  {
    id: "spatial-neighbors",
    title: copy(
      "避让先找邻居，再算距离",
      "Find nearby units before calculating separation"
    ),
    paragraphs: [
      copy(
        "避让如果每帧遍历全场其他单位，数量一多就很难撑住。这里用 NativeParallelMultiHashMap 记录每个格子有哪些单位。查询先圈定附近格子，再比较距离平方；确实进入作用范围后，才计算分离方向和力度。两个单位几乎重合时用随机方向分开，避免除以接近零的距离。",
        "Checking every other unit each frame gets expensive quickly. A NativeParallelMultiHashMap groups units by cell. The query visits nearby cells, rejects candidates by squared distance, then computes separation for actual neighbors. Nearly coincident units receive a random separation direction."
      ),
      copy(
        "查询格数由自身半径、最大单位半径和格子尺寸共同决定，不能固定只查九宫格，大体型单位会漏判。网格的效果也取决于密度：全挤在少数格子里，候选数量还是会很大。因此看性能时，除了总单位数，还得看移动数和局部拥挤程度。",
        "The query extent accounts for both unit radii and cell size; a fixed nine-cell search could miss larger units. Density still matters: a crowded cell can contain many candidates. Total population alone is therefore not enough to explain simulation cost."
      ),
    ],
    code: {
      label: copy(
        "半径约束与候选排除 / 代码节选",
        "Radius constraints and candidate rejection / excerpt"
      ),
      value:
        "if (otherIndex == index) continue;\nfloat2 diff = positions[otherIndex] - positions[index];\nfloat totalRadius = radii[index] + radii[otherIndex];\nfloat maxDist = totalRadius\n    + 0.2f * math.min(radii[index], radii[otherIndex]);\nif (math.lengthsq(diff) < maxDist * maxDist)\n{\n    float dist = math.length(diff);\n    float2 sepDir = dist < 1e-3f\n        ? rand.NextFloat2Direction() : diff / dist;\n    // 后续按重叠、半径与速度累计分离作用。\n}",
      source: source("Scripts/JobStruct/UpdateUnitBoidsAccJob.cs", 70),
    },
  },
  {
    id: "instance-rendering",
    title: copy(
      "画面里有多少单位，就提交多少",
      "Only submit the instances the camera can see"
    ),
    paragraphs: [
      copy(
        "渲染器按三类模型收集矩阵、动画参数和选中标记。Gather 任务先把位置变换到裁剪空间，排除镜头外的单位，再把可见结果写到连续缓冲。收集结束后，每批最多 400 个实例交给 RenderMeshInstanced，上传数组和 MaterialPropertyBlock 留着复用。",
        "The renderer gathers transforms, animation parameters and selection markers for three model types. Gather jobs reject units outside clip space and compact visible results into buffers. RenderMeshInstanced submits batches of up to 400, reusing upload arrays and MaterialPropertyBlock."
      ),
      copy(
        "镜头是正交相机，同一画面里的角色共享缩放尺度，所以远景模型按一个阈值统一切换，远景阴影也随之关闭。这样比较容易保持批次整齐。当前可见性判断在 CPU/Burst 上完成；GPU 的主要工作是实例绘制和顶点变形，可见顶点数和阴影依然会影响帧耗时。",
        "With an orthographic camera, units share the same screen scale. A single threshold switches distant meshes and disables their shadows, keeping batching simple. CPU/Burst performs visibility checks; the GPU draws and deforms instances. Visible vertex and shadow costs still matter."
      ),
    ],
    code: {
      label: copy(
        "实例批次提交 / 代码节选",
        "Submitting instance batches / source excerpt"
      ),
      value:
        "for (int offset = 0; offset < count; offset += 400)\n{\n    int n = Mathf.Min(400, count - offset);\n    if (poses.IsCreated)\n    {\n        NativeArray<Vector4>.Copy(poses, offset, upload, 0, n);\n        animationProperties.SetVectorArray(AnimationId, upload);\n        parameters.matProps = animationProperties;\n    }\n    Graphics.RenderMeshInstanced(\n        parameters, mesh, 0, data.GetSubArray(offset, n), n);\n}",
      source: source("Scripts/Coreline/ToyInstanceRenderer.cs", 100),
    },
    references: [
      source("Scripts/Coreline/ToyInstanceRenderer.cs", 69),
      source("Scripts/Coreline/ToyInstanceRenderer.cs", 147),
    ],
  },
  {
    id: "gpu-animation",
    title: copy(
      "让兔子蹦起来，也得考虑远景",
      "Animating the rabbits at different scales"
    ),
    paragraphs: [
      copy(
        "兔子的步态相位跟着实际移动距离累加，速度决定运动权重，停下来时再平滑回到静止。传给 Shader 的是相位、权重、种类和细节级别，身体、耳朵和肢体的摆动由顶点代码计算。远处的小兔只保留身体起伏，近处再加细节。",
        "Gait phase follows distance traveled, speed controls motion weight, and stopping blends back to rest. The shader receives phase, weight, kind and detail level, then moves the body, ears and limbs. Distant rabbits keep a simple body bounce; nearby ones get the extra motion."
      ),
      copy(
        "变形要在颜色、阴影、深度和法线通道里保持一致，否则身体动了，影子或描边还留在原位。材质用三档明暗做玩具感，描边则根据屏幕深度差异提取。镜头拉远时逐渐淡化描边，避免密集角色变成一团黑线。",
        "Color, shadow, depth and normal passes use the same deformation so silhouettes stay aligned. Three lighting bands give the toy look, and screen-depth differences supply outlines. The outlines fade as the camera pulls back so dense groups stay readable."
      ),
    ],
    references: [
      source("Scripts/Coreline/ToyInstanceRenderer.cs", 127),
      source("Coreline/ToySurface.shader", 36),
    ],
  },
  {
    id: "host-authority",
    title: copy(
      "联机时，谁来决定世界发生了什么",
      "Who owns the world in a multiplayer session?"
    ),
    paragraphs: [
      copy(
        "客户端发送生成、移动和建造命令，房主处理模拟、命中和死亡，再把结果同步回来。非房主端通过 SuppressSimulation 关闭权威更新，只更新显示。这样两个窗口可以各自移动镜头，但战斗结果始终有一个来源。",
        "Clients send spawn, move and build commands. The host simulates movement, hits and deaths, then sends the resulting state back. SuppressSimulation disables authoritative updates on clients. Both windows can move their cameras independently while sharing one source of combat results."
      ),
      copy(
        "我选择的是房主权威的状态同步，客户端目前没有做预测回滚。规则集中在一处比较好排查，但房主也承担了主要计算，远端操作会受传输延迟影响。接下来要处理的就是快照大小和发送节奏：连上以后，数据还得跟得上。",
        "I use host-authoritative state replication, without client prediction and rollback in this version. Centralized rules are easier to inspect, but the host carries the simulation and remote input depends on transfer delay. Snapshot size and send cadence become the next problems to solve."
      ),
    ],
    image: {
      src: "/ideas/sprout/network.webp",
      width: 1600,
      height: 816,
      caption: copy(
        "同一段实录中的房主与客户端：战斗结果、连接状态和快照遥测同时可见。",
        "Host and client in the same recording, with combat, connection state and snapshot telemetry visible."
      ),
    },
    references: [
      source("Scripts/Network/ToyNetworkSession.cs", 17),
      source("Scripts/Network/ToyNetworkSession.cs", 190),
    ],
  },
  {
    id: "packed-snapshots",
    title: copy("把一个单位压进 22 字节", "Packing a unit into 22 bytes"),
    paragraphs: [
      copy(
        "单位状态由 ID、种类、平面位置、朝向、受击状态、生命值和速度组成，固定部分一共 22 字节。位置乘以 100、取整后写成 ushort，接收端再乘 0.01；速度用有符号 16 位恢复。量化只发生在发送和接收时，房主的模拟数组继续使用浮点数。",
        "A unit record contains ID, kind, planar position, yaw, hit state, health and velocity in 22 bytes. Position is rounded to hundredths and encoded as ushort; velocity is restored as signed 16-bit values. Quantization stays at the network boundary while host simulation uses floats."
      ),
      copy(
        "存储顺序也做了调整：按字段的字节分组，地址是 field × count + i。同类数据靠在一起，更容易出现连续相同字节，后续游程编码就能利用这一点。至少 3 个重复字节组成重复块，每块最多 128 字节；每份快照可以独立解码。",
        "Bytes are grouped by field at field × count + i. Similar values sit next to each other, making repeated bytes easier for run-length encoding to capture. Runs start at three identical bytes, blocks hold up to 128 bytes, and each snapshot decodes independently."
      ),
      copy(
        "单看未压缩单位区，8 万单位就是 80,000 × 22 = 1,760,000 字节，还没算协议和其他对象。这是载荷预算，不是实测带宽，也说明只做压缩还不够。编码范围同样要记住：当前位置只能表示 0～655.35，扩大地图时需要一起调整。",
        "The uncompressed unit section alone is 80,000 × 22 = 1,760,000 bytes, before protocol data and other objects. That is a payload calculation rather than measured bandwidth, and explains why send control matters too. The current position encoding covers 0–655.35 world units; larger maps would need a different range."
      ),
    ],
    code: {
      label: copy(
        "按字段写入 16 位数值 / 代码节选",
        "Field-wise 16-bit packing / reformatted excerpt"
      ),
      value:
        "private void U16(int i, int field, int value)\n{\n    bytes[field * count + i] = (byte)value;\n    bytes[(field + 1) * count + i] = (byte)(value >> 8);\n}\n// 位置在写入边界量化，模拟数组仍为 float2。\nU16(p, 9, (int)math.clamp(\n    math.round(positions[i].x * 100), 0, 65535));",
      source: source("Scripts/Network/ToyNetworkPackedState.cs", 32),
    },
    references: [
      source("Scripts/Network/ToyNetworkPackedState.cs", 56),
      source("Scripts/Network/ToyRunLengthCodec.cs", 18),
    ],
  },
  {
    id: "backpressure",
    title: copy(
      "网络慢下来时，别把旧快照越排越多",
      "Keeping slow connections from building a snapshot backlog"
    ),
    paragraphs: [
      copy(
        "房主以 0.1 秒为目标间隔尝试发送快照，但不会每次都往队列里塞数据。连接队列为空，且上一份快照已收到回执，才发送新的状态；等待超过 1 秒则允许继续恢复。这是对慢连接的背压，实际快照频率会随负载下降。",
        "The host tries to send at 0.1-second intervals, but only queues a snapshot when the peer queue is empty and the previous snapshot has been acknowledged, or after a one-second timeout. This puts backpressure on slow connections, so actual snapshot frequency can fall under load."
      ),
      copy(
        "回执带房间 epoch、序号和内容哈希。先确认它属于当前房间和已发送记录，再释放对应的等待标记、比较哈希。面板上的校验结果表示这份快照内容是否一致；它和渲染帧率、两端插值进度是不同的观察项。",
        "A receipt carries the room epoch, sequence and content hash. The host checks its room and sent-history entry, clears the matching wait flag and compares the hash. The verification counter describes snapshot content, separately from render FPS and interpolation progress."
      ),
    ],
    code: {
      label: copy(
        "接收回执 / 代码节选",
        "Handling receipts / reformatted excerpt"
      ),
      value:
        "ulong room = reader.ReadUInt64();\nuint serial = reader.ReadUInt32();\nstring hash = reader.ReadString();\nif (room != epoch ||\n    !snapshotHistory.TryGetValue(serial, out string expected))\n    return;\nif (serial == peer.sentSnapshot)\n    peer.awaitingSnapshot = false;\nbool matches = hash == expected;",
      source: source("Scripts/Network/ToyNetworkTelemetry.cs", 48),
    },
    references: [source("Scripts/Network/ToyNetworkSession.cs", 247)],
  },
  {
    id: "replica-interpolation",
    title: copy(
      "快照不是每帧到，画面还是要每帧动",
      "Smooth movement between snapshots"
    ),
    paragraphs: [
      copy(
        "收到快照时，把当前显示位置记作起点，把新状态记作目标。之后每帧用“距上次快照的时间 / 平滑后的快照间隔”计算插值进度，并限制在 0～1。位置用 Lerp，旋转用 Slerp，统一放进 Burst 的 IJobParallelFor 处理。",
        "When a snapshot arrives, the current displayed transform becomes the start and the received transform becomes the target. Each frame uses elapsed time divided by a smoothed snapshot interval, clamped to 0–1. A Burst IJobParallelFor applies position Lerp and rotation Slerp."
      ),
      copy(
        "这能缓解低频同步的跳动，不过没收到新状态时，角色最终还是会停在上一个目标。当前版本先把显示平滑做好。如果继续处理高延迟和抖动，我会考虑缓冲、预测和纠正一起设计，因为光提高发送频率并不能解决所有问题。",
        "This smooths lower-frequency updates, but without another snapshot the unit eventually stops at its last target. This version focuses on display interpolation. Handling higher latency would mean considering buffering, prediction and correction together."
      ),
    ],
    code: {
      label: copy(
        "批量位置与旋转插值 / 代码节选",
        "Batch transform interpolation / reformatted excerpt"
      ),
      value:
        "public void Execute(int i)\n{\n    lastPositions[i] = positions[i];\n    positions[i] = math.lerp(starts[i], targets[i], blend);\n    rotations[i] = math.slerp(\n        fromRotations[i], toRotations[i], blend);\n}",
      source: source("Scripts/Network/ToyNetworkWorld.cs", 130),
    },
  },
  {
    id: "engineering-takeaways",
    title: copy(
      "看运行效果时，我会分开看这几个数",
      "What I look at in the runtime counters"
    ),
    paragraphs: [
      copy(
        "单位总数、移动数和可见数会把压力带到不同地方：移动数影响模拟，可见数影响提交和 GPU 负载，世界状态规模影响快照大小。因此视频里保留了原始面板，方便把两万、四万、八万级场景中的动作和读数对应起来。帧率波动也一并保留。",
        "Total, moving and visible counts stress different parts of the project. Movement affects simulation, visibility affects rendering, and world size affects snapshots. The demo keeps the original counters and FPS fluctuations so the 20K, 40K and 80K-scale scenes can be read in context."
      ),
      copy(
        "项目基于 UnityRTS 改造，本文对应“联机工程_最新三渲二”版本。对我来说，这个项目最值得展开的是各部分怎么配合：数组搬迁不能弄丢身份，Job 完成后才能读取状态，网络来不及发送时要控制队列。单个技术点不难列出来，连接处才需要反复想清楚。",
        "The project builds on UnityRTS; this article refers to the supplied latest multiplayer/toon version. The useful discussion is how the pieces cooperate: identity must survive array moves, readers must wait for jobs, and slow transfers need queue control. Those joins need as much attention as the individual techniques."
      ),
    ],
  },
];
