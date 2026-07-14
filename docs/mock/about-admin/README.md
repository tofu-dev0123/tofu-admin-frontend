# about-admin

公開サイトの About（自己紹介）ページに表示する情報を管理する画面のモック。

## 対応バックエンド API

- `GET /admin/profile` / `PUT /admin/profile`（プロフィールはシングルトン。1レコードを更新）
- `GET /admin/timelines` / `POST /admin/timelines` / `PUT /admin/timelines/{id}` / `DELETE /admin/timelines/{id}`

## 画面構成

- **プロフィールカード**: `headline`（肩書き / max 255）・`bio`（自己紹介 / max 2000）・`site_description`（サイト説明 / max 1000）を編集。カード単位で「保存」＝ `PUT /admin/profile`。文字数カウンタ付き。
- **年表カード**: `year`（1900–2100）・`title`（任意 / max 255）・`body`（任意 / max 2000）・`sort_order` を持つ Timeline のリスト。追加・インライン編集・削除・ドラッグ並び替え（`sort_order`）を想定。

## デザイン方針

- Linear / Vercel 系のモノクロ・モダン管理画面。ダークサイドバー + ライトなコンテンツ。
- アクセントは黒（zinc-900/950）中心。将来 shadcn(new-york / neutral) にそのまま落とせる配色。

## 備考（Issue #4 との差分）

Issue #4 が挙げていた「プロフィール画像・SNS/連絡先リンク・スキルリスト」は、実装済みバックエンドには**フィールドが存在しない**ため本モックには含めていない。バックエンド拡張が入った場合は追記する。
