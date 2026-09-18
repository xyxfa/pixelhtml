import type { IdeaArticleSection } from "./ideaArticles";

export const noitaArticle: IdeaArticleSection[] = [
  {
    "id": "cellular-world",
    "title": {
      "zh": "先让一粒沙落下来",
      "en": "Start with a falling grain"
    },
    "paragraphs": [
      {
        "zh": "我想复现的是 Noita 里那种“画面本身就是材料”的交互：炸开墙，水会流出来；点燃木架，支撑烧断以后结构会掉下去。这个项目用 Unity 实现了一套像素材料沙盒，围绕元胞自动机组织状态和规则。这里的复刻指这套玩法原理在自己工程里的实现。",
        "en": "I wanted the screen itself to behave like material: break a wall and water pours out; burn a support and a wooden structure falls. This Unity sandbox implements that idea with a cellular-automaton approach. The recreation is my own implementation of those mechanics."
      },
      {
        "zh": "世界是 384 × 176 的网格，共 67,584 个格子。一格先尝试向下移动，走不通再检查斜下方。沙、水、油各自决定能和什么交换，很多格子连续执行这些规则，就会出现堆积、流动和分层。大部分交互来自局部规则的组合，液体横向找出口和木结构连通检测则需要更大范围的查询。",
        "en": "The world has 384 × 176 cells, or 67,584 in total. A cell first tries downward movement, then the diagonals. Sand, water and oil have different exchange rules. Repeated local updates produce piles, flow and layering; liquid outlet searches and structural connectivity need wider queries."
      }
    ],
    "code": {
      "label": {
        "zh": "源码节选",
        "en": "Source excerpt"
      },
      "value": "int d=type==3||type==4||type==14?((Cells[i]&65536)==0?-1:1):((math.hash(new uint2((uint)i,(uint)Tick))&1)==0?-1:1);\nif(Move(i,x,y,x,y-1,type))continue;\nif(Move(i,x,y,x+d,y-1,type)||Move(i,x,y,x-d,y-1,type))continue;\nif(type==3||type==4||type==14){if(FlowSide(i,x,y,d,type))continue;FlowSide(i,x,y,-d,type);}",
      "source": {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 163
      }
    },
    "references": [
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 17
      }
    ],
    "flow": [
      {
        "zh": "网格状态",
        "en": "Cell state"
      },
      {
        "zh": "读取邻域",
        "en": "Read neighbors"
      },
      {
        "zh": "检查规则",
        "en": "Check rules"
      },
      {
        "zh": "交换 / 转换",
        "en": "Swap / transform"
      }
    ]
  },
  {
    "id": "packed-state",
    "title": {
      "zh": "移动的是材料状态，不只是一个颜色",
      "en": "Move the material state, not just its color"
    },
    "paragraphs": [
      {
        "zh": "每格用一个 uint 保存材料：低 8 位是类型，其余位按材料需要记录色调、液体方向、燃料标记和寿命。爆破后的速度单独放在 NativeArray<int2>。这样同一块连续内存就能描述整个世界，不需要给每粒沙挂 GameObject、Collider 和 Update。",
        "en": "Each cell stores its material in a uint. The low eight bits identify the type; other bits carry tint, liquid direction, fuel flags and lifetime as needed. Blast velocity lives in a separate NativeArray<int2>. Contiguous arrays describe the world without a GameObject, Collider and Update per grain."
      },
      {
        "zh": "移动时交换完整的材料值和速度。色调随颗粒一起移动，沙堆才不会每帧闪烁；液体保留横向偏好，也能避免每步重新随机造成的左右摇摆。打包的代价是位段约定必须一致，新增材料时要一起检查绘制、反应和序列化边界。",
        "en": "Movement swaps the complete material value and velocity. Tint follows the grain instead of flickering, and liquids retain a horizontal preference rather than choosing a new random direction every tick. Packed state requires consistent bit conventions whenever a new material or data boundary is added."
      }
    ],
    "code": {
      "label": {
        "zh": "源码节选",
        "en": "Source excerpt"
      },
      "value": "if((type==3||type==4||type==14)&&tx!=x)moved=(moved&~65536u)|(tx>x?65536u:0);\nCells[to]=moved;Cells[from]=target;Updated[to]=Updated[from]=Tick;\nint2 velocity=Velocity[from];Velocity[from]=Velocity[to];Velocity[to]=velocity;\nMark(x,y);Mark(tx,ty);Counters[1]++;return true;",
      "source": {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 291
      }
    },
    "references": [
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 62
      }
    ]
  },
  {
    "id": "update-order",
    "title": {
      "zh": "为什么一粒沙不会在一次扫描里落到底",
      "en": "Why one scan does not drop a grain to the floor"
    },
    "paragraphs": [
      {
        "zh": "这套模拟直接修改当前网格，因此扫描顺序会影响结果。代码从下往上走，横向则每步交替左右方向，减少长期偏向一边的痕迹。Updated 数组记录格子里的颗粒本步是否已经处理过，普通移动到新位置后，不会在后续扫描中再走一次。",
        "en": "The simulation mutates the grid in place, so scan order matters. It goes bottom to top and alternates horizontal direction each tick. Updated stamps keep ordinary movement from processing the same grain again at its new location."
      },
      {
        "zh": "空格需要另算。颗粒移走后留下的位置，本步仍然允许其他颗粒填入；如果把空格也一律锁住，下落时会出现不自然的空隙。爆破的速度移动则有自己的路径细分，一次更新可以跨过多个格子。这里限制的是重复调度，不是把所有运动都限制成一格。",
        "en": "Vacated cells stay available for other grains in the same tick; locking air as well would leave artificial gaps. Blast impulses have their own swept path and may cross several cells in an update. The stamp prevents repeated scheduling, rather than limiting every motion to one cell."
      }
    ],
    "code": {
      "label": {
        "zh": "源码节选",
        "en": "Source excerpt"
      },
      "value": "bool reverse=(Tick&1)==0;\nfor(int y=1;y<H;y++)for(int ci=0;ci<C;ci++)\n{\n    int cx=reverse?C-1-ci:ci;\n    if(Optimized&&Active[cx+(y/16)*C]==0)continue;\n    for(int k=0;k<16;k++)\n    {\n        int x=cx*16+(reverse?15-k:k),i=x+y*W;Counters[0]++;\n        byte type=(byte)(Cells[i]&255);\n        if(type<2||Updated[i]==Tick)continue;",
      "source": {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 146
      }
    },
    "references": [
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 270
      },
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 286
      }
    ]
  },
  {
    "id": "sleep-wake",
    "title": {
      "zh": "优化先从“这块还会变化吗”开始",
      "en": "Skip regions that have settled"
    },
    "paragraphs": [
      {
        "zh": "我把网格按 16 × 16 分块，总共 264 块。模拟只扫描活跃块，材料稳定后就不再续上下一步的活跃标记。编辑、移动或反应会重新唤醒区域。沙堆沉降以后，继续扫描同一片静止数据的开销就能省下来。",
        "en": "The grid is divided into 264 chunks of 16 × 16 cells. Simulation scans active chunks; settled regions stop renewing their next-step flag. Editing, movement or reactions wake them again, avoiding repeated work after a pile settles."
      },
      {
        "zh": "Active 和 Next 都要更新。当前扫描里，下方变化可能让上方原本休眠的格子重新具备下落条件；只标记下一步，会漏掉本步本来应该发生的更新。保留同一套扫描顺序，再维护这两个集合，才有机会让局部计算与全图计算逐步一致。",
        "en": "Both Active and Next are marked. A change below can make a sleeping cell above movable during the current scan. Marking only the next tick would postpone work the full scan performs now. Keeping the same order and both sets makes step-by-step equivalence possible."
      }
    ],
    "code": {
      "label": {
        "zh": "源码节选",
        "en": "Source excerpt"
      },
      "value": "void Mark(int x,int y)\n{\n    int cx=x/16,cy=y/16;\n    for(int yy=math.max(0,cy-1);yy<=math.min(R-1,cy+1);yy++)for(int xx=0;xx<C;xx++)\n    {int c=xx+yy*C;Next[c]=1;Active[c]=1;}",
      "source": {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 296
      }
    },
    "references": [
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 119
      }
    ]
  },
  {
    "id": "liquid-outlet",
    "title": {
      "zh": "水已经停了，远处开口以后怎么办",
      "en": "Wake resting water when an outlet opens"
    },
    "paragraphs": [
      {
        "zh": "只要旁边是空格就横移，会让平地上的单滴水一直游走，区块也永远睡不下去。当前规则会先寻找同一行上可到达的更低空位，再决定横移；上方同类液体也可以推动下层扩散。这是有限地图上的离散找低处规则。",
        "en": "Unconditional sideways motion makes a single drop wander forever and prevents sleep. The current rule searches along a reachable row for a lower opening before moving sideways; liquid above can also push spreading below. This is a discrete rule on a bounded map."
      },
      {
        "zh": "这个选择带来一个依赖：出口可能离当前格子很远。因此发生变化时，代码会保守地唤醒相邻区块行的所有列，而不是只唤醒周围九块。扫描范围更大，但远处开口能及时影响已经静止的水。地图继续变宽时，行搜索和整行唤醒会成为需要重新评估的成本。",
        "en": "An outlet may be far away, so changes conservatively wake every column in neighboring chunk rows, rather than only nine chunks. This does more scanning but lets distant openings affect settled water. Wider maps would require revisiting both row searches and wake coverage."
      },
      {
        "zh": "也可以用有向图理解这个取舍：定义 A → B 表示 A 的移动判断会读取 B 附近的状态。B 改变后，需要重新检查的是依赖它的 A，相当于沿反向依赖传播失效。当前实现没有真的维护这张图，而是用“三行区块全部唤醒”覆盖可能受影响的范围，省去精确追踪的维护成本。",
        "en": "A directed dependency graph explains the tradeoff: define A → B when A reads state near B to decide a move. When B changes, its dependents A need reevaluation. The implementation does not store this graph; waking all columns in three chunk rows conservatively covers dependencies without tracking them explicitly."
      }
    ],
    "code": {
      "label": {
        "zh": "源码节选",
        "en": "Source excerpt"
      },
      "value": "for(int distance=1;distance<W;distance++)\n{\n    int xx=x+direction*distance;\n    if(xx<1||xx>=W-1||y<=1)return false;\n    uint across=Cells[xx+y*W]&255;\n    if(across!=0&&across!=type)return false;\n    uint below=Cells[xx+(y-1)*W]&255;\n    if(below==0||type==3&&below==4)return Move(i,x,y,x+direction,y,type);\n}\nreturn false;",
      "source": {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 181
      }
    },
    "references": [
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 170
      },
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 72
      }
    ],
    "diagram": "wake"
  },
  {
    "id": "jobs-rendering",
    "title": {
      "zh": "模拟按顺序写，颜色分批算",
      "en": "Sequential simulation writes, parallel color reads"
    },
    "paragraphs": [
      {
        "zh": "两个相邻格子可能同时想进入同一空位，密度交换还会修改另一格。我在当前版本让 SimulateJob 独占模拟写入，用 Burst 编译这段连续数组上的计算；木结构任务随后执行。这样状态变更的先后关系明确，验证也比较直接。",
        "en": "Neighboring cells can compete for the same destination, and density swaps modify another cell. SimulateJob owns simulation writes and Burst compiles the array processing; the wood task runs afterward. This keeps mutation order explicit and makes validation straightforward."
      },
      {
        "zh": "颜色计算只读完成后的状态，适合用 IJobParallelFor 分批处理。主线程随后调用 SetPixelData 和 Apply，把整张小纹理交给 RawImage。状态没有变化时跳过刷新。当前纹理上传仍是整张；如果扩成大地图，我会先分别看模拟、着色、上传三个 Profiler 标记，再决定拆哪一段。",
        "en": "Color generation only reads completed state, so IJobParallelFor can process it in batches. The main thread calls SetPixelData and Apply to display the texture through RawImage. Unchanged state skips refresh. Upload still covers the whole small texture; larger maps should be profiled separately for simulation, colorization and upload."
      }
    ],
    "code": {
      "label": {
        "zh": "源码节选",
        "en": "Source excerpt"
      },
      "value": "public void RefreshTexture()\n{\n    timer.Restart();using(colorMarker.Auto())new ColorizeJob{Cells=Sim.Cells,Active=Sim.Active,Pixels=pixels,Overlay=Overlay,Heat=Sim.HasHeat,Tick=Sim.Tick}.Schedule(pixels.Length,256).Complete();\n    timer.Stop();ColorMs=(float)timer.Elapsed.TotalMilliseconds;timer.Restart();\n    using(uploadMarker.Auto()){Texture.SetPixelData(pixels,0);Texture.Apply(false,false);}\n    timer.Stop();UploadMs=(float)timer.Elapsed.TotalMilliseconds;dirty=false;",
      "source": {
        "file": "Assets/SandLab/SandApp.cs",
        "line": 132
      }
    },
    "references": [
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 119
      },
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 303
      }
    ]
  },
  {
    "id": "material-reactions",
    "title": {
      "zh": "把燃烧、灭火和腐蚀接到一起",
      "en": "Connect burning, water and corrosion"
    },
    "paragraphs": [
      {
        "zh": "燃烧是带寿命的材料状态。每步检查邻近燃料，按规则传播；接触水后消耗相邻的水并生成蒸汽，木材可以留下焦痕。烟和蒸汽也占据格子，向上移动，再随寿命结束消散。它们因此能和同一张地图继续发生交互。",
        "en": "Burning is a material state with lifetime. Each tick checks nearby fuel and propagates by rule. Contact with water produces steam, and wood can retain char marks. Smoke and steam occupy cells, rise and expire, keeping them part of the same world."
      },
      {
        "zh": "酸液也有消耗：每格最多完成四次腐蚀，耗尽后转成水；冻融则把冰与水的材料类型互换。爆破核心负责清除，外圈赋予速度或点燃燃料。冲击环和火星用固定容量的 UI 特效缓冲绘制，与真正会影响后续模拟的材料状态分开维护。",
        "en": "Acid has a limited reagent budget: up to four corrosions per cell, then it becomes water. Freeze and melt change the material type. Blasts clear a core and impart velocity or ignition around it. Decorative rings and sparks use fixed-capacity UI effect buffers, separately from state that affects future simulation."
      }
    ],
    "references": [
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 205
      },
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 244
      },
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 107
      }
    ]
  },
  {
    "id": "wood-graph",
    "title": {
      "zh": "把木桥画成图，断裂就容易理解了",
      "en": "A broken bridge as a graph"
    },
    "paragraphs": [
      {
        "zh": "把每个木格当作顶点 V，上下左右相邻的木格之间连一条无向边 E，就得到 G = (V, E)。沿着边能互相走到的一组顶点，就是一个连通分量。斜角接触没有边，所以两块只碰到角的木头不会被当作同一结构。",
        "en": "Treat each wood cell as a vertex V and connect orthogonally adjacent wood cells with undirected edges E. Mutually reachable vertices form a connected component of G = (V, E). Diagonal contact does not connect two pieces."
      },
      {
        "zh": "场景里 A 接触石头，整个分量都能通过木格连到这个支撑。烧掉 X，相当于删除一个顶点和它相连的边，结构分成两组。X 在这个例子中是割点，因为删除它增加了连通分量数；项目没有专门求割点，而是在拓扑改变后重新遍历。",
        "en": "A touches stone, so its whole component is anchored. Removing X deletes a vertex and its incident edges, splitting the structure. X is an articulation point in this example. The project does not run an articulation-point algorithm; it traverses components again after topology changes."
      },
      {
        "zh": "固定支撑可以看作顶点上的标记：只要分量里有一个木格接触石头、地面或外边界，anchored 就会成立。失去这种连接只表示需要进入下落判断；如果下方被沙堆或其他木结构挡住，这一组仍会停留。这一步把“连通性”和“能否移动”分开了。",
        "en": "Anchoring is a property accumulated across a component: any wood cell touching stone, the floor or a boundary anchors the group. Losing that connection leads to a separate downward obstruction check. Sand or other wood can still block motion."
      }
    ],
    "references": [
      {
        "file": "Assets/SandLab/WoodStructureJob.cs",
        "line": 20
      }
    ],
    "diagram": "components"
  },
  {
    "id": "wood-bfs",
    "title": {
      "zh": "用 BFS 找分量，队列里到底放了什么",
      "en": "Finding components with a BFS queue"
    },
    "paragraphs": [
      {
        "zh": "外层扫描找到一个还没有标签的木格，就为它分配新的分量编号，放入 Queue。head 指向下一个待处理元素，count 指向队尾。取出一个木格后检查四个方向，遇到未标记的木格就先写 Labels，再追加到队尾。先标记再入队，能避免有环的结构把同一格反复加入。",
        "en": "The outer scan starts a new component at an unlabeled wood cell. Queue stores pending cells, head reads the next item and count marks the end. Each of four neighbors is labeled before enqueueing, so cycles cannot repeatedly enqueue the same vertex."
      },
      {
        "zh": "沿用上图，第一轮从 A 出发，依次发现 B、C；队列为空时，这个分量已经找全。随后外层扫描遇到 F，再找出 E、D。源码没有另外保存一份图：数组下标就是顶点编号，四邻接由坐标直接算出来，这是网格上的隐式图。",
        "en": "In the diagram, the first traversal finds A, B and C. The outer scan then reaches F and finds E and D. No separate graph object is stored: array indices identify vertices and coordinates generate the four neighbors, forming an implicit grid graph."
      },
      {
        "zh": "一次连通遍历的成本是 O(V + E)，四邻接让每个顶点最多只有四条边。不过这不等于整个结构任务只有这点开销：当前代码还会清空标签、扫描 N 个网格位置，并给可下落的分量排序。合起来要看 O(N + V + E + Σ kᵢ log kᵢ)，其中 kᵢ 是各个待移动分量的大小。",
        "en": "Connectivity traversal costs O(V + E), with degree at most four. The complete task also clears labels, scans N grid positions and sorts movable components. Its bound includes O(N + V + E + Σ kᵢ log kᵢ), where kᵢ is each movable component size."
      },
      {
        "zh": "这里选 BFS，主要因为烧穿和爆破会不断删除连接，重新找分量比较直接。普通并查集擅长把两组合并；连接删掉以后怎样拆开，还要补其他处理。当前地图规模下，先保留这套容易核对的遍历，再根据碎片数量与检测耗时决定是否值得换方案。",
        "en": "BFS makes it straightforward to rebuild components after burning or explosions delete connections. Ordinary union-find handles merges well, but splitting after deletion needs additional machinery. At this scale, profiling fragment counts and traversal time can guide whether a more complex approach is justified."
      }
    ],
    "code": {
      "label": {
        "zh": "源码节选",
        "en": "Source excerpt"
      },
      "value": "if(Labels[start]!=0||!IsWood(Cells[start]))continue;\nid++;int count=1,head=0;Queue[0]=start;Labels[start]=id;bool anchored=false;\nwhile(head<count)\n{\n    int i=Queue[head++],x=i%W,y=i/W;\n    if(y<=3||x<=3||x>=W-4)anchored=true;\n    for(int n=0;n<4;n++)\n    {\n        int xx=x+(n==0?-1:n==1?1:0),yy=y+(n==2?-1:n==3?1:0);\n        if(xx<0||xx>=W||yy<0||yy>=H)continue;\n        int j=xx+yy*W;\n        // Stone contacts anchor the structure; fluids never count as supports.\n        if((Cells[j]&255)==1)anchored=true;\n        if(Labels[j]==0&&IsWood(Cells[j])){Labels[j]=id;Queue[count++]=j;}\n    }\n}",
      "source": {
        "file": "Assets/SandLab/WoodStructureJob.cs",
        "line": 27
      }
    },
    "diagram": "bfs"
  },
  {
    "id": "wood-collapse",
    "title": {
      "zh": "木桥断开以后，先找出哪部分失去支撑",
      "en": "Find the unsupported part of a broken bridge"
    },
    "paragraphs": [
      {
        "zh": "木头要保持形状，就不能继续当成独立沙粒处理。WoodStructureJob 用四邻接遍历把木格归为连通分量，接触石头、地面或边界的部分视为固定。拓扑改变后重新检测，失去固定连接的分量再检查下方是否被挡住。",
        "en": "Wood needs to retain its shape rather than behave like independent sand grains. WoodStructureJob finds four-connected components and anchors those touching stone, the floor or boundaries. After topology changes, detached components check whether their downward move is blocked."
      },
      {
        "zh": "整体下移时先按格子索引排序，从下往上交换，避免刚搬过去的木头被下一次写入覆盖。穿过液体时做交换，尽量维持材料数量。这里实现的是网格中的整体平移；如果要让碎块旋转，就需要引入不同的物理表示和与材料网格的耦合方式。",
        "en": "For a downward translation, cell indices are sorted so swaps proceed bottom to top without overwriting wood just moved. Swapping displaced liquid preserves its amount. This implementation translates shapes on a grid; rotating debris would require another physical representation and a coupling scheme."
      },
      {
        "zh": "结构检测使用预分配的标签与队列数组。固定结构可以停止检测，但没有固定连接、只是暂时被沙堆挡住的碎块仍会继续检查。碎块很多时，连通遍历和排序的开销就值得单独观察。",
        "en": "Labels and queues are preallocated. Fully anchored structures can stop checking, while detached pieces temporarily resting on sand still need reevaluation. With many fragments, connectivity traversal and sorting deserve separate profiling."
      }
    ],
    "code": {
      "label": {
        "zh": "源码节选",
        "en": "Source excerpt"
      },
      "value": "Queue.GetSubArray(0,count).Sort();\nfor(int n=0;n<count;n++)\n{\n    int from=Queue[n],to=from-W;uint wood=Cells[from];Cells[from]=Cells[to];Cells[to]=wood;\n    int2 velocity=Velocity[from];Velocity[from]=Velocity[to];Velocity[to]=velocity;\n    Labels[to]=id;Updated[from]=Updated[to]=Tick;Wake(from);Wake(to);\n}",
      "source": {
        "file": "Assets/SandLab/WoodStructureJob.cs",
        "line": 54
      }
    },
    "references": [
      {
        "file": "Assets/SandLab/WoodStructureJob.cs",
        "line": 20
      }
    ]
  },
  {
    "id": "projectile-pool",
    "title": {
      "zh": "弹丸穿过一个像素前，先查它经过了什么",
      "en": "Check what a fast projectile passes through"
    },
    "paragraphs": [
      {
        "zh": "法杖弹丸存在 256 个固定槽位里，满了就暂不发射。每步先计算终点，再按路径长度细分采样，步长约半个格子，避免只检查终点而越过薄墙。碰撞后调用同一套爆破、点火和放水接口，弹丸玩法就能影响材料世界。",
        "en": "Wand projectiles use 256 fixed slots and reject new shots when full. Each step samples the path to its endpoint at roughly half-cell spacing, avoiding endpoint-only checks that could skip thin walls. Impacts call the same explosion, ignition and water APIs."
      },
      {
        "zh": "导火线和炸药桶用模拟步维护传播和引爆时间。水能让导火线失效，也能取消桶的倒计时。爆炸回调前先移除当前桶，再让邻居进入未来步的引爆状态，连锁就不用在一次事件里递归炸完。",
        "en": "Fuses and barrels use simulation ticks for propagation and detonation. Water disables fuses and cancels barrel timers. A detonating barrel is removed before its explosion event arms neighbors for future ticks, avoiding a recursive chain completed inside one event."
      }
    ],
    "code": {
      "label": {
        "zh": "源码节选",
        "en": "Source excerpt"
      },
      "value": "float2 end=shot.Position+shot.Velocity;int steps=math.max(1,(int)math.ceil(math.length(shot.Velocity)*2));\nbool hit=false,outside=false;int x=0,y=0;\nfor(int k=1;k<=steps;k++){\n    shot.Position=math.lerp(shot.Previous,end,(float)k/steps);int2 cell=(int2)math.floor(shot.Position);x=cell.x;y=cell.y;\n    if(x<3||x>=W-3||y<3||y>=H){outside=true;break;}\n    uint type=sim.Cells[x+y*W]&255;if(type!=0&&type!=6&&type!=7&&type!=8){hit=true;break;}\n}",
      "source": {
        "file": "Assets/SandLab/SandPlay.cs",
        "line": 65
      }
    },
    "references": [
      {
        "file": "Assets/SandLab/SandPlay.cs",
        "line": 12
      },
      {
        "file": "Assets/SandLab/SandPlay.cs",
        "line": 80
      }
    ]
  },
  {
    "id": "material-transfer",
    "title": {
      "zh": "把水搬走，再原样放回世界",
      "en": "Move water without discarding its state"
    },
    "paragraphs": [
      {
        "zh": "吸水工具把可搬运材料的完整 uint 值放进预分配缓冲，再清空原格；释放时只选空位，不覆盖已有材料。这样搬运过程保留材料类型和附带状态，喷出的水继续参与流动和灭火。",
        "en": "The transfer tool stores complete material uint values in a preallocated buffer and clears their original cells. Release only writes empty destinations, preserving type and associated state so the emitted water continues flowing and extinguishing fires."
      },
      {
        "zh": "每次传输都有数量预算，避免一次笔刷操作搬完整个区域。这个工具也能帮助检查接口是否统一：清除、放入和释放速度都要走正确的状态更新与唤醒路径，否则画面看起来有水，附近格子却可能仍在休眠。",
        "en": "A per-call budget limits transfer work. The tool also exercises consistency between interfaces: removal, insertion and release velocity must update state and wake dependent regions, or newly visible water could leave neighboring cells asleep."
      }
    ],
    "references": [
      {
        "file": "Assets/SandLab/SandManipulator.cs",
        "line": 8
      }
    ]
  },
  {
    "id": "verification",
    "title": {
      "zh": "证明少算的格子没有改变结果",
      "en": "Check that skipped work preserves the result"
    },
    "paragraphs": [
      {
        "zh": "运行时的 B 对照创建两份独立模拟，使用相同初态，在相同的第 120、180 步爆破。一份扫描全图，一份只扫活跃块；360 步中，每步比较所有材料值和速度。单看最终画面很难发现晚一帧的唤醒，这种逐步对照能把偏差更早暴露出来。",
        "en": "The runtime B comparison creates two simulations with identical initial state and explosions at ticks 120 and 180. One scans the full grid and one scans active chunks. Material values and velocities are compared every tick for 360 steps, catching delayed wakes that a final screenshot could miss."
      },
      {
        "zh": "计时先预热，并交替测量两种模式，检查逻辑放在计时之外。项目还保留材料守恒、休眠唤醒、坍塌和薄墙碰撞的验证代码。交付包记录的 2,206 项是累计断言，不能当作同样数量的独立案例；这次剪辑没有重新跑 Unity 编辑器全套验证。",
        "en": "Timing excludes warmup and comparison, and alternates measurement order. Validation code also checks conservation, sleep/wake, collapse and thin-wall collisions. The delivered 2,206 count is cumulative assertions, not distinct test cases; this edit did not rerun the full Unity Editor suite."
      },
      {
        "zh": "本页视频结合两份独立程序录屏：本次 i9-13980HX / RTX 4060 Laptop 的有效片段，以及交付包中 i7-9700 / RTX 2060 的原始演示。画面标注对应录制设备，保留程序实时面板，原速剪成 1080p60。输出帧率与游戏运行帧率分开看，也不把两台设备的读数混成一次性能测试。",
        "en": "The video combines valid clips from a fresh i9-13980HX / RTX 4060 Laptop capture and the delivered i7-9700 / RTX 2060 recording. Each scene identifies its capture machine and keeps the live HUD at original speed. Output is 1080p60; output rate and application frame rate are separate, and the two machines are not presented as one benchmark."
      }
    ],
    "code": {
      "label": {
        "zh": "源码节选",
        "en": "Source excerpt"
      },
      "value": "for(int t=0;t<result.steps;t++)\n{\n    if(t==120){full.Explode(87,94,17);active.Explode(87,94,17);}\n    if(t==180){full.Explode(277,82,17);active.Explode(277,82,17);}\n    // Alternate measurement order to reduce systematic scheduling bias.\n    if((t&1)==0){clock.Restart();full.Step(false);clock.Stop();result.fullMs+=clock.Elapsed.TotalMilliseconds;clock.Restart();active.Step(true);clock.Stop();result.activeMs+=clock.Elapsed.TotalMilliseconds;}\n    else {clock.Restart();active.Step(true);clock.Stop();result.activeMs+=clock.Elapsed.TotalMilliseconds;clock.Restart();full.Step(false);clock.Stop();result.fullMs+=clock.Elapsed.TotalMilliseconds;}\n    result.fullVisited+=full.Visited;result.activeVisited+=active.Visited;\n    for(int i=0;i<full.Cells.Length;i++)if(full.Cells[i]!=active.Cells[i]||!full.Velocity[i].Equals(active.Velocity[i])){same=false;break;}\n    if(t%12==0)yield return null;\n}\nresult.passed=same;result.fullHash=full.Hash().ToString(\"x16\");result.activeHash=active.Hash().ToString(\"x16\");",
      "source": {
        "file": "Assets/SandLab/SandApp.cs",
        "line": 233
      }
    },
    "references": [
      {
        "file": "Assets/SandLab/Editor/SandValidation.cs",
        "line": 1
      },
      {
        "file": "Assets/SandLab/Editor/SandHeavyValidation.cs",
        "line": 1
      }
    ]
  },
  {
    "id": "next-steps",
    "title": {
      "zh": "下一步要拆开的，是规则之间的依赖",
      "en": "The next constraint is dependency between rules"
    },
    "paragraphs": [
      {
        "zh": "目前最清楚的边界是地图大小和写入顺序。液体找出口可能横扫整行，活跃唤醒也比较保守；木结构碎片一多，会增加连通检测；画面变化时仍然提交整张纹理。扩大规模之前，先分别量这些部分，才能知道下一次改动该落在哪里。",
        "en": "The main scaling constraints are map size and write order. Liquid searches can traverse a row, wakes are conservative, fragmentation adds connectivity work, and changed frames upload the whole texture. Measuring each cost should guide the next change."
      },
      {
        "zh": "如果继续做多任务模拟，问题会变成分块边界的写入冲突、跨块反应和更新顺序如何保持一致。现有的全图对照可以继续作为基准。对我来说，这个项目最有意思的是让很多简单规则一起工作：水要流得出来，也得停得下来；木桥要能断，断了以后还要保持材料状态正确。",
        "en": "Parallel simulation would need an explicit design for boundary write conflicts, cross-chunk reactions and consistent ordering. The full-scan reference remains useful. The interesting part is making simple rules coexist: water must both flow and settle, and broken bridges must keep material state coherent."
      }
    ],
    "references": [
      {
        "file": "Assets/SandLab/SandSimulation.cs",
        "line": 170
      },
      {
        "file": "Assets/SandLab/WoodStructureJob.cs",
        "line": 20
      },
      {
        "file": "Assets/SandLab/SandApp.cs",
        "line": 132
      }
    ]
  }
];
