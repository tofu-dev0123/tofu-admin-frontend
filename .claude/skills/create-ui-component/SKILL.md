---
name: create-ui-component
description: admin-frontend の UI コンポーネント雛形を生成する。shadcn/ui（new-york / neutral / lucide）と本プロジェクトの規約に準拠。ユーザーが「UIコンポーネントを作る」「ボタン/カード/モーダル等のコンポーネントを追加」「shadcn のコンポーネントを足す」などと言ったときに使う。
---

# create-ui-component

shadcn/ui 規約と本プロジェクトのコードスタイルに沿った UI コンポーネントを生成する。

## 前提

- 配置先: `src/components/ui/<name>.tsx`（汎用 UI）。機能特化なら `src/components/common/` も検討する。
- スタイル: shadcn/ui = new-york / baseColor: neutral / icon library: lucide-react（`components.json` 参照）。
- 既存のコンポーネントは可能な限り再利用する。shadcn 公式に存在する標準コンポーネントなら、まず `pnpm dlx shadcn@latest add <name>` での追加を検討し、ユーザーに提案する。

## 手順

1. **要件確認**: コンポーネント名・バリアント（variant/size 等）・props・Radix プリミティブの要否をユーザーに確認する。既存 `src/components/ui/` に同等品がないか先に確認する。
2. **雛形生成**: 下記の規約に従い `src/components/ui/<name>.tsx` を作成する。
   - インポートは `@/*` エイリアスのみ（`../` 禁止）。
   - クラス結合は `cn`（`@/lib/utils`）。
   - バリアントが必要なら `class-variance-authority`（cva）を使う。
   - コンポーネントは **named export**。`React.forwardRef` + `displayName` を付ける（既存 `button.tsx` に倣う）。
   - `any` 禁止。props 型は明示する。
   - Prettier 設定（シングルクォート / セミコロン / 80桁 / 2スペース）に合わせる（フックで自動整形される）。
3. **整形・検証**: 生成後 `pnpm exec eslint --fix <file>` と型チェック（`pnpm type`）が通ることを確認する（編集後フックでも整形は走る）。

## 雛形（cva ありの例 — button.tsx に準拠）

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const exampleVariants = cva('基本クラス', {
  variants: {
    variant: {
      default: '...',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ExampleProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof exampleVariants> {}

const Example = React.forwardRef<HTMLDivElement, ExampleProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(exampleVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Example.displayName = 'Example';

export { Example, exampleVariants };
```

cva が不要な単純コンポーネントの場合は variants を省略し、`cn(className, '...')` で結合する。
