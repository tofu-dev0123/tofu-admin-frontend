import type { SelectionState, StyleResult } from './types';

// 選択範囲を含む行の開始位置を返す。
function lineStartOf(text: string, pos: number): number {
  return text.lastIndexOf('\n', pos - 1) + 1;
}

// 選択範囲を含む行の終了位置（次の改行の手前 / 末尾）を返す。
function lineEndOf(text: string, pos: number): number {
  const idx = text.indexOf('\n', pos);
  return idx === -1 ? text.length : idx;
}

// 番号付きリスト（`1. ` 形式）の検出
const ORDERED_RE = /^(\d+)\.\s/;

interface LinePrefixOptions {
  // 各行頭に付与するプレフィックス（例: 引用 '> ' / 箇条書き '- ' / タスク '- [ ] '）
  prefix: string;
  // 番号付きリスト（true の場合 prefix は無視し `1. ` `2. ` … を連番付与）
  ordered?: boolean;
}

// 行頭プレフィックスを付与/解除する（引用・箇条書き・番号付き・タスクリスト）。
// 選択範囲にかかる全行が対象。全行が適用済みなら解除、そうでなければ付与（トグル）。
// 番号付きは連番、空行はスキップする（GitHub 準拠）。
export function toggleLinePrefix(
  state: SelectionState,
  options: LinePrefixOptions
): StyleResult {
  const { text } = state;
  const { prefix, ordered = false } = options;

  const blockStart = lineStartOf(text, state.selectionStart);
  const blockEnd = lineEndOf(text, state.selectionEnd);
  const lines = text.slice(blockStart, blockEnd).split('\n');

  const isApplied = (line: string) =>
    ordered ? ORDERED_RE.test(line) : line.startsWith(prefix);

  // 空行を除く全行が適用済みかどうか
  const nonEmpty = lines.filter((l) => l.trim() !== '');
  const allApplied = nonEmpty.length > 0 && nonEmpty.every(isApplied);

  let newLines: string[];
  if (allApplied) {
    // 解除
    newLines = lines.map((line) => {
      if (ordered) return line.replace(ORDERED_RE, '');
      return line.startsWith(prefix) ? line.slice(prefix.length) : line;
    });
  } else {
    // 付与
    let counter = 0;
    newLines = lines.map((line) => {
      if (line.trim() === '') return line;
      if (ordered) {
        counter += 1;
        return `${counter}. ${line.replace(ORDERED_RE, '')}`;
      }
      return line.startsWith(prefix) ? line : prefix + line;
    });
  }

  const newBlock = newLines.join('\n');
  const newText = text.slice(0, blockStart) + newBlock + text.slice(blockEnd);
  return {
    text: newText,
    selectionStart: blockStart,
    selectionEnd: blockStart + newBlock.length,
  };
}
