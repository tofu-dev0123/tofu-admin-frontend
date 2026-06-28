import type { EditorView } from '@codemirror/view';
import type { StyleResult } from '@/lib/utils/markdown';

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

// 純粋関数（@/lib/utils/markdown）の結果を CodeMirror に最小差分で反映する。
export function dispatchMarkdownResult(view: EditorView, result: StyleResult) {
  const oldText = view.state.doc.toString();
  view.dispatch({
    changes: computeMinimalChange(oldText, result.text),
    selection: {
      anchor: result.selectionStart,
      head: result.selectionEnd,
    },
    scrollIntoView: true,
  });
  view.focus();
}
