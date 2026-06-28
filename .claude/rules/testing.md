# ルール: テスト設計

テストを書く・追加するときに従う。

## スタック

- **Vitest** + **React Testing Library**（RTL）。環境は jsdom。
- 設定: `vitest.config.ts`（`globals: true` / `environment: 'jsdom'` / `setupFiles: ['./vitest.setup.ts']`）。
- jest-dom マッチャ（`toBeInTheDocument` 等）は `vitest.setup.ts` で読み込み済み。
- 実行: `pnpm test`（CI 用・1回実行）/ `pnpm test:watch`（監視）。

## 置き場所・命名

- テストは対象ファイルの隣に置く。`*.test.ts`（ロジック）/ `*.test.tsx`（コンポーネント）。
- `describe` / `it` / `expect` は `vitest` から明示 import する（`import { describe, it, expect } from 'vitest';`）。
- import は `@/*` エイリアスを使う（`../` 禁止）。

## 何をテストするか（優先度順）

1. **純粋なユーティリティ・ロジック** — `src/lib/utils/*`、整形・変換・バリデーション。入出力が決まり最も費用対効果が高い。実例: `src/lib/utils/getErrorMessage.test.ts`。
2. **カスタムフック** — 状態遷移・分岐。RTL の `renderHook` を使う。API はモックする（`vi.mock` で `@/lib/api/http` を差し替え）。
3. **コンポーネント** — ロール・テキストでクエリし、ユーザー視点の挙動を検証する。実装詳細（クラス名の網羅等）に依存しすぎない。実例: `src/components/ui/button.test.tsx`。

## 方針

- ロジックはフックに寄せてある（[[component-logic-separation]]）ので、フック単体テストを中心に据える。
- 外部依存（API・時刻・乱数）はモックして決定論的にする。
- テストは `pnpm test` が緑、`pnpm type` が通る状態を保つ。
