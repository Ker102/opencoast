<a id="opencoast-development-and-deployment"></a>

# OpenCoast の開発とデプロイ

[OpenCoast に戻る](../README.md) · [貢献ガイド](../CONTRIBUTING.md)

このガイドはローカル設定、検証、モデレーターの初期作成、ホスト環境の基盤を扱います。地図の目的、証拠ラベル、参加方法はリポジトリの README から確認してください。

<a id="run-locally"></a>

## ローカルで実行する

要件：Node.js 24+、npm、Docker。ローカル PostGIS データベースはポート `54329`、API は `4000`、Web アプリは `5173` を使用します。

```sh
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

`http://localhost:5173` を開きます。ローカルのモデレーターを作成するには、`MODERATOR_BOOTSTRAP_PASSWORD` に 12 文字以上の固有パスワードを設定して実行します。

```sh
npm run moderator:create -w api -- moderator@example.org
```

API はリポジトリの `.env` または `api/.env` から環境値を読み込みます。既定値を変える場合は `.env.example` をコピーしてください。ローカルアップロードは Git の対象外の `.local-evidence/` に保存されます。本番では Cloudflare R2 認証情報を設定し、`LOCAL_EVIDENCE_DIR` は未設定にする必要があります。

<a id="checks"></a>

## 検証

```sh
npm test
npm run format:check
npm run typecheck
npm run build
npm audit --audit-level=high
```

データベース統合テストは別の `opencoast_test` データベースを使い、実行後にそのデータベースだけを空にします。ローカルで作成し、そのデータベースにマイグレーションを適用してからテストを実行してください。

```sh
docker exec opencoast-postgis-1 createdb -U opencoast opencoast_test
```

マイグレーションと `INTEGRATION_TEST=1 npx vitest run api/src/app.integration.test.ts` の両方で `DATABASE_URL=postgres://opencoast:opencoast_local@localhost:54329/opencoast_test` を設定してください。他のデータベース名はテストが拒否します。

<a id="hosted-deployment"></a>

## ホスト環境へのデプロイ

ホスト環境は専用の Vercel [Web](https://opencoast.kaelux.dev)・[API](https://opencoast-api.vercel.app/health) プロジェクト、PostGIS を有効にした Supabase PostgreSQL、**非公開** Cloudflare R2 バケットを使います。各 Vercel プロジェクトのルートディレクトリを `web` または `api` に設定してください。Web プロジェクトの `web/vercel.ts` が `/api/*` を API プロジェクトへプロキシし、モデレーターの Cookie をファーストパーティに保ちます。Web プロジェクトの `VERCEL_API_ORIGIN` に API の HTTPS オリジンを設定してください。データベースや R2 の認証情報を Web ビルドに公開しないでください。DNS とオリジン設定は[カスタムドメイン設定](domain-setup.md)をご覧ください。

API の環境変数：

| 変数 | 用途 |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `DATABASE_URL` | PostGIS を有効にした Supabase トランザクションプーラーの接続文字列 |
| `DATABASE_SSL_CA_B64` | TLS 検証用の Base64 エンコードされた Supabase ルート CA 証明書 |
| `WEB_ORIGIN` | CORS とモデレーター変更操作の検証に使う、カンマ区切りの厳密な Web オリジン |
| `S3_ENDPOINT` | Cloudflare R2 アカウントのエンドポイント |
| `S3_REGION` | R2 のリージョン。通常は `auto` |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | 証拠バケットに限定した R2 認証情報 |
| `S3_BUCKET` | 非公開証拠バケット名 |
| `COOKIE_SECURE` | 本番では既定でセキュア |

API を起動する前に `api/db/*.sql` をファイル名順にデータベースで実行するか、`DATABASE_URL` を設定した信頼できる環境で `npm run db:migrate -w api` を実行してください。R2 は非公開に保ちます。原本アップロードに公開オブジェクト URL を与えてはいけません。R2 CORS は厳密な Web オリジンと、`Content-Type` を伴う `PUT` に設定してください（例は `infra/r2-cors.json`）。ホスト環境での証拠アップロードは有効期間の短い署名付き PUT URL を使い、API が保存ファイルを検証してから非公開の最終キーへコピーします。`MODERATOR_BOOTSTRAP_PASSWORD` を一時的な秘密としてモデレーターアカウントを作成し、その後削除してください。

公開ベースマップ URL は `VITE_MAP_STYLE_URL` で置き換えられます。OpenFreeMap は初期開発には適していますが、サービス保証はありません。広範な宣伝前に監視と費用を確保したタイル提供者を手配してください。現在の地図は地名検索ではなく、座標による移動（`latitude, longitude`）を受け付けます。
