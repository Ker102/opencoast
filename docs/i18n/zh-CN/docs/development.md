<a id="opencoast-development-and-deployment"></a>

# OpenCoast 开发和部署

[返回 OpenCoast](../README.md) · [贡献指南](../CONTRIBUTING.md)

本指南涵盖本地设置、验证、版主初始化和托管基础设施。了解地图用途、证据标签和参与方式，请从仓库 README 开始。

<a id="run-locally"></a>

## 本地运行

要求：Node.js 24+、npm 和 Docker。本地 PostGIS 数据库使用端口 `54329`；API 使用 `4000`；Web 应用使用 `5173`。

```sh
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

打开 `http://localhost:5173`。要创建本地版主，请将 `MODERATOR_BOOTSTRAP_PASSWORD` 设置为至少 12 个字符的唯一密码，然后运行：

```sh
npm run moderator:create -w api -- moderator@example.org
```

API 从仓库 `.env` 或 `api/.env` 加载环境值；如需更改默认值，请复制 `.env.example`。本地上传存储于被忽略的 `.local-evidence/`。生产环境必须配置 Cloudflare R2 凭据，并保持 `LOCAL_EVIDENCE_DIR` 未设置。

<a id="checks"></a>

## 检查

```sh
npm test
npm run format:check
npm run typecheck
npm run build
npm audit --audit-level=high
```

数据库集成测试使用独立的 `opencoast_test` 数据库，并在运行后只清空这个数据库。先在本地创建它，对它执行迁移，再运行测试：

```sh
docker exec opencoast-postgis-1 createdb -U opencoast opencoast_test
```

迁移及 `INTEGRATION_TEST=1 npx vitest run api/src/app.integration.test.ts` 都须设置 `DATABASE_URL=postgres://opencoast:opencoast_local@localhost:54329/opencoast_test`。测试拒绝任何其他数据库名称。

<a id="hosted-deployment"></a>

## 托管部署

托管部署使用独立的 Vercel [Web](https://opencoast.kaelux.dev) 和 [API](https://opencoast-api.vercel.app/health) 项目、启用 PostGIS 的 Supabase PostgreSQL，以及**私有** Cloudflare R2 bucket。将各 Vercel 项目的根目录设为 `web` 或 `api`。Web 项目的 `web/vercel.ts` 将 `/api/*` 代理到 API 项目，使版主 cookie 保持为第一方 cookie。在 Web 项目中把 `VERCEL_API_ORIGIN` 设为 API 的 HTTPS origin。不要向 Web 构建暴露数据库或 R2 凭据。DNS 和 origin 配置见[自定义域名设置](domain-setup.md)。

API 环境：

| 变量 | 用途 |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `DATABASE_URL` | 启用 PostGIS 的 Supabase 事务连接池连接字符串 |
| `DATABASE_SSL_CA_B64` | Base64 编码的 Supabase 根 CA 证书，用于验证 TLS |
| `WEB_ORIGIN` | 逗号分隔的精确 Web origin，用于 CORS 和版主修改操作检查 |
| `S3_ENDPOINT` | Cloudflare R2 账号端点 |
| `S3_REGION` | R2 区域，通常为 `auto` |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | 限制为证据 bucket 的 R2 凭据 |
| `S3_BUCKET` | 私有证据 bucket 名称 |
| `COOKIE_SECURE` | 生产环境默认采用安全设置 |

启动 API 前按文件名顺序对数据库运行 `api/db/*.sql`，或在具有 `DATABASE_URL` 的可信环境中运行 `npm run db:migrate -w api`。保持 R2 私有：原始上传绝不会获得公共对象 URL。将 R2 CORS 配置为精确的 Web origin 和带 `Content-Type` 的 `PUT`（示例在 `infra/r2-cors.json`）。托管证据上传使用短期签名 PUT URL；随后 API 验证存储文件，再复制至私有最终键。使用 `MODERATOR_BOOTSTRAP_PASSWORD` 作为临时密钥创建版主账号，然后删除该密钥。

可以通过 `VITE_MAP_STYLE_URL` 替换公共底图 URL。OpenFreeMap 适合早期开发，但没有服务保证；广泛推广前请安排监控和有资金支持的地图瓦片服务商。目前地图支持坐标导航（`latitude, longitude`），而非地名搜索。
