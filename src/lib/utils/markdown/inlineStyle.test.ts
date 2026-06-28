import { describe, it, expect } from 'vitest';
import { toggleInlineStyle } from '@/lib/utils/markdown/inlineStyle';
import type { SelectionState } from '@/lib/utils/markdown/types';

// 太字（**）を基準にインライン装飾の挙動を検証する。
const bold = { prefix: '**', suffix: '**', placeholder: '太字' };

// テキストと選択範囲から SelectionState を作る補助
const sel = (text: string, start: number, end = start): SelectionState => ({
  text,
  selectionStart: start,
  selectionEnd: end,
});

describe('toggleInlineStyle', () => {
  it('選択範囲をマーカーで囲む', () => {
    const result = toggleInlineStyle(sel('hello world', 0, 5), bold);
    expect(result.text).toBe('**hello** world');
    // 中身（hello）が選択された状態
    expect(result.text.slice(result.selectionStart, result.selectionEnd)).toBe(
      'hello'
    );
  });

  it('選択なしのときカーソル位置の単語へ拡張して囲む', () => {
    // "world" の中（位置8）にカーソル
    const result = toggleInlineStyle(sel('hello world', 8), bold);
    expect(result.text).toBe('hello **world**');
  });

  it('選択も単語も無いとき placeholder を挿入し中身を選択する', () => {
    const result = toggleInlineStyle(sel('', 0), bold);
    expect(result.text).toBe('**太字**');
    expect(result.text.slice(result.selectionStart, result.selectionEnd)).toBe(
      '太字'
    );
  });

  it('外側がマーカーの選択は解除する（トグル）', () => {
    // "**hello**" の内側 hello を選択（位置2〜7）
    const result = toggleInlineStyle(sel('**hello**', 2, 7), bold);
    expect(result.text).toBe('hello');
  });

  it('マーカーごと選択した範囲も解除する', () => {
    const result = toggleInlineStyle(sel('**hello**', 0, 9), bold);
    expect(result.text).toBe('hello');
  });

  it('選択前後の空白はマーカーの外に出す（トリム）', () => {
    const result = toggleInlineStyle(sel('a hello b', 1, 8), bold);
    expect(result.text).toBe('a **hello** b');
  });

  it('斜体（_）でも同様に動く', () => {
    const italic = { prefix: '_', suffix: '_', placeholder: '斜体' };
    const result = toggleInlineStyle(sel('word', 0, 4), italic);
    expect(result.text).toBe('_word_');
  });
});
