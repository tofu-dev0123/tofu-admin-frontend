import {
  Bold,
  Italic,
  Code,
  TextQuote,
  SquareCode,
  List,
  ListOrdered,
  ListChecks,
  type LucideIcon,
} from 'lucide-react';
import type { MarkdownFormat } from '@/hooks/admin/editor/useMarkdownToolbar';

// ツールバーの書式ボタン1つ分の定義。
export interface ToolbarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  format: MarkdownFormat;
}

// 書式ボタンの定義。区切り線で分けるグループ単位の二次元配列。
// ボタン追加時はここに1要素足すだけで UI・挙動の両方に反映される。
export const TOOLBAR_GROUPS: ToolbarItem[][] = [
  [
    {
      id: 'bold',
      label: '太字',
      icon: Bold,
      format: {
        kind: 'inline',
        prefix: '**',
        suffix: '**',
        placeholder: '太字',
      },
    },
    {
      id: 'italic',
      label: '斜体',
      icon: Italic,
      format: { kind: 'inline', prefix: '_', suffix: '_', placeholder: '斜体' },
    },
    {
      id: 'inline-code',
      label: 'インラインコード',
      icon: Code,
      format: { kind: 'inline', prefix: '`', suffix: '`', placeholder: 'code' },
    },
  ],
  [
    {
      id: 'quote',
      label: '引用',
      icon: TextQuote,
      format: { kind: 'line', prefix: '> ' },
    },
    {
      id: 'code-block',
      label: 'コードブロック',
      icon: SquareCode,
      format: { kind: 'fenced' },
    },
  ],
  [
    {
      id: 'unordered-list',
      label: '箇条書き',
      icon: List,
      format: { kind: 'line', prefix: '- ' },
    },
    {
      id: 'ordered-list',
      label: '番号付きリスト',
      icon: ListOrdered,
      format: { kind: 'line', prefix: '', ordered: true },
    },
    {
      id: 'task-list',
      label: 'タスクリスト',
      icon: ListChecks,
      format: { kind: 'line', prefix: '- [ ] ' },
    },
  ],
];

// 見出しドロップダウンの選択肢。
export const HEADING_LEVELS: { level: 1 | 2 | 3; label: string }[] = [
  { level: 1, label: '見出し 1' },
  { level: 2, label: '見出し 2' },
  { level: 3, label: '見出し 3' },
];
