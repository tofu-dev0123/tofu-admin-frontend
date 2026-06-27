import { describe, it, expect } from 'vitest';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { ErrorResponse } from '@/types/api/error';

describe('getErrorMessage', () => {
  it('message があればそれを配列で返す', () => {
    const error: ErrorResponse = {
      message: 'エラーです',
      error: 'BadRequest',
      details: [],
    };
    expect(getErrorMessage(error)).toEqual(['エラーです']);
  });

  it('message が空で details があれば各 message を配列で返す', () => {
    const error: ErrorResponse = {
      message: '',
      error: 'ValidationError',
      details: [
        { message: 'A', value: 'a' },
        { message: 'B', value: 'b' },
      ],
    };
    expect(getErrorMessage(error)).toEqual(['A', 'B']);
  });

  it('message も details も空なら空配列を返す', () => {
    const error: ErrorResponse = { message: '', error: '', details: [] };
    expect(getErrorMessage(error)).toEqual([]);
  });
});
