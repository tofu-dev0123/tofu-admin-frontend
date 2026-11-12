import { describe, it, expect } from 'vitest';
import { validateSlug } from '@/services/admin/posts/validateSlug';
import { MESSAGES } from '@/constants/messages';

describe('validateSlug', () => {
  it('未入力はエラー無し', () => {
    expect(validateSlug('')).toEqual([]);
  });

  it.each(['abc', 'a-1', 'post-2026'])('正しい形式 %s はエラー無し', (slug) => {
    expect(validateSlug(slug)).toEqual([]);
  });

  it.each(['Abc', 'a_b', '-a', 'a-', 'a--b', 'あ'])(
    '形式違反 %s は形式エラー',
    (slug) => {
      expect(validateSlug(slug)).toEqual([MESSAGES.validation.slug.format]);
    }
  );

  it('50 文字ちょうどはエラー無し', () => {
    expect(validateSlug('a'.repeat(50))).toEqual([]);
  });

  it('51 文字は文字数エラー', () => {
    expect(validateSlug('a'.repeat(51))).toEqual([
      MESSAGES.validation.slug.maxLength,
    ]);
  });
});
