import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import usePostDeleteAlert from '@/hooks/admin/posts/usePostDeleteAlert';
import { del } from '@/lib/api/http';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { queryKeys } from '@/lib/api/queryKeys';
import { createQueryWrapper } from '@/test/queryWrapper';

vi.mock('@/lib/api/http', () => ({
  del: vi.fn(),
}));
vi.mock('@/lib/utils/exceptErrorHandling', () => ({
  exceptErrorHandling: vi.fn(),
}));

// QueryClient 付きでフックを描画し、invalidateQueries を監視する
const setup = (showError = vi.fn()) => {
  const { wrapper, queryClient } = createQueryWrapper();
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  const { result } = renderHook(() => usePostDeleteAlert({ showError }), {
    wrapper,
  });
  return { result, showError, invalidate };
};

describe('usePostDeleteAlert', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('削除中は isProcessing が立つ', () => {
    // 応答を返さず削除中の状態を保つ
    vi.mocked(del).mockReturnValue(new Promise(() => {}));
    const { result } = setup();

    act(() => result.current.handleOpen(1));
    act(() => {
      void result.current.handleDelete();
    });

    expect(result.current.isProcessing).toBe(true);
    expect(del).toHaveBeenCalledWith('/api/admin/posts/1');
  });

  it('削除に成功したら記事キャッシュを無効化し、処理中を解除してダイアログを閉じる', async () => {
    vi.mocked(del).mockResolvedValue({ message: '削除しました' });
    const reload = vi.fn();
    vi.stubGlobal('location', { ...window.location, reload });
    const { result, invalidate } = setup();

    act(() => result.current.handleOpen(1));
    await act(() => result.current.handleDelete());

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.posts.all,
    });
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.open).toBe(false);
    expect(reload).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('削除に失敗したら isProcessing を解除し、エラーを通知してダイアログを閉じる', async () => {
    const error = new Error('failed');
    vi.mocked(del).mockRejectedValue(error);
    const { result, showError, invalidate } = setup();

    act(() => result.current.handleOpen(1));
    await act(() => result.current.handleDelete());

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.open).toBe(false);
    expect(exceptErrorHandling).toHaveBeenCalledWith(error, showError);
    expect(invalidate).not.toHaveBeenCalled();
  });
});
