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
   - `useQuery` / `useQueryClient` を使うフックは `createQueryWrapper()`（`src/test/queryWrapper.tsx`、リトライ無効）の `wrapper` を `renderHook` に渡す。取得完了は `waitFor` で待つ。
   - 更新後の無効化は `vi.spyOn(queryClient, 'invalidateQueries')` で、期待するクエリキー（`queryKeys.*`）で呼ばれることを検証する。
3. **コンポーネント** — ロール・テキストでクエリし、ユーザー視点の挙動を検証する。実装詳細（クラス名の網羅等）に依存しすぎない。実例: `src/components/ui/button.test.tsx`。

## テスト設計（`/implement` の計画に含める形式）

```
### テスト設計
| 対象 | ケース | 入力 / 操作 | 期待値 |
| ---- | ------ | ----------- | ------ |
| `getErrorMessage` | details があれば各 message を返す | `{ details: [{ message: 'a' }] }` | `['a']` |

UT 対象外: <対象> — <理由（例: 見た目のみのコンポーネントのため目視確認）>
```

- 観点: 正常系 / 異常系（不正入力・API エラー）/ 境界値（0・空・上限ちょうど・上限 +1）
- バグ改修は、不具合を再現するテストを先に書き、失敗することを確認してから修正する

## 方針

- ロジックはフックに寄せてある（[[component-logic-separation]]）ので、フック単体テストを中心に据える。
- 外部依存（API・時刻・乱数）はモックして決定論的にする。
- テストは `pnpm test` が緑、`pnpm type` が通る状態を保つ。
