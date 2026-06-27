# ルール: React フック / カスタムフック

フックを書く・直すときに従う。lint は `react-hooks`（React Compiler ルール含む）が有効。

## 配置と形式

- カスタムフックは `src/hooks/admin/<feature>/use*.ts` に置く（機能ごとにディレクトリを分ける）。
- フックは **default export**（既存慣習）。コンポーネントは named export。
- 先頭に `'use client';` を付ける。
- 依存配列は正しく埋める。関数は `useCallback`、値は必要に応じて `useMemo` で安定化する。

## set-state-in-effect を避ける

`useEffect` の中で**同期的に** setState すると `react-hooks/set-state-in-effect` で弾かれる。

- **prop → state の同期**は effect ではなく **render 中に前回値と比較**して更新する（React 推奨）。
  ```ts
  const [prev, setPrev] = useState(propValue);
  if (propValue !== prev) {
    setPrev(propValue);
    setDerived(propValue);
  }
  ```
  初期値は `useState(propValue)` で直接渡せば effect は不要。実例: `src/hooks/admin/posts/useImageInsertion.ts`。
- **マウント時のデータ取得**（fetch して setState）は正当なパターン。ルールの誤検知なので、その行に理由コメント付きで `// eslint-disable-next-line react-hooks/set-state-in-effect` を付ける。実例: `src/hooks/admin/account/useAccountMe.ts`。

## immutability（ref への代入）

context などから得た値を effect 内で書き換えると `react-hooks/immutability` で弾かれる。ref の `.current` への代入は正当なエスケープハッチなので、**該当行と useEffect の行の両方**に `// eslint-disable-next-line react-hooks/immutability` を付ける。実例: `src/components/features/admin/posts/Editor/Content.tsx`。

## disable の方針

`eslint-disable` は「ルールが誤検知で、かつパターンが意図的に安全」なときのみ。必ず理由コメントを添える。まず render 中比較などの正攻法で解消できないか検討してから使う。
