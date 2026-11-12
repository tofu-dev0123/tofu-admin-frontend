# ルール: 状態管理の使い分け

状態をどこに持たせるか迷ったときに従う。

## 使い分け

| 種類                      | 使う場面                                                        | 実装                                                |
| ------------------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| **useState / useReducer** | 単一コンポーネント・単一フック内で完結する状態                  | React 標準                                          |
| **React Context**         | 1つの画面ツリー内で複数コンポーネントに跨る状態（画面ローカル） | `src/contexts/admin/...`（例: `PostEditorContext`） |
| **zustand**               | アプリ全体で共有するグローバル状態                              | `src/stores/*`（例: `toastStore`）                  |
| **TanStack Query**        | バックエンドから取得するデータ（サーバー状態）のキャッシュ      | `use*Query` フック（例: `usePostsQuery`）           |

## サーバー状態（TanStack Query）

- API から取得するデータは state に複製せず、`src/hooks/admin/<feature>/use*Query.ts` の `useQuery` フックで取得する。クエリキーは `src/lib/api/queryKeys.ts` に集約し、直書きしない。
- 既定値は `src/lib/api/queryClient.ts`（`staleTime` 30 秒・フォーカス時再取得・リトライ 1 回）。取得エラーのログは `QueryCache` で一括記録するので、個別に `logger.error` しない。表示は `data` が無いときだけ分岐する（`isError` なら `SectionError`、それ以外はスケルトン）。取得済みデータがある状態での再取得失敗では `isError` が立っても取得済みデータを表示し続ける。
- 更新（POST/PUT/PATCH/DELETE）は既存の API ラッパで行い、成功時に関連キーを `queryClient.invalidateQueries` で無効化する（例: 記事の作成・更新・削除 → `queryKeys.posts.all`）。`window.location.reload()` で反映しない。
- 取得データを受け取るフック（例: `useTimelines`・`useProductList`）は一覧を props で受け、手元の state にコピーしない。フォームの初期値として使う場合のみ `useState(initial)` で取り込む。
- 編集画面の記事詳細のように「初期データを 1 度だけ取り込む」用途では、古いキャッシュで初期化しないよう `staleTime: 0`・自動再取得なしにする（`usePostDetailQuery` 参照）。
- QueryClient は `(dashboard)/layout.tsx` の `QueryProvider` で供給する。ログアウトでレイアウトを抜けるとキャッシュごと破棄される。

## 指針

- まず最小スコープ（ローカル state）から始め、共有が必要になったら Context、アプリ横断なら zustand へ上げる。安易にグローバルへ置かない。
- **zustand ストア**は `create<State>()` で型を明示し、`set` で更新する。状態とアクション（更新関数）を同じストアに定義する。実例: `src/stores/toastStore.ts`。
- **Context** は画面単位の状態・アクション・ref をまとめて供給する。Context へのアクセスは専用フック（例: `usePostEditorContext`）経由にする。
- 派生値は state に持たず、render 中に計算する（prop → state のコピーを避ける。[[react-hooks]] 参照）。
