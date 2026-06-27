# ルール: エラーハンドリング

API 呼び出しや非同期処理のエラーを扱うときに従う。

## 基本パターン

API 呼び出しは `try/catch` で囲み、catch では **`exceptErrorHandling`**（`src/lib/utils/exceptErrorHandling.ts`）に委譲する。

```ts
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';

try {
  const res = await post<MeResponse>(API_ENDPOINTS.account.me);
  // ...
} catch (error) {
  exceptErrorHandling(error, showError);
}
```

- `exceptErrorHandling(error, showError)` が axios エラーかを判定し、`getErrorMessage` で `message` または `details[].message` を抽出して `showError` に渡す。axios 以外のエラーは共通文言（`MESSAGES.errors.common.failed`）を表示する。
- `catch (error: unknown)` で受ける。`any` は禁止。

## ユーザーへの通知

- エラー文言は `showError: (message: string[]) => void` で受け渡す。フックは props でこれを受け取る形にする（例: `useAccountMe({ showError })`）。
- 文言は **`src/constants/messages.ts`（`MESSAGES`）** に集約する。画面にハードコードしない。
- トースト表示は `useToastStore`（[[state-management]]）を使う。

## ログ

- 例外の記録は `console` 直書きではなく `logger`（[[logging]]）を使う。ユーザー通知（toast）とログ出力は役割が別。
