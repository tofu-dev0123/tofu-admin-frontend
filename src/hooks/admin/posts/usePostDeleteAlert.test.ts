import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import usePostDeleteAlert from '@/hooks/admin/posts/usePostDeleteAlert';
import { del } from '@/lib/api/http';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';

vi.mock('@/lib/api/http', () => ({
  del: vi.fn(),
}));
vi.mock('@/lib/utils/exceptErrorHandling', () => ({
  exceptErrorHandling: vi.fn(),
}));

describe('usePostDeleteAlert', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('削除中は isProcessing が立つ', () => {
    // 応答を返さず削除中の状態を保つ
    vi.mocked(del).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() =>
      usePostDeleteAlert({ showError: vi.fn() })
    );

    act(() => result.current.handleOpen(1));
    act(() => {
      void result.current.handleDelete();
    });

    expect(result.current.isProcessing).toBe(true);
    expect(del).toHaveBeenCalledWith('/api/admin/posts/1');
  });

  it('削除に失敗したら isProcessing を解除し、エラーを通知してダイアログを閉じる', async () => {
    const error = new Error('failed');
    vi.mocked(del).mockRejectedValue(error);
    const showError = vi.fn();
    const { result } = renderHook(() => usePostDeleteAlert({ showError }));

    act(() => result.current.handleOpen(1));
    await act(() => result.current.handleDelete());

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.open).toBe(false);
    expect(exceptErrorHandling).toHaveBeenCalledWith(error, showError);
  });
});
