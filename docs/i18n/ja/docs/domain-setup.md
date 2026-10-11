<a id="opencoast-custom-domain"></a>

# OpenCoast のカスタムドメイン

`opencoast.kaelux.dev` は Vercel プロジェクト `opencoast-web` に割り当てられています。DNS 解決、HTTPS、同一オリジン API のヘルス応答は 2026 年十月 10 日に確認されました。現在の Web デプロイにはこのホスト名のエイリアスがあります。旧 Vercel ホスト名はカスタムドメインへリダイレクトします。

<a id="dns-record"></a>

## DNS レコード

`kaelux.dev` DNS ゾーンの既存レコードは次のとおりです。

| 種類 | 名前 | 値 |
| --- | --- | --- |
| CNAME | `opencoast` | `d33e801daf5fd3d2.vercel-dns-017.com` |

これは 2026 年十月 5 日に Vercel のドメイン検証コマンドが返したプロジェクト固有のターゲットです。既存のネームサーバーを維持してください。同じホスト名に競合する A、AAAA、その他の CNAME レコードを設定してはいけません。

最初のエイリアス設定は DNS 設定前に失敗しました。現在は解決しており、公開地図と `https://opencoast.kaelux.dev/api/health` は HTTPS で応答します。共有リンクとブラウザーセッションには引き続きカスタムホスト名を使ってください。

<a id="application-origins"></a>

## アプリのオリジン

移行期間の API 本番 `WEB_ORIGIN` 値は次のとおりです。

```text
https://opencoast.kaelux.dev,https://opencoast-web.vercel.app
```

API は CORS とモデレーターの変更操作について、この一覧のオリジンとの厳密な一致のみを受け付けます。非公開 R2 バケットも、`infra/r2-cors.json` に記録されたとおり、両オリジンから `Content-Type` を伴う署名付き PUT アップロードを許可します。

API プロジェクトと Web プロジェクトの `/api` プロキシは既存アドレスを維持します。モデレーターのセッションはブラウザーのホスト名に限定されるため、カスタムドメインに移動した際は再ログインします。
