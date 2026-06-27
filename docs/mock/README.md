# docs/mock

画面モック（デザインのたたき台）を置くディレクトリ。`create-mock` スキルで生成する。

## 構成

```
docs/mock/<画面名（kebab-case）>/
  index.html        モック本体（単体で開ける自己完結 HTML / Tailwind CDN）
  screenshot.png    Playwright MCP で撮影したスクショ
  README.md         （任意）画面の意図・想定操作のメモ
```

## 運用

- 実装前のデザイン合意・たたき台用。本番コード（`src/`）とは分離する。
- 設計資産として Git 管理する。
- 複数案を比較する場合は `<画面名>/variant-a/`, `variant-b/` のように分ける。
