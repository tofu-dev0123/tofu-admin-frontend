import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import usePostsQuery from '@/hooks/admin/posts/usePostsQuery';
import { get } from '@/lib/api/http';
import { createQueryWrapper } from '@/test/queryWrapper';
import type { PostResponse } from '@/types/api/post';

vi.mock('@/lib/api/http', () => ({
  get: vi.fn(),
}));

const response: PostResponse = { total_count: 0, total_pages: 0, posts: [] };

describe('usePostsQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('条件をクエリ文字列に組み立てて取得する', async () => {
    vi.mocked(get).mockResolvedValue(response);
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(
      () =>
        usePostsQuery({
          offset: 10,
          limit: 10,
          keyword: 'a',
          status: 'DRAFT',
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith(
      '/api/admin/posts/?offset=10&limit=10&keyword=a&status=DRAFT'
    );
    expect(result.current.data).toEqual(response);
  });

  it('同じ条件で再度マウントしてもキャッシュを使い再取得しない', async () => {
    vi.mocked(get).mockResolvedValue(response);
    const { wrapper } = createQueryWrapper();
    const params = { limit: 3, status: 'PUBLISHED' as const };

    const first = renderHook(() => usePostsQuery(params), { wrapper });
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));
    first.unmount();

    const second = renderHook(() => usePostsQuery(params), { wrapper });

    expect(second.result.current.data).toEqual(response);
    expect(get).toHaveBeenCalledTimes(1);
  });

  it('取得に失敗したら isError になる', async () => {
    vi.mocked(get).mockRejectedValue(new Error('failed'));
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => usePostsQuery({ limit: 10 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
