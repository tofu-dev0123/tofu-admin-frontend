# CLAUDE.md

個人サイト（tofu）の **管理画面（admin-frontend）** リポジトリ。Claude Code が一貫した品質で支援するためのプロジェクト規約をまとめる。

## プロジェクト概要

- ブログ記事の作成・編集・公開などを行う管理画面 SPA（管理者専用）。
- バックエンド API への通信は **Next.js の API Route 経由でプロキシ** する構成（認証クッキーをサーバー側で転送）。
- 公開側サイトは別リポジトリ（frontend）。本リポジトリは `/admin` 配下のみを扱う。

## 技術スタック

- Next.js 16（App Router / React Server Components）
- React 19 / TypeScript（strict）
- Tailwind CSS 4
- shadcn/ui（style: new-york / baseColor: neutral / icon: lucide-react）+ Radix UI
- 状態管理: zustand（グローバル）/ React Context（画面ローカル）
- フォーム: react-hook-form
- HTTP: axios（`src/lib/api` のラッパ経由）
- Markdown: react-markdown / remark-gfm / rehype-highlight、エディタは CodeMirror、図は mermaid

## 開発環境（nix + direnv + pnpm）

- Node.js / pnpm は **nix flake**（`flake.nix`）の devShell で供給する。グローバルに node を入れる必要はない。
- **direnv** を使う。初回のみ `direnv allow` を実行すると、プロジェクトに入った時点で node/pnpm が PATH に載る。
- direnv を使わない場合は `nix develop` でシェルに入ってからコマンドを実行する。
- パッケージマネージャは **pnpm**（npm/yarn は使わない）。ロックファイルは `pnpm-lock.yaml`。
- `.npmrc` で `verify-deps-before-run=false`（pnpm の run/exec 前依存検証が nix の libuv でクラッシュするため無効化）。

## 主要コマンド

direnv allow 済みなら下記をそのまま、未使用なら `nix develop --command <cmd>` で実行する。

| コマンド          | 用途                                  |
| ----------------- | ------------------------------------- |
| `pnpm install`    | 依存インストール                      |
| `pnpm dev`        | 開発サーバー起動                      |
| `pnpm build`      | 本番ビルド                            |
| `pnpm lint`       | ESLint                                |
| `pnpm format`     | Prettier 整形（`prettier --write .`） |
| `pnpm type`       | 型チェック（`tsc --noEmit`）          |
| `pnpm test`       | テスト実行（Vitest、1回）             |
| `pnpm test:watch` | テスト監視実行（Vitest）              |

> ファイル編集後は PostToolUse フックで対象ファイルに `prettier --write` + `eslint --fix` が自動実行される（`.claude/settings.json`、`direnv exec` 経由でローカルバイナリを実行）。コミット前には `pnpm type` で型エラーがないことを確認する。

## ディレクトリ規約（`src/` 配下）

```
app/
  admin/(auth)/login/        ログイン画面
  admin/(dashboard)/...      home / posts / account など管理画面（ルートグループでレイアウト分離）
  api/...                    バックエンドへのプロキシ Route Handler（/api/admin/** と /api/auth/**）
components/
  ui/                        shadcn/ui コンポーネント（このディレクトリは shadcn 規約に従う）
  common/ , toast/           独自共通コンポーネント
hooks/admin/<feature>/       画面・機能ごとのカスタムフック（use*.ts）
contexts/admin/...           画面ローカルの Context
stores/                      zustand ストア
lib/api/                     http.ts（GET/POST/... ラッパ）, client.ts（axios), endpoint.ts（URL定義）
lib/utils/ , lib/utils.ts    ユーティリティ（cn など）
constants/ , types/          定数 / 型（types/api と types/admin に分類）
assets/images/               画像アセット
middleware.ts                /admin 配下の認証ガード（auth_token クッキー）
```

新規ファイルは上記の所在ルールに従って配置する。機能を増やすときは `hooks/admin/<feature>/` 配下にフックを切り出すのが基本パターン。

## 詳細ルール（`.claude/rules/`）

