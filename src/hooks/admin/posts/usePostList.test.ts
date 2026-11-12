import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import usePostList from '@/hooks/admin/posts/usePostList';
import { get } from '@/lib/api/http';
import { createQueryWrapper } from '@/test/queryWrapper';
import type { Post, PostResponse } from '@/types/api/post';

let searchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => searchParams,
  usePathname: () => '/posts',
}));
vi.mock('@/lib/api/http', () => ({
  get: vi.fn(),
  del: vi.fn(),
  patch: vi.fn(),
}));

const post: Post = {
  post_id: 1,
  user_id: 1,
  title: '記事',
  slug: 'post',
  thumbnail_url: null,
  status: 'PUBLISHED',
  published_at: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};
const withPosts: PostResponse = {
  total_count: 1,
  total_pages: 1,
  posts: [post],
};
const empty: PostResponse = { total_count: 0, total_pages: 0, posts: [] };

describe('usePostList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchParams = new URLSearchParams();
  });

  it('結果が 0 件なら isEmpty になる', async () => {
    vi.mocked(get).mockResolvedValue(empty);
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => usePostList(), { wrapper });

    await waitFor(() => expect(result.current.isEmpty).toBe(true));
    expect(result.current.isColdLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('条件変更で再取得中は前の一覧を保持し isRefetching になる', async () => {
    vi.mocked(get).mockResolvedValueOnce(withPosts);
    const { wrapper } = createQueryWrapper();
    const { result, rerender } = renderHook(() => usePostList(), {
      wrapper,
    });
    await waitFor(() => expect(result.current.postList).toHaveLength(1));

    // 次の取得は保留させ、再取得中の状態を観測する
    vi.mocked(get).mockReturnValue(new Promise(() => {}));
    searchParams = new URLSearchParams({ keyword: 'abc' });
    act(() => rerender());

    await waitFor(() => expect(result.current.isRefetching).toBe(true));
    expect(result.current.postList).toHaveLength(1);
    expect(result.current.isEmpty).toBe(false);
  });
});
