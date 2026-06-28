---
name: create-mock
description: 画面のモックを HTML で作成し、Playwright MCP でスクリーンショットを撮って docs/mock/ 配下に保存する。ユーザーが「画面のモックを作る」「モックアップを作成」「UIのイメージ/たたき台を作る」「画面のスクショ付きデザイン案がほしい」などと言ったときに使う。
---

# create-mock

画面モックを HTML で作成し、Playwright MCP でレンダリング結果のスクリーンショットを撮って `docs/mock/` 配下に保存する。実装前のデザイン合意・たたき台用。

## 成果物の保存先

```
docs/mock/<画面名（kebab-case）>/
  index.html          モック本体（単体で開ける自己完結 HTML）
  screenshot.png      Playwright MCP で撮影したスクショ
  README.md           （任意）画面の意図・想定操作のメモ
```

`docs/mock/` は Git 管理対象（設計資産としてチームで共有する）。

## 手順

1. **要件確認**: 対象画面名・主要要素・レイアウト・参考にする既存画面をユーザーに確認する。本プロジェクトの管理画面（`src/app/admin/...`）のトーンに合わせる。
2. **HTML 作成**: `docs/mock/<画面名>/index.html` を作成する。
   - **自己完結**させる（ビルド不要で開ける）。スタイルは Tailwind CDN（`<script src="https://cdn.tailwindcss.com"></script>`）を使い、本番の Tailwind 4 + shadcn(new-york/neutral) の見た目に寄せる。
   - アイコンが必要なら lucide のCDN等で代替してよい。
   - あくまでモック。実データではなくダミーデータで表現する。
3. **スクショ撮影（Playwright MCP）**:
   - Playwright MCP のツールで `file://` パスとして `index.html` を開く（例: `browser_navigate` に絶対パスの `file://.../docs/mock/<画面名>/index.html` を渡す）。
   - 必要に応じてビューポートを設定（デスクトップ幅。指定があればモバイルも）。
   - `browser_take_screenshot` でページ全体を撮影し、`docs/mock/<画面名>/screenshot.png` に保存する。
   - Playwright MCP が利用できない場合は、その旨を伝えて MCP の有効化（`.mcp.json` の playwright サーバー）を案内する。
4. **確認**: 保存したスクショを Read して表示し、レイアウト崩れがないか確認する。ユーザーにスクショを提示してフィードバックを得る。
5. **反映**: フィードバックがあれば HTML を修正して再撮影する。合意が取れたら実装（`create-ui-component` や各画面の実装）へ進む。

## 注意

- モックは設計検討用であり、本番コード（`src/`）には置かない。
- 複数バリエーションを比較する場合は `docs/mock/<画面名>/variant-a/`, `variant-b/` のように分ける。
