import { describe, it, expect } from 'vitest';
import { insertLink, insertImage } from '@/lib/utils/markdown/linkImage';
import type { SelectionState } from '@/lib/utils/markdown/types';

const sel = (text: string, start: number, end = start): SelectionState => ({
  text,
  selectionStart: start,
  selectionEnd: end,
});

describe('insertLink', () => {
  it('選択範囲をリンクで囲む', () => {
    const result = insertLink(sel('公式サイト', 0, 5), 'https://example.com');
    expect(result.text).toBe('[公式サイト](https://example.com)');
  });

  it('選択なしのとき placeholder を挿入しラベルを選択する', () => {
    const result = insertLink(sel('', 0), 'https://example.com', 'リンク');
    expect(result.text).toBe('[リンク](https://example.com)');
    expect(result.text.slice(result.selectionStart, result.selectionEnd)).toBe(
      'リンク'
    );
  });

  it('カーソル位置に挿入する（前後テキストを保持）', () => {
    const result = insertLink(sel('a b', 2, 2), 'https://x.dev', 'L');
    expect(result.text).toBe('a [L](https://x.dev)b');
  });
});

describe('insertImage', () => {
  it('空のドキュメントに画像を挿入する', () => {
    const result = insertImage(sel('', 0), 'https://img/a.png');
    expect(result.text).toBe('![](https://img/a.png)\n');
  });

  it('直前が改行でなければ改行を補う', () => {
    const result = insertImage(sel('text', 4), 'https://img/a.png');
    expect(result.text).toBe('text\n![](https://img/a.png)\n');
  });

  it('直前が改行ならそのまま挿入する', () => {
    const result = insertImage(sel('text\n', 5), 'https://img/a.png');
    expect(result.text).toBe('text\n![](https://img/a.png)\n');
  });
});
