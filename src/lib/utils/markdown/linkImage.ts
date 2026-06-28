import type { SelectionState, StyleResult } from './types';

// リンクを挿入する。
// - 選択あり: `[選択テキスト](url)` で囲み、カーソルをリンク末尾へ
// - 選択なし: `[placeholder](url)` を挿入し、ラベル部分を選択状態にする
export function insertLink(
  state: SelectionState,
  url: string,
  placeholder = 'リンクテキスト'
): StyleResult {
  const { text, selectionStart: from, selectionEnd: to } = state;
  const selected = text.slice(from, to);
  const label = selected === '' ? placeholder : selected;
  const markdown = `[${label}](${url})`;
  const newText = text.slice(0, from) + markdown + text.slice(to);

  if (selected === '') {
    // ラベル（[ の直後）を選択して上書き入力できるようにする
    const labelStart = from + 1;
    return {
      text: newText,
      selectionStart: labelStart,
      selectionEnd: labelStart + label.length,
    };
  }

  // 選択ありの場合はリンク末尾にカーソルを置く
  const cursor = from + markdown.length;
  return { text: newText, selectionStart: cursor, selectionEnd: cursor };
}

// 画像を挿入する。`![](url)` をブロックとして挿入し、カーソルは挿入直後へ。
// 直前が文頭・改行でなければ改行を補い、末尾にも改行を付ける。
export function insertImage(state: SelectionState, url: string): StyleResult {
  const { text, selectionStart: from, selectionEnd: to } = state;

  const charBefore = from > 0 ? text.slice(from - 1, from) : '';
  const lead = charBefore !== '' && charBefore !== '\n' ? '\n' : '';
  const markdown = `${lead}![](${url})\n`;

  const newText = text.slice(0, from) + markdown + text.slice(to);
  const cursor = from + markdown.length;
  return { text: newText, selectionStart: cursor, selectionEnd: cursor };
}
