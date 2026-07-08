import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useAccountMe from '@/hooks/admin/account/useAccountMe';

describe('useAccountMe', () => {
  it('サーバーから渡された初期アカウント情報を state に反映する', () => {
    const { result } = renderHook(() =>
      useAccountMe({
        initial: {
          user_id: 1,
          account_name: 'たろう',
          username: 'taro@example.com',
        },
      })
    );

    expect(result.current.userId).toBe(1);
    expect(result.current.accountName).toBe('たろう');
    expect(result.current.username).toBe('taro@example.com');
  });
});
