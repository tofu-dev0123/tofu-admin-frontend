import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import usePostDetailQuery from '@/hooks/admin/posts/usePostDetailQuery';
import { get } from '@/lib/api/http';
import { queryKeys } from '@/lib/api/queryKeys';
import { createQueryWrapper } from '@/test/queryWrapper';

vi.mock('@/lib/api/http', () => ({ get: vi.fn() }));

describe('usePostDetailQuery', () => {
  it('編集画面を離れたら詳細キャッシュを破棄し、次回は古いデータで初期化しない', async () => {
    vi.mocked(get).mockResolvedValue({ post_id: 1, title: '旧タイトル' });
    const { wrapper, queryClient } = createQueryWrapper();

    const first = renderHook(() => usePostDetailQuery(1), { wrapper });
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));
    first.unmount();

    // アンマウント後はキャッシュが消える（gcTime: 0）
    await waitFor(() =>
      expect(
        queryClient.getQueryData(queryKeys.posts.detail(1))
      ).toBeUndefined()
    );

    // 次回の取得が失敗しても前回のデータは使われない
    vi.mocked(get).mockRejectedValue(new Error('not found'));
    const second = renderHook(() => usePostDetailQuery(1), { wrapper });

    await waitFor(() => expect(second.result.current.isError).toBe(true));
    expect(second.result.current.data).toBeUndefined();
  });
});
