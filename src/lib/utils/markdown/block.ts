import type { SelectionState, StyleResult } from './types';

// 既存の見出しマーカー（`#` 〜 `######` ＋空白）
const HEADING_RE = /^(#{1,6})\s+/;

// カーソル行の見出しレベルを設定する。
// - 見出しなし → 指定レベルを付与
// - 別レベルの見出し → 指定レベルへ変更
// - 同じレベル → 解除（トグル）
export function setHeading(
  state: SelectionState,
  level: 1 | 2 | 3
): StyleResult {
  const { text } = state;
  const lineStart = text.lastIndexOf('\n', state.selectionStart - 1) + 1;
  const nextNewline = text.indexOf('\n', state.selectionStart);
  const lineEnd = nextNewline === -1 ? text.length : nextNewline;

  const line = text.slice(lineStart, lineEnd);
  const match = line.match(HEADING_RE);
  const targetPrefix = `${'#'.repeat(level)} `;

  let newLine: string;
  if (match) {
    const body = line.slice(match[0].length);
    // 同じレベルならトグルオフ、違えば差し替え
    newLine = match[1].length === level ? body : targetPrefix + body;
  } else {
    newLine = targetPrefix + line;
  }

  const delta = newLine.length - line.length;
  const newText = text.slice(0, lineStart) + newLine + text.slice(lineEnd);
  const clamp = (pos: number) => Math.max(lineStart, pos + delta);
  return {
    text: newText,
    selectionStart: clamp(state.selectionStart),
    selectionEnd: clamp(state.selectionEnd),
  };
}

interface FencedBlockOptions {
  // フェンス記号（既定 '```'）
  fence?: string;
  // 言語指定（例: 'ts'）
  lang?: string;
}

// 選択範囲をフェンス付きコードブロックで囲む。
// 前後が空行でなければ空行を補い、ブロックとして独立させる。
// カーソルは中身（選択していた範囲）に置く。
export function insertFencedBlock(
  state: SelectionState,
  options: FencedBlockOptions = {}
): StyleResult {
  const { text } = state;
  const { selectionStart, selectionEnd } = state;
  const fence = options.fence ?? '```';
  const lang = options.lang ?? '';

  const before = text.slice(0, selectionStart);
  const after = text.slice(selectionEnd);
  const inner = text.slice(selectionStart, selectionEnd);

  // 直前/直後が改行でなければ空行を補う
  const lead = before !== '' && !before.endsWith('\n') ? '\n' : '';
  const trail = after !== '' && !after.startsWith('\n') ? '\n' : '';

  const open = `${fence}${lang}\n`;
  const close = `\n${fence}`;
  const insert = `${lead}${open}${inner}${close}${trail}`;
  const newText = before + insert + after;

  const innerStart = selectionStart + lead.length + open.length;
  return {
    text: newText,
    selectionStart: innerStart,
    selectionEnd: innerStart + inner.length,
  };
}
