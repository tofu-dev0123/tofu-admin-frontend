import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useTimelines from '@/hooks/admin/about/useTimelines';
import { del } from '@/lib/api/http';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { queryKeys } from '@/lib/api/queryKeys';
import { createQueryWrapper } from '@/test/queryWrapper';
import type { Timeline } from '@/types/api/about';

vi.mock('@/lib/api/http', () => ({
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
}));
vi.mock('@/lib/utils/exceptErrorHandling', () => ({
  exceptErrorHandling: vi.fn(),
}));

const timelines = [
  { timeline_id: 1, year: 2020, title: '入社', body: null, sort_order: 0 },
] as unknown as Timeline[];

// QueryClient 付きでフックを描画し、invalidateQueries を監視する
const setup = (showError = vi.fn()) => {
  const { wrapper, queryClient } = createQueryWrapper();
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  const { result } = renderHook(() => useTimelines({ timelines, showError }), {
    wrapper,
  });
  return { result, showError, invalidate };
};

describe('useTimelines', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('渡された一覧（クエリのデータ）をそのまま返す', () => {
    const { result } = setup();
    expect(result.current.timelines).toBe(timelines);
  });

  it('削除に成功したら年表のキャッシュを無効化し、処理中を解除する', async () => {
    vi.mocked(del).mockResolvedValue({ message: '削除しました' });
    const { result, invalidate } = setup();

    act(() => result.current.openDelete(1));
    await act(() => result.current.confirmDelete());

    expect(del).toHaveBeenCalledWith('/api/admin/timelines/1');
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.timelines,
    });
    expect(result.current.isDeleting).toBe(false);
    expect(result.current.deleteTarget).toBeNull();
  });

  it('削除に失敗したら無効化せず、エラーを通知する', async () => {
    const error = new Error('failed');
    vi.mocked(del).mockRejectedValue(error);
    const { result, showError, invalidate } = setup();

    act(() => result.current.openDelete(1));
    await act(() => result.current.confirmDelete());

    expect(exceptErrorHandling).toHaveBeenCalledWith(error, showError);
    expect(invalidate).not.toHaveBeenCalled();
    expect(result.current.isDeleting).toBe(false);
  });
});
