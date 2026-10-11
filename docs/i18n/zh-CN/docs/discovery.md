<a id="search-and-ai-discovery"></a>

# 搜索与 AI 发现

规范网站：[opencoast.kaelux.dev](https://opencoast.kaelux.dev)。生产更改于 2026 年十月 10 日部署到现有 Vercel Web 项目。地图、API 代理和公共信息页面已在自定义域名上检查。

<a id="public-information"></a>

## 公共信息

- [关于](https://opencoast.kaelux.dev/about)：用途、覆盖范围、匿名性、作者、源代码及底图署名。
- [使用方式](https://opencoast.kaelux.dev/how-it-works)：浏览、绘图、来源、私人回执及审核。
- [证据](https://opencoast.kaelux.dev/evidence)：通行状态、文件核实、社区审核、日期及边界。

这些是可阅读的静态 HTML 页面。首页在 JavaScript 加载前也包含有用的 HTML，并提供无 JavaScript 说明。交互地图链接到这三个页面。搜索内容没有捏造法律记录或覆盖范围陈述。

`web/scripts/generate-discovery.mjs` 是页面文案、规范 URL、描述、Open Graph 和 Twitter 元数据、WebSite/WebPage/SoftwareApplication 结构化数据，以及 sitemap.xml、robots.txt 和 llms.txt 的来源。Web prebuild 以确定性的方式重新生成它们。底层内容改变时，请更新内容日期。共享公共样式位于 `web/public/discovery.css`；现有应用样式保持独立。社交分享图片通过 `tools/motion/render.cjs social` 基于现有视觉标识生成。

<a id="routing-and-indexing"></a>

## 路由和索引

旧主机 `opencoast-web.vercel.app` 永久重定向到自定义域名。公共信息页面各有规范 URL。不支持的路径返回 HTTP 404，而非地图应用外壳。API 代理仍转发到现有 API 项目。

站点地图仅列出四个公共规范页面。贡献、版主和私人回执页面返回 X-Robots-Tag noindex 响应头。API 和私密工作流路径不参与爬虫发现。这些控制与应用认证分开；robots.txt 不是隐私边界。回执和原始证据仍受应用现有访问控制保护。

一般爬虫策略允许访问公共页面。OpenAI 文档说明，OAI-SearchBot 控制搜索发现，与 GPTBot 的训练用途分开。本次更改没有选择新的训练退出策略。参见 [OpenAI 官方爬虫文档](https://developers.openai.com/api/docs/bots)。`llms.txt` 是简短、可选的阅读辅助，不保证索引或排名。

<a id="what-remains-outside-code"></a>

## 代码以外仍需处理的事项

搜索引擎决定何时抓取、索引和引用页面。这一实现不能证明 OpenCoast 已被索引或获得排名。所有者可以在 Google Search Console 和 Bing Webmaster Tools 验证域名，并提交 `https://opencoast.kaelux.dev/sitemap.xml`。从 GitHub 仓库及真实项目文章链接到规范网站。随着覆盖范围增长，持续更新公共说明及已批准的当地信息。

内容遵循 Google 对为读者提供实用、原创信息的重视。它解释证据和不确定性，不编造法律陈述、评论或评分。参见 [Google 实用内容指南](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)。Vercel 路由使用其[文档规定的配置](https://vercel.com/docs/project-configuration/vercel-json)。

<a id="verification-on-10-october"></a>

## 十月 10 日的验证

- Web 生产构建、类型检查及源代码格式检查通过。
- 单元测试套件：7 项测试通过。两项数据库集成测试因未启用显式测试数据库运行而跳过；测试未使用生产数据。
- 公共页面、爬虫文件及分享图片返回 HTTP 200，内容类型符合预期。
- 私密工作流页面返回 noindex 响应头；未知路径返回 404；旧主机返回指向自定义域名的 308 重定向。
- 桌面 1280px 和移动端 390px 下没有水平溢出；标题、规范标签及 JSON-LD 解析正确。禁用 JavaScript 时首页仍可阅读。
- 导出视频经过检查并完整解码，没有 FFmpeg 错误；每个视频为 40 秒、1280 × 720、30 fps，无音频。

本地验证凭证和截图位于被忽略的 `artifacts/` 文件夹。部署 ID：`dpl_7T2D8sR3wagtzm3CWHUiDVtGJfZR`。

该部署已有的依赖审计报告了四项安全通告：concurrently/shell-quote（开发工具）、sharp（API 图像处理）及 source-map-js。本次发现功能更改未添加应用依赖，也不声称这些问题已修复。保存的审计位于 `artifacts/dependency-audit.json`；依赖修复应包括 API 及其证据处理检查。
