import { describe, it, expect } from 'vitest';
import { toggleLinePrefix } from '@/lib/utils/markdown/linePrefix';
import type { SelectionState } from '@/lib/utils/markdown/types';

const sel = (text: string, start: number, end = start): SelectionState => ({
  text,
  selectionStart: start,
  selectionEnd: end,
});

describe('toggleLinePrefix', () => {
  it('単一行の行頭に引用を付与する', () => {
    const result = toggleLinePrefix(sel('hello', 0), { prefix: '> ' });
    expect(result.text).toBe('> hello');
  });

  it('複数行すべての行頭にプレフィックスを付与する', () => {
    const text = 'a\nb\nc';
    const result = toggleLinePrefix(sel(text, 0, text.length), {
      prefix: '- ',
    });
    expect(result.text).toBe('- a\n- b\n- c');
  });

  it('全行が適用済みなら解除する（トグル）', () => {
    const text = '- a\n- b';
    const result = toggleLinePrefix(sel(text, 0, text.length), {
      prefix: '- ',
    });
    expect(result.text).toBe('a\nb');
  });

  it('番号付きリストは連番を付与する', () => {
    const text = 'a\nb\nc';
    const result = toggleLinePrefix(sel(text, 0, text.length), {
      prefix: '',
      ordered: true,
    });
    expect(result.text).toBe('1. a\n2. b\n3. c');
  });

  it('番号付きリストを解除する', () => {
    const text = '1. a\n2. b';
    const result = toggleLinePrefix(sel(text, 0, text.length), {
      prefix: '',
      ordered: true,
    });
    expect(result.text).toBe('a\nb');
  });

  it('空行はスキップする', () => {
    const text = 'a\n\nb';
    const result = toggleLinePrefix(sel(text, 0, text.length), {
      prefix: '- ',
    });
    expect(result.text).toBe('- a\n\n- b');
  });

  it('タスクリストのプレフィックスも付与できる', () => {
    const result = toggleLinePrefix(sel('todo', 0), { prefix: '- [ ] ' });
    expect(result.text).toBe('- [ ] todo');
  });
});
