# ルール: ログ設計

ログ出力を書くときに従う。

## 原則

- **`console` を直接呼ばない。`logger`（`src/lib/logger.ts`）を使う。**

  ```ts
  import { logger } from '@/lib/logger';

  logger.debug('詳細トレース', data);
  logger.info('処理完了');
  logger.warn('想定外だが継続可能');
  logger.error('処理失敗', error);
  ```

- 例外: `src/lib/logger.ts` 内部のみ `console` を使ってよい（ラップ実装のため）。

## レベルの使い分け

| レベル  | 用途                 | 本番出力 |
| ------- | -------------------- | -------- |
| `debug` | 開発時の詳細トレース | × 抑制   |
| `info`  | 正常系の節目         | × 抑制   |
| `warn`  | 異常だが継続可能     | ○        |
| `error` | 失敗・例外           | ○        |

- 本番（`NODE_ENV === 'production'`）では `debug` / `info` を抑制し、`warn` / `error` のみ出力する。
- 将来 Sentry 等への外部送信が必要になったら `logger.ts` の `output` 関数を拡張する（呼び出し側は変更不要）。

## 注意

- ログに**機微情報**（パスワード・トークン・クッキー・個人情報）を出さない。
- ユーザーへの通知は別物。エラー表示は toast / `showError`（[[error-handling]]）を使う。
