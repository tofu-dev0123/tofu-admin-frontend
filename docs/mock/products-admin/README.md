# products-admin

公開サイトに掲載する制作物・プロダクトを管理する画面のモック。

## 対応バックエンド API

- `GET /admin/products` / `POST /admin/products` / `GET /admin/products/{id}` / `PUT /admin/products/{id}` / `DELETE /admin/products/{id}`

## 画面構成

- **統計**: 総数 / 公開中 / 非公開のサマリ。
- **一覧テーブル**: `title`・`description`・`tags`（チップ表示）・`link_url`（外部リンク）・`published`（トグル）・`sort_order`（ドラッグ並び替え）・操作（編集/削除）。非公開は「下書き」バッジ。
- **編集スライドオーバー（ドロワー）**: `title`（必須 / max 255）・`description`（任意 / max 2000）・`link_url`（任意 / max 500）・`tags`（チップ入力 / 最大20個・各30文字）・`published`（トグル）・`sort_order`。`screenshot-drawer.png` 参照。

## API 上の注意（実装時に反映）

- `tags` は **リクエストは `string[]`（タグ名）／レスポンスは `Tag[]`（`{ tag_id, name, slug }`）** の非対称。
- `description` / `link_url` は空文字を送ると `null` に正規化される。
- 作成/更新は HTTP **200** を返す（201 ではない）。未存在・バリデーションエラーはいずれも **400**。JSON の `error` コードで判別する。

## デザイン方針

- about-admin と共通のモノクロ・モダン管理画面シェル（ダークサイドバー + ライトコンテンツ）。
