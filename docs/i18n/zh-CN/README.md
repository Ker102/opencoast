<img src="../../../web/public/favicon.svg" width="56" height="56" alt="OpenCoast 海岸线标志">

<a id="opencoast--open-source-coastal-access-map"></a>

# OpenCoast — 开源海岸通行地图

[English](../../../README.md) · [Español](../es/README.md) · [简体中文](README.md) · [Français](../fr/README.md) · [日本語](../ja/README.md) · [Deutsch](../de/README.md) · [Português (Brasil)](../pt-BR/README.md)

<!-- translation-notice -->
本文译自英文文档；英文原文是权威来源。
<!-- /translation-notice -->

**海滩通行权、通往岸边的路线，以及支持这些信息的证据。**

**无需账号。无需登录。匿名浏览和贡献。**

OpenCoast 是一款开源 Web 应用，用于在地图上呈现经过社区审核的**公共海滩通行和海岸通行权**信息。人们可以绘制海岸区域、通往岸边的路径和出入口，添加描述、当地条件及来源，并匿名提交。每项提案都由版主审核后才会显示在公共地图上。

[浏览地图](https://opencoast.kaelux.dev/) · [参与贡献](CONTRIBUTING.md) · [审核方式](docs/moderation-policy.md) · [开发指南](docs/development.md) · [路线图](https://github.com/Ker102/opencoast/issues)

刚了解这个项目？请阅读 [OpenCoast 的用途](https://opencoast.kaelux.dev/about)、[如何使用地图及参与贡献](https://opencoast.kaelux.dev/how-it-works)，以及[证据标签的含义](https://opencoast.kaelux.dev/evidence)。这些公共页面无需 JavaScript 即可阅读。[搜索发现配置与验证](docs/discovery.md)介绍网站的规范 URL、站点地图及爬虫策略。[动态视频草稿与录制指南](../../../tools/motion/README.md)说明项目的可编辑视频。

[![CI](https://github.com/Ker102/opencoast/actions/workflows/ci.yml/badge.svg)](https://github.com/Ker102/opencoast/actions/workflows/ci.yml) · [代码许可证：MIT](../../../LICENSE)

> **项目尚处于早期阶段。** 地图支持全球导航和提交；已审核信息会逐地点积累。未标记的海岸表示**尚无经过审核的通行信息**，绝不表示禁止通行或保证可以通行。

<a id="why-opencoast-exists"></a>

## OpenCoast 为何存在

在地图上找到海滩，并不能回答这些问题：允许怎样的通行？有哪些条件？是否有经过审核的路线可以到达？哪些来源支持这些信息，又是什么时候核查的？

OpenCoast 将这些问题汇集到一张地图上。每条记录都把具体位置与描述、司法管辖区、通行状态、证据标签和审核历史联系起来。项目面向居民、海岸游客、社区地图贡献者、来源研究者，以及开发公益地图工具的开发者。

OpenCoast 由 **[Kristofer Jussmann (Ker102)](https://github.com/Ker102)** 创建，最初源于对黑山海岸通行问题的关注。其范围是全球性的；[首批黑山记录](https://github.com/Ker102/opencoast/issues/5)是一项来源审核工作，而非预先载入的一组法律结论。

<a id="anonymous-by-default"></a>

## 默认匿名

OpenCoast 希望让人们无需表明身份就能获取海岸通行信息。你可以浏览地图、提交地点、建议更正并跟踪审核，无需账号、登录、姓名或电子邮件地址。请保留私人回执链接，以便查看进度和回答版主的问题。

上传的原始证据仅供版主查看。只有另行批准并获得发布同意的图片才能公开显示。请勿在希望公开的描述或证据中加入个人信息。版主工具需要单独登录。

<a id="what-can-you-map"></a>

## 可以绘制什么？

| 记录类型 | 描述内容 | 单独记录的原因 |
| ------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **通行区域** | 海滩、潮间带或其他界定的海岸区域 | 条件可能只适用于特定区域，而非整条海岸线。 |
| **通往岸边的路线** | 路径、进入路线或海岸步道 | 区域的通行状态并不代表可以穿越通往该区域的土地。 |
| **出入口点位** | 入口、门、标志或其他相关位置 | 精确点位能够说明某项通行条件或观察适用于何处。 |

记录可以包含当地分类、允许的活动、条件、来源链接及观察。租赁海滩或特许经营区域可以用其具体条件及证据描述；OpenCoast 不会假定一个标签就决定了某地点的所有权利。

<a id="what-works-now"></a>

## 目前可用的功能

- **响应式全球地图：** 可在桌面或手机浏览器中浏览，使用 OpenFreeMap 提供的源自 OpenStreetMap 的底图。
- **地形 Focus 视图：** 中性的陆地颜色和山体阴影让海岸线清晰可读，同时突出经过审核的通行区域、路线和点位。
- **精确绘图工具：** 绘制和编辑点、线及多边形，调整顶点，撤销更改，并在提交前检查几何形状。
- **匿名贡献：** 无需创建账号即可提交信息或更正。保存私人回执链接以跟踪审核并回答版主的问题。
- **证据和日期：** 记录区分通行状态与证据强度，并将编辑日期与来源审核日期分开显示。
- **审核后发布：** 版主可以请求澄清，附上审计理由修改措辞，批准或拒绝提案，并查看私人证据。公开记录具有修订历史。
- **经过审核的区域与路线关联：** 版主可以把海岸区域与单独的接近路线记录关联。陆路已核实标签取决于关联路线当前的可见性、证据和通行状态。

<a id="how-to-read-coastal-access-information"></a>

## 如何理解海岸通行信息

<a id="access-status"></a>

### 通行状态

| 状态 | 在 OpenCoast 中的含义 |
| --------------- | --------------------------------------------------------------------------- |
| **允许** | 已审核的陈述表明，在该记录的范围内允许通行。 |
| **有条件** | 记录描述的通行受所列限制或条件约束。 |
| **受限** | 记录描述了通行限制。 |
| **有争议** | 陈述受到质疑，或可信证据相互矛盾。 |
| **未知** | 现有信息无法确定适用的通行规则。 |

请结合状态阅读描述和条件。通行标签是范围明确且经过审核的陈述，并非对所有活动或日期的保证。

<a id="evidence-strength"></a>

### 证据强度

**有文件支持**表示版主已对照陈述和几何形状核查至少一个链接的官方来源。说明应指出来源支持哪些内容，以及仍有哪些不确定性。

**经社区审核，未核实官方来源**表示版主批准展示信息，但没有核实官方来源。这类记录会带有可见标签；不可将其理解为经法律核实的通行权。

手绘边界标注为近似边界。编辑日期不代表进行了新的法律来源审核。完整审核标准见[审核政策](docs/moderation-policy.md)。

<a id="contribute-beach-access-information"></a>

## 贡献海滩通行信息

1. **在[在线地图](https://opencoast.kaelux.dev/)中找到地点。** 平移和缩放，或输入 `latitude, longitude`；地名搜索是[计划功能](https://github.com/Ker102/opencoast/issues/6)。
2. **选择 Add information**，绘制区域、路线或点。已有记录也接受更正建议。
3. **描述陈述：** 包括司法管辖区、适用时的当地分类、条件，以及你观察或阅读到的内容。
4. **添加来源和证据。** 强烈建议提供官方文件和直接链接，但并非必需。原始上传文件仅供版主查看；只有另行批准并获得发布同意的图片才能公开显示。
5. **保存私人回执链接。** 版主会审核提案，发布前可能要求澄清。

海岸通行报告应通过应用的审核流程提交。GitHub issue 用于软件缺陷、文档及功能提议。两种贡献方式见[贡献指南](CONTRIBUTING.md)。

<a id="frequently-asked-questions"></a>

## 常见问题

<a id="is-opencoast-a-worldwide-database-of-legally-verified-public-beaches"></a>

### OpenCoast 是全球经法律核实的公共海滩数据库吗？

OpenCoast 支持全球地图及来自不同司法管辖区的贡献。覆盖范围取决于提交并审核的记录，部分公开记录没有经核实的官方来源。它是一个早期信息项目，不是完整的法律数据库或法律权威机构。

<a id="does-a-blank-map-mean-a-beach-is-private-or-closed"></a>

### 空白地图表示海滩是私有或关闭的吗？

不是。这意味着此处没有展示经过审核的通行信息。底图上的公园、道路、海滩和陆地颜色是地理背景，不是 OpenCoast 的通行陈述。

<a id="can-i-submit-without-an-account-or-an-official-document"></a>

### 没有账号或官方文件也可以提交吗？

可以。公共提交无需账号，官方来源属于建议提供而非强制要求。每次提交仍须版主审核。如果官方来源未被核实，公开记录会说明这一点。

<a id="how-is-a-public-beach-connected-to-its-access-route"></a>

### 公共海滩如何与通行路线关联？

海滩区域和路线作为独立记录审核。版主必须在检查几何形状和来源后明确建立关联。OpenCoast 不会因为附近道路或路径看似通往海滩，就推断存在可通行路线。

<a id="does-submitting-to-opencoast-edit-openstreetmap"></a>

### 提交到 OpenCoast 会编辑 OpenStreetMap 吗？

不会。OpenCoast 把经过审核的通行记录存储在自己的数据库中。OpenFreeMap 提供源自 OpenStreetMap 的背景地图。这里的提交不会自动写入 OpenStreetMap。

<a id="is-the-coastal-access-data-open-data"></a>

### 海岸通行数据是开放数据吗？

软件依 MIT 许可证开源。托管数据库中的已批准记录尚无开放数据许可证；再次分发前请获取许可。私人证据及第三方来源材料有各自的权利。参见[许可和署名](#licensing-and-attribution)。

<a id="can-i-use-opencoast-on-my-phone"></a>

### 可以在手机上使用 OpenCoast 吗？

可以，通过响应式 Web 界面使用。绘图同时面向触摸和桌面输入设计。目前没有原生移动应用，[真机测试和无障碍审查](https://github.com/Ker102/opencoast/issues/4)仍在进行中。

<a id="help-build-opencoast"></a>

## 帮助建设 OpenCoast

以下领域都欢迎贡献：

- **当地知识及来源研究：** 通过地图提交范围准确的记录和更正。包括相关条款、来源日期及不确定性。
- **制图和用户体验：** 改善绘图、导航、清晰的图例、键盘操作及触摸交互。
- **软件和基础设施：** 协助地理空间查询、版主工具、证据处理、测试及部署可靠性。
- **文档：** 改善说明及开发者入门体验。欢迎翻译和本地化提议。

请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)、浏览[未关闭的 issue](https://github.com/Ker102/opencoast/issues)，或[提出改进建议](https://github.com/Ker102/opencoast/issues/new/choose)。安全问题请通过[私密漏洞报告](https://github.com/Ker102/opencoast/security/advisories/new)提交。

<a id="technology-and-repository-structure"></a>

## 技术和仓库结构

| 层 | 实现 | 位置 |
| -------------------- | ------------------------------------------------------ | -------------------- |
| Web 界面 | React、TypeScript、Vite、MapLibre GL JS、Terra Draw | [`web/`](../../../web/) |
| API 和审核 | Fastify、TypeScript、私人证据处理 | [`api/`](../../../api/) |
| 数据契约 | Zod schema 和 GeoJSON 类型 | [`shared/`](../../../shared/) |
| 空间存储 | PostgreSQL 和 PostGIS；托管于 Supabase | [`api/db/`](../../../api/db/) |
| 托管和证据 | Vercel Web/API 项目；私有 Cloudflare R2 存储 | [`infra/`](../../../infra/) |

<a id="run-locally"></a>

### 本地运行

当前 CI 使用 Node.js 24。安装 Node.js 24+、npm 和 Docker，然后执行：

```sh
git clone https://github.com/Ker102/opencoast.git
cd opencoast
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

打开 `http://localhost:5173`。本地数据库启动时没有任何断言通行权的记录。[开发指南](docs/development.md#run-locally)涵盖环境设置、端口、本地上传和版主账号创建。

<a id="checks"></a>

### 检查

参见[验证命令及隔离的数据库集成测试](docs/development.md#checks)。

<a id="hosted-deployment"></a>

### 托管部署

参见 [Vercel、Supabase/PostGIS 及私有 Cloudflare R2 配置](docs/development.md#hosted-deployment)。

<a id="current-release-limits"></a>

## 当前版本的限制

当前实现支持审核后发布，但在广泛推广前仍有几项任务：[上传和防滥用控制加固](https://github.com/Ker102/opencoast/issues/3)、[真机触摸和无障碍测试](https://github.com/Ker102/opencoast/issues/4)、[首批黑山记录的独立来源审核](https://github.com/Ker102/opencoast/issues/5)及[地名搜索](https://github.com/Ker102/opencoast/issues/6)。

没有任何覆盖整个司法管辖区的法律会自动应用于海滩。报告的通行阻碍和有文件记录的法律权利是不同的陈述。OpenCoast 的记录说明审核过的证据；它们不替代来源文件，也不确立法律边界。

参见[项目设计](../../../docs/plans/2026-09-24-opencoast-design.md)及[进度跟踪](../../../task.md)。`docs/design-reference` 中的图片是带有虚构示例陈述的视觉概念，不是地图数据。

<a id="licensing-and-attribution"></a>

## 许可和署名

- **软件：** [MIT](../../../LICENSE)，允许按照其条款使用、修改和再次分发。
- **托管通行记录：** 由运营者控制，尚无开放数据许可证。复用请与[维护者](https://github.com/Ker102)讨论。
- **证据和来源文件：** 保留其各自的权利和发布限制。上传的原始文件是私密的。
- **底图和地形：** 适用时，对 [OpenStreetMap](https://www.openstreetmap.org/copyright)、[OpenFreeMap](https://openfreemap.org/)、[OpenMapTiles](https://www.openmaptiles.org/) 及 [Mapterhorn](https://mapterhorn.com/attribution) 的署名保持在地图中可见。

文章、研究或软件复用请链接到 [GitHub 上的 OpenCoast](https://github.com/Ker102/opencoast)，并使用 [CITATION.cff](../../../CITATION.cff) 中的软件引用信息。引用软件并不核实任何具体的海岸通行陈述。

项目概览最后审核日期：**2026-10-06**。
