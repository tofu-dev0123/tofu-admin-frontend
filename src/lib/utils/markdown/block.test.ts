import { describe, it, expect } from 'vitest';
import { setHeading, insertFencedBlock } from '@/lib/utils/markdown/block';
import type { SelectionState } from '@/lib/utils/markdown/types';

const sel = (text: string, start: number, end = start): SelectionState => ({
  text,
  selectionStart: start,
  selectionEnd: end,
});

describe('setHeading', () => {
  it('見出しなしの行に指定レベルを付与する', () => {
    const result = setHeading(sel('title', 0), 2);
    expect(result.text).toBe('## title');
  });

  it('別レベルの見出しを差し替える', () => {
    const result = setHeading(sel('# title', 3), 3);
    expect(result.text).toBe('### title');
  });

  it('同じレベルの見出しは解除する（トグル）', () => {
    const result = setHeading(sel('## title', 4), 2);
    expect(result.text).toBe('title');
  });

  it('複数行の中の該当行だけを変更する', () => {
    const text = 'intro\ntarget\nend';
    // "target" 行（位置6〜12）
    const result = setHeading(sel(text, 6), 1);
    expect(result.text).toBe('intro\n# target\nend');
  });
});

describe('insertFencedBlock', () => {
  it('空のドキュメントにフェンスを挿入しカーソルを中身に置く', () => {
    const result = insertFencedBlock(sel('', 0));
    expect(result.text).toBe('```\n\n```');
    expect(result.selectionStart).toBe(4); // "```\n" の直後
  });

  it('選択範囲をフェンスで囲む', () => {
    const result = insertFencedBlock(sel('code', 0, 4));
    expect(result.text).toBe('```\ncode\n```');
    expect(result.text.slice(result.selectionStart, result.selectionEnd)).toBe(
      'code'
    );
  });

  it('直前が改行でなければ空行を補う', () => {
    const text = 'text';
    const result = insertFencedBlock(sel(text, 4));
    expect(result.text).toBe('text\n```\n\n```');
  });
});