下表の作業をするときは、**着手前に対応するルールファイルを読む**こと。CLAUDE.md には要点のみ、詳細は各ファイルにある。

| 作業                                                    | 読むファイル                                  |
| ------------------------------------------------------- | --------------------------------------------- |
| API 呼び出し・Route Handler を追加/変更する             | `.claude/rules/api-routes.md`                 |
| フック（`use*`）を書く・直す、lint(react-hooks)で詰まる | `.claude/rules/react-hooks.md`                |
| 状態の置き場所（useState / Context / zustand）を決める  | `.claude/rules/state-management.md`           |
| エラー処理・ユーザー通知を実装する                      | `.claude/rules/error-handling.md`             |
| ログ出力を書く                                          | `.claude/rules/logging.md`                    |
| コンポーネントを書く（ロジックの切り出し方）            | `.claude/rules/component-logic-separation.md` |
| テストを書く・追加する                                  | `.claude/rules/testing.md`                    |

## コードスタイル

Prettier（`.prettierrc.json`）/ ESLint（`eslint.config.mjs`）が正。手書きで合わせるより整形に任せる。

- **インポートは `@/*` エイリアスのみ。`../` の相対インポートは ESLint で禁止**（`no-restricted-imports`）。
- `any` 禁止（`@typescript-eslint/no-explicit-any: error`）。型が不明なら `unknown` + 絞り込み。
- Prettier: セミコロンあり / シングルクォート / `trailingComma: es5` / 80桁 / 2スペース / アロー関数の引数は常に括弧。
- コメントは**日本語**で簡潔に（既存コードに合わせる）。
- コンポーネントは **named export**、カスタムフックは **default export**（既存慣習）。
- クライアントコンポーネント／フックの先頭には `'use client';` を付ける。
- クラス結合は `cn()`（`@/lib/utils`）を使う。

## API レイヤの使い方

1. URL は `src/lib/api/endpoint.ts` の `API_ENDPOINTS` に追加（直書きしない）。
2. 呼び出しは `src/lib/api/http.ts` の `get/post/put/patch/del/uploadFile` を使う。
   - `/api/admin/**` 宛は自動で Next.js Route 経由（`nextApiClient`）になる。
3. 管理系の新エンドポイントは `src/app/api/admin/**/route.ts` にプロキシ Route を作成する。
   - 既存 Route（例: `app/api/admin/posts/route.ts`）の形に倣う: `cookies()` でクッキー転送 / `NEXT_PUBLIC_API_BASE_URL` 未設定なら throw / エラーは status を保ったまま JSON で返す。
4. リクエスト／レスポンスの型は `src/types/api/` に定義する。

## ブランチ・コミット規約

- ベースブランチは **develop**（開発の最新版・統合ブランチ）。作業ブランチはここから切る。
- 環境ブランチへの昇格でデプロイする（環境ブランチ運用 / デプロイ基盤は Vercel）。
  - `develop → staging` の PR をマージ → **dev 環境**へデプロイ。
  - `staging → production` の PR をマージ → **本番環境**へデプロイ。
  - `production` への push をトリガーに Actions が `main` を fast-forward 同期する（**main = 本番ミラー**。GitHub デフォルトブランチ）。`.github/workflows/sync-main.yml`。
- ブランチ命名は `feature/issue#<番号>`（Issue 起点）。
- CI（`.github/workflows/ci.yml`）は **develop への PR** で lint / type / test / build を実行する。昇格 PR（staging / production 宛）は検証済みコードの移動なので CI は回さない。
- コミットメッセージに `Co-Authored-By: Claude` は付けない。PR 本文に Claude のフッターを付けない。
- コミットは明示的に依頼されたときのみ作成する。

## プロジェクト固有スキル

- `create-ui-component`: shadcn/ui 規約に沿った UI コンポーネント雛形を生成。
- `create-mock`: 画面モックを HTML で作成し、Playwright MCP でスクショを撮って `docs/mock/` に保存。

## 環境変数

- `NEXT_PUBLIC_API_BASE_URL`: バックエンド API のベース URL（クライアント・API Route 双方で参照）。`.env.example` 参照。
