---
name: feature
description: 機能追加の Issue を起票するスキル。トピックを受け取り、既存コードを読んで影響調査（テスト観点含む）→ 改修案を提示 → 内容確定後に enhancement ラベル付きで GitHub Issue を起票する。「機能を追加したい」「新機能」「機能追加の Issue」「改善したい」「画面を変えたい」などと言われたときは必ずこのスキルを使う。
argument-hint: <トピック>
---

機能追加のトピック `$ARGUMENTS` について、影響調査から Issue 起票までを行う。
フロー全体は `.claude/rules/dev-flow.md` を参照。

## 1. トピックの確認

- `$ARGUMENTS` が空、または調査の起点が分からないほど曖昧な場合は、何を実現したいかをユーザーに確認する
- 似た Issue がないか `gh issue list --state all --search "<キーワード>"` で確認し、あれば提示する

## 2. 影響調査（コードを読む）

推測で済ませず、実際に既存コードを読んで以下を明らかにする。

- **影響する画面・対象ファイル**: どのページ（`src/app/admin/`）・コンポーネント（`src/components/`）・hooks（`src/hooks/admin/<feature>/`）・Context（`src/contexts/admin/`）・ストア（`src/stores/`）に手が入るか
- **UI の変更有無**: 見た目・レイアウト・操作の変更があるか。モバイル / デスクトップ双方への影響
- **API との対応**: 使用するバックエンド API と、`API_ENDPOINTS`（`src/lib/api/endpoint.ts`）・プロキシ Route（`src/app/api/admin/**`）・`src/types/api/` の型の対応。バックエンド側の変更が必要か
- **ロジックの置き場所**: フックへの切り出し方（`.claude/rules/component-logic-separation.md`）、状態の置き場所（`.claude/rules/state-management.md`）
- **テスト観点**: 正常系・異常系・境界値の概要、既存テストへの影響（方針は `.claude/rules/testing.md`）
- 関連する規約（`CLAUDE.md`、`.claude/rules/*.md`、`docs/`）

## 3. 改修案の提示

調査結果と改修案をユーザーに提示する。

- 調査結果（上記の各項目。根拠となる `file:line` を添える）
- 改修案（実装方針、変更するファイル、追加する UT の概要）
- 選択肢がある場合は推奨案と理由を示す
- 未決事項があれば質問としてまとめる

ユーザーの指摘を受けたら調査・案を修正して再提示する。**ユーザーが内容を確定するまで起票しない。**

## 4. 起票

1. `.github/ISSUE_TEMPLATE/feature.md` を読み、frontmatter と `<!-- -->` コメントを除いた見出し構成に沿って本文を作成する
2. タイトル案（日本語、70 文字以内）と本文案を提示し、承認を得る
3. 承認後、本文を一時ファイルに書き出して起票する

   ```bash
   gh issue create --title "<タイトル>" --body-file <一時ファイル> --label enhancement
   ```

4. 作成された Issue の URL を表示し、実装に進む場合は `/implement <番号>` を案内する
