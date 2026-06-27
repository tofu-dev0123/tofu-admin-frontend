# ルール: API レイヤ / Route Handler

バックエンド API への新しい呼び出しを追加するときに従う。

## 全体の流れ

1. **URL を登録** — `src/lib/api/endpoint.ts` の `API_ENDPOINTS` に追加する。URL を直書きしない。動的 ID は関数で表現する（例: `put: (id: number) => \`/api/admin/posts/${id}\``）。
2. **型を定義** — リクエスト／レスポンスの型を `src/types/api/` に置く。
3. **呼び出し** — `src/lib/api/http.ts` の `get/post/put/patch/del/uploadFile` を使う。axios を直接呼ばない。
   - URL が `/api/admin/**` の場合は自動で Next.js Route 経由（`nextApiClient`）になる。それ以外は backend 直叩き（`apiClient`）。
4. **プロキシ Route を作成**（管理系のみ） — `src/app/api/admin/**/route.ts` に Route Handler を追加する。

## プロキシ Route Handler の定型

**純粋なプロキシは自前で fetch せず、共通ヘルパー `proxyRequest`（`src/lib/api/proxyRequest.ts`）を使う。** cookie 転送・URL/クエリ構築・body 判定（JSON / multipart）・エラー整形・fetch 失敗の捕捉・ログ出力をまとめて行う。

```ts
import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxyRequest';

export async function GET(req: NextRequest) {
  return proxyRequest(req, '/admin/posts/', { label: '投稿一覧取得' });
}
```

- 第2引数は **backend パス**（`/admin/...`。`/api` は付かない。`/api/admin` は **フロント側の Route パス**）。
- `label` はログ用の操作名。省略時は `METHOD path` になる。
- 動的ルートは `const { id } = await params;` してからパスに埋める。`proxyRequest` が method・query・body を自動で引き継ぐ。
- multipart（画像アップロード）も content-type を見て自動対応する。特別な処理は不要。

## ヘルパーを使わないケース

`auth/login` `auth/logout` は **cookie の set/delete があり純粋プロキシではない**ので、`proxyRequest` を使わず個別実装する。その場合も:

- `NEXT_PUBLIC_API_BASE_URL` 未設定チェック、`fetch` の try/catch（失敗時 502）、`!response.ok` 時の JSON フォールバックを必ず入れる。
- ログは `logger`（[[logging]]）を使う（成功は `info`、4xx は `warn`、5xx・接続失敗は `error`）。
- 成功・エラーとも **status を保ったまま** `NextResponse.json` で返す。

## 認証

- `/admin` 配下は `src/middleware.ts` が `auth_token` クッキーで保護している（`/admin/login` のみ除外）。新しい管理画面ルートを足してもこのガードが効く。
