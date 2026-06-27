import { describe, it, expect } from 'vitest';
import { validate } from '@/lib/utils/validation';

describe('validate', () => {
  describe('required', () => {
    it('空文字はエラー', () => {
      expect(validate('', 'required')).toBe('入力は必須です');
    });
    it('空白のみはエラー', () => {
      expect(validate('   ', 'required')).toBe('入力は必須です');
    });
    it('値があれば null', () => {
      expect(validate('値', 'required')).toBeNull();
    });
    it('カスタムメッセージを返す', () => {
      expect(validate('', 'required', { message: '必須です' })).toBe(
        '必須です'
      );
    });
  });

  describe('maxLength', () => {
    it('超過でエラー', () => {
      expect(validate('abcdef', 'maxLength', { value: 3 })).toBe(
        '3文字以内で入力してください'
      );
    });
    it('以内なら null', () => {
      expect(validate('ab', 'maxLength', { value: 3 })).toBeNull();
    });
    it('value オプションが無ければ例外', () => {
      expect(() => validate('a', 'maxLength')).toThrow();
    });
  });

  describe('email', () => {
    it('不正な形式はエラー', () => {
      expect(validate('invalid', 'email')).toBe(
        '有効なメールアドレスを入力してください'
      );
    });
    it('正しい形式は null', () => {
      expect(validate('user@example.com', 'email')).toBeNull();
    });
  });

  describe('url', () => {
    it('不正な URL はエラー', () => {
      expect(validate('not a url', 'url')).toBe('有効なURLを入力してください');
    });
    it('正しい URL は null', () => {
      expect(validate('https://example.com', 'url')).toBeNull();
    });
  });

  describe('maxFileSize', () => {
    it('上限超過でエラー', () => {
      expect(validate(2048, 'maxFileSize', { maxSize: 1024 })).not.toBeNull();
    });
    it('上限以内は null', () => {
      expect(validate(512, 'maxFileSize', { maxSize: 1024 })).toBeNull();
    });
  });
});
