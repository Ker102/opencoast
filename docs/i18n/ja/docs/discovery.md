<a id="search-and-ai-discovery"></a>

# 検索と AI による発見

正規サイト：[opencoast.kaelux.dev](https://opencoast.kaelux.dev)。本番の変更は 2026 年十月 10 日、既存の Vercel Web プロジェクトにデプロイされました。地図、API プロキシ、公開情報ページはカスタムドメイン上で確認されました。

<a id="public-information"></a>

## 公開情報

- [概要](https://opencoast.kaelux.dev/about)：目的、掲載範囲、匿名性、著作者、ソースコード、ベースマップ帰属表示。
- [仕組み](https://opencoast.kaelux.dev/how-it-works)：閲覧、描画、出典、非公開受付、モデレーション。
- [証拠](https://opencoast.kaelux.dev/evidence)：アクセス状態、文書の検証、コミュニティ審査、日付、境界。

これらは静的で読める HTML ページです。ホームページにも JavaScript 読み込み前に有用な HTML と、JavaScript なしの場合の説明があります。インタラクティブ地図から三つのページへリンクしています。検索向け内容のために法律レコードや掲載範囲の主張を捏造していません。

`web/scripts/generate-discovery.mjs` は、ページ文面、正規 URL、説明、Open Graph と Twitter メタデータ、WebSite/WebPage/SoftwareApplication 構造化データ、sitemap.xml、robots.txt、llms.txt の元データです。Web の prebuild が決定論的に再生成します。元の内容を変更したら内容の日付も更新してください。共通の公開スタイルは `web/public/discovery.css` にあり、既存のアプリスタイルとは別です。共有画像は既存のアイデンティティから `tools/motion/render.cjs social` で生成します。

<a id="routing-and-indexing"></a>

## ルーティングとインデックス

旧ホスト `opencoast-web.vercel.app` はカスタムドメインに恒久リダイレクトします。公開情報ページにはそれぞれ正規 URL があります。未対応パスは地図アプリの外枠ではなく HTTP 404 を返します。API プロキシは引き続き既存の API プロジェクトへ転送します。

サイトマップは公開される四つの正規ページのみを列挙します。投稿、モデレーター、非公開受付ページは X-Robots-Tag noindex ヘッダーを返します。API と非公開ワークフローのパスはクローラーによる発見対象から除外されます。これらの制御はアプリの認証とは別です。robots.txt はプライバシーの境界ではありません。受付と証拠原本はアプリの既存アクセス制御で保護され続けます。

一般のクローラーポリシーは公開ページを許可します。OpenAI は、OAI-SearchBot が検索での発見を制御し、GPTBot の学習利用とは別だと説明しています。今回の変更では新しい学習オプトアウト方針を選択していません。[OpenAI 公式クローラー文書](https://developers.openai.com/api/docs/bots)をご覧ください。`llms.txt` は短く任意の読み取り補助であり、インデックスや順位を保証しません。

<a id="what-remains-outside-code"></a>

## コード以外に残ること

検索エンジンがページのクロール、インデックス、引用の時期を決めます。この実装は OpenCoast がインデックスされたことや順位を得たことを証明しません。所有者は Google Search Console と Bing Webmaster Tools でドメインを検証し、`https://opencoast.kaelux.dev/sitemap.xml` を提出できます。GitHub リポジトリや実際のプロジェクト記事から正規サイトへリンクしてください。掲載範囲が広がるにつれ公開説明と承認された地域情報を更新してください。

内容は読者に役立つ独自情報を重視する Google の方針に従います。法律上の主張、レビュー、評価を作り上げず、証拠と不確実性を説明します。[Google の有用なコンテンツの指針](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)をご覧ください。Vercel のルーティングには[文書化された設定](https://vercel.com/docs/project-configuration/vercel-json)を使います。

<a id="verification-on-10-october"></a>

## 十月 10 日の検証

- Web 本番ビルド、型検査、ソース整形のチェックは成功しました。
- 単体テストスイート：7 テスト成功。明示的なテスト用データベースでの実行を有効にしていなかったため、二つのデータベース統合テストはスキップされました。本番データはテストに使用していません。
- 公開ページ、クローラーファイル、共有画像は期待するコンテンツタイプで HTTP 200 を返しました。
- 非公開ワークフローページは noindex ヘッダー、未知パスは 404、旧ホストはカスタムドメインへの 308 リダイレクトを返しました。
- デスクトップ 1280px とモバイル 390px で横方向のはみ出しはなく、見出し、正規タグ、JSON-LD は正しく解析されました。JavaScript 無効時にもホームページを読めました。
- 動画出力は検査され、FFmpeg エラーなしで完全にデコードされました。それぞれ 40 秒、1280 × 720、30 fps、音声なしです。

ローカルの検証記録とスクリーンショットは Git の対象外の `artifacts/` フォルダーにあります。デプロイ ID：`dpl_7T2D8sR3wagtzm3CWHUiDVtGJfZR`。

デプロイ時の既存の依存関係監査では四つのアドバイザリーが報告されました。concurrently/shell-quote（開発ツール）、sharp（API の画像処理）、source-map-js です。今回の検索対応の変更でアプリ依存関係は追加しておらず、問題を修正したとも主張していません。保存された監査は `artifacts/dependency-audit.json` です。依存関係の修正には API と証拠処理の検証を含める必要があります。
