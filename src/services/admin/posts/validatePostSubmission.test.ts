import { describe, it, expect } from 'vitest';
import { validatePostSubmission } from '@/services/admin/posts/validatePostSubmission';

describe('validatePostSubmission', () => {
  it('全項目が揃っていればエラー無し', () => {
    const errors = validatePostSubmission(
      'https://e.com/thumb.jpg',
      'タイトル',
      ['tag1'],
      '本文です'
    );
    expect(errors).toEqual([]);
  });

  it('未入力項目のエラーを集約して返す', () => {
    const errors = validatePostSubmission('', '', [], '');
    expect(errors).toEqual(
      expect.arrayContaining([
        'サムネイルは必須です',
        '内容は必須です',
        'タイトルは必須です',
        'タグは必須です',
      ])
    );
  });

  it('タグが空配列ならタグ必須エラーになる', () => {
    const errors = validatePostSubmission(
      'https://e.com/thumb.jpg',
      'タイトル',
      [],
      '本文'
    );
    expect(errors).toEqual(['タグは必須です']);
  });
});
