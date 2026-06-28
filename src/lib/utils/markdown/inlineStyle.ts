import type { SelectionState, StyleResult } from './types';

// 空白判定（単語境界の検出に使う）
const WHITESPACE = /\s/;

// 選択が空のとき、カーソル位置から単語境界まで選択を広げる（GitHub 準拠）。
function expandToWord(
  text: string,
  pos: number
): { start: number; end: number } {
  let start = pos;
  let end = pos;
  while (start > 0 && !WHITESPACE.test(text[start - 1])) {
    start -= 1;
  }
  while (end < text.length && !WHITESPACE.test(text[end])) {
    end += 1;
  }
  return { start, end };
}

interface InlineStyleOptions {
  // 前後に付与するマーカー（例: 太字 '**' / 斜体 '_' / コード '`'）
  prefix: string;
  suffix: string;
  // 選択も単語も無いときに挿入する文言（カーソルは中身を選択した状態になる）
  placeholder?: string;
}

// インライン装飾を付与/解除する（太字・斜体・インラインコード）。
// - 選択あり: 前後をマーカーで囲む
// - 既に装飾済み: 解除（トグル）
// - 選択なし: 単語境界へ拡張してから囲む
// - 単語も無い: placeholder を挿入し中身を選択
// 選択前後の空白はマーカーの外に出す（トリム）。
export function toggleInlineStyle(
  state: SelectionState,
  options: InlineStyleOptions
): StyleResult {
  const { text } = state;
  const { prefix, suffix, placeholder = '' } = options;
  let { selectionStart: start, selectionEnd: end } = state;

  // 選択なし → 単語境界へ拡張
  if (start === end) {
    const word = expandToWord(text, start);
    start = word.start;
    end = word.end;
  }

  // 選択前後の空白をマーカーの外へ（トリム）
  let selected = text.slice(start, end);
  const leading = selected.length - selected.trimStart().length;
  const trailing = selected.length - selected.trimEnd().length;
  start += leading;
  end -= trailing;
  selected = text.slice(start, end);

  // 選択そのものがマーカーで囲まれている → 解除
  if (
    selected.length >= prefix.length + suffix.length &&
    selected.startsWith(prefix) &&
    selected.endsWith(suffix)
  ) {
    const inner = selected.slice(
      prefix.length,
      selected.length - suffix.length
    );
    const newText = text.slice(0, start) + inner + text.slice(end);
    return {
      text: newText,
      selectionStart: start,
      selectionEnd: start + inner.length,
    };
  }

  // 選択の外側がマーカー → 解除（このツールで付与した直後の再押下に対応）
  const before = text.slice(Math.max(0, start - prefix.length), start);
  const after = text.slice(end, end + suffix.length);
  if (before === prefix && after === suffix) {
    const newText =
      text.slice(0, start - prefix.length) +
      selected +
      text.slice(end + suffix.length);
    return {
      text: newText,
      selectionStart: start - prefix.length,
      selectionEnd: end - prefix.length,
    };
  }

  // 付与
  const inner = selected === '' ? placeholder : selected;
  const newText =
    text.slice(0, start) + prefix + inner + suffix + text.slice(end);
  return {
    text: newText,
    selectionStart: start + prefix.length,
    selectionEnd: start + prefix.length + inner.length,
  };
}
