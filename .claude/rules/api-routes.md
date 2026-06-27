# ルール: API レイヤ / Route Handler

バックエンド API への新しい呼び出しを追加するときに従う。

## 全体の流れ

1. **URL を登録** — `src/lib/api/endpoint.ts` の `API_ENDPOINTS` に追加する。URL を直書きしない。動的 ID は関数で表現する（例: `put: (id: number) => \`/api/admin/posts/${id}\``）。
2. **型を定義** — リクエスト／レスポンスの型を `src/types/api/` に置く。
3. **呼び出し** — `src/lib/api/http.ts` の `get/post/put/patch/del/uploadFile` を使う。axios を直接呼ばない。
   - URL が `/api/admin/**` の場合は自動で Next.js Route 経由（`nextApiClient`）になる。それ以外は backend 直叩き（`apiClient`）。
4. **プロキシ Route を作成**（管理系のみ） — `src/app/api/admin/**/route.ts` に Route Handler を追加する。

## プロキシ Route Handler の定型

既存の `src/app/api/admin/posts/route.ts` に倣う。必須要素:

- `const cookieStore = await cookies();` で受け取ったクッキーを取得し、backend への `fetch` に `Cookie` ヘッダーとして転送する（認証はクッキーベース）。
- `const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;` を読み、未設定なら `throw new Error('Backend URL is not configured');`。
- backend のパスは `${backendUrl}/admin/...`（`/api` は付かない。`/api/admin` は **フロント側の Route パス**）。
- エラー時は **status を保ったまま** JSON で返す。backend のレスポンスが JSON でないこともあるので `try { JSON.parse } catch { { error: ... } }` でフォールバックする。
- 成功時も `NextResponse.json(data, { status: response.status })` で status を維持する。
- クエリ文字列は `req.nextUrl.searchParams` から組み立てる。POST/PUT/PATCH の body は `await req.text()` で素通しする。

## 認証

- `/admin` 配下は `src/middleware.ts` が `auth_token` クッキーで保護している（`/admin/login` のみ除外）。新しい管理画面ルートを足してもこのガードが効く。
