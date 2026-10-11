<a id="opencoast-custom-domain"></a>

# OpenCoast 自定义域名

`opencoast.kaelux.dev` 已分配给 Vercel 项目 `opencoast-web`。DNS 解析、HTTPS 及同源 API 健康响应于 2026 年十月 10 日核实。当前 Web 部署已为此主机名设置别名。旧 Vercel 主机名现在重定向到自定义域名。

<a id="dns-record"></a>

## DNS 记录

`kaelux.dev` DNS 区域中的现有记录为：

| 类型 | 名称 | 值 |
| --- | --- | --- |
| CNAME | `opencoast` | `d33e801daf5fd3d2.vercel-dns-017.com` |

这是 Vercel 域名验证命令在 2026 年十月 5 日返回的项目专用目标。请保留现有域名服务器。同一主机名不得存在冲突的 A、AAAA 或其他 CNAME 记录。

最初的别名尝试在 DNS 配置前失败。目前已解决：公共地图和 `https://opencoast.kaelux.dev/api/health` 都通过 HTTPS 响应。分享链接和浏览器会话请继续使用自定义主机名。

<a id="application-origins"></a>

## 应用来源

过渡期间，API 的生产 `WEB_ORIGIN` 值为：

```text
https://opencoast.kaelux.dev,https://opencoast-web.vercel.app
```

API 只接受此列表中的精确 origin 用于 CORS 和版主修改操作。私有 R2 bucket 也允许来自这两个 origin、带 `Content-Type` 的签名 PUT 上传，配置记录在 `infra/r2-cors.json`。

API 项目和 Web 项目的 `/api` 代理保留现有地址。版主会话以浏览器主机名为作用范围，因此切换到自定义域名时，版主须重新登录。
