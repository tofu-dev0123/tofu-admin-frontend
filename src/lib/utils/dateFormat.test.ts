import { describe, it, expect } from 'vitest';
import { formatDateTime, formatDate } from '@/lib/utils/dateFormat';

describe('formatDateTime', () => {
  it('UTC 日時を JST の yyyy年mm月dd日 hh時mm分 に変換する', () => {
    expect(formatDateTime('2024-01-10T09:00:00Z')).toBe(
      '2024年01月10日 18時00分'
    );
  });

  it('タイムゾーン情報の無い文字列も UTC として解釈する', () => {
    expect(formatDateTime('2024-01-10T09:00:00')).toBe(
      '2024年01月10日 18時00分'
    );
  });

  it('不正な日付は「日付エラー」を返す', () => {
    expect(formatDateTime('invalid')).toBe('日付エラー');
  });
});

describe('formatDate', () => {
  it('UTC 日時を JST の yyyy年mm月dd日 に変換する', () => {
    expect(formatDate('2024-01-10T09:00:00Z')).toBe('2024年01月10日');
  });

  it('不正な日付は「日付エラー」を返す', () => {
    expect(formatDate('invalid')).toBe('日付エラー');
  });
});
