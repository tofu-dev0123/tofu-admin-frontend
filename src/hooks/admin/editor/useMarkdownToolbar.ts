'use client';

import { useCallback } from 'react';
import type { RefObject } from 'react';
import type { EditorView } from '@codemirror/view';
import {
  toggleInlineStyle,
  toggleLinePrefix,
  setHeading,
  insertFencedBlock,
} from '@/lib/utils/markdown';
import type { SelectionState, StyleResult } from '@/lib/utils/markdown';

// ツールバーの各ボタンが表す書式コマンド。
// 純粋関数（@/lib/utils/markdown）への振り分けに対応する判別共用体。
export type MarkdownFormat =
  | { kind: 'inline'; prefix: string; suffix: string; placeholder?: string }
  | { kind: 'line'; prefix: string; ordered?: boolean }
  | { kind: 'heading'; level: 1 | 2 | 3 }
  | { kind: 'fenced' };

// 旧テキストと新テキストを比較し、変更があった連続範囲だけを返す。
// ドキュメント全体を置換せず最小差分で dispatch することで、
// CodeMirror の undo 履歴と無関係な箇所のカーソルを保つ。
function computeMinimalChange(oldText: string, newText: string) {
  let from = 0;
  const max = Math.min(oldText.length, newText.length);
  while (from < max && oldText[from] === newText[from]) {
    from += 1;
  }
  let oldEnd = oldText.length;
  let newEnd = newText.length;
  while (
    oldEnd > from &&
    newEnd > from &&
    oldText[oldEnd - 1] === newText[newEnd - 1]
  ) {
    oldEnd -= 1;
    newEnd -= 1;
  }
  return { from, to: oldEnd, insert: newText.slice(from, newEnd) };
}

// 選択状態に書式コマンドを適用した結果を返す。
function applyMarkdownFormat(
  selection: SelectionState,
  format: MarkdownFormat
): StyleResult {
  switch (format.kind) {
    case 'inline':
      return toggleInlineStyle(selection, format);
    case 'line':
      return toggleLinePrefix(selection, format);
    case 'heading':
      return setHeading(selection, format.level);
    case 'fenced':
      return insertFencedBlock(selection);
  }
}

// CodeMirror のエディタに対し、ツールバーの書式コマンドを適用するフック。
// 純粋関数で新しいテキストと選択範囲を計算し、最小差分で dispatch する。
export default function useMarkdownToolbar(
  editorViewRef: RefObject<EditorView | null>
) {
  const applyFormat = useCallback(
    (format: MarkdownFormat) => {
      const view = editorViewRef.current;
      if (!view) return;

      const { from, to } = view.state.selection.main;
      const oldText = view.state.doc.toString();
      const result = applyMarkdownFormat(
        { text: oldText, selectionStart: from, selectionEnd: to },
        format
      );

      view.dispatch({
        changes: computeMinimalChange(oldText, result.text),
        selection: {
          anchor: result.selectionStart,
          head: result.selectionEnd,
        },
        scrollIntoView: true,
      });
      view.focus();
    },
    [editorViewRef]
  );

  return { applyFormat };
}
