import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useMeQuery from '@/hooks/admin/account/useMeQuery';
import { post } from '@/lib/api/http';
import { createQueryWrapper } from '@/test/queryWrapper';

vi.mock('@/lib/api/http', () => ({ post: vi.fn() }));

describe('useMeQuery', () => {
  it('アカウント情報を取得して data に入れる', async () => {
    const me = { user_id: 1, account_name: 'たろう', username: 'taro' };
    vi.mocked(post).mockResolvedValue(me);
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useMeQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(post).toHaveBeenCalledWith('/api/admin/auth/me');
    expect(result.current.data).toEqual(me);
  });
});
