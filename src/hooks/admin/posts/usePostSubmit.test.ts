import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import usePostSubmit from '@/hooks/admin/posts/usePostSubmit';
import { post } from '@/lib/api/http';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';
import { POST_SAVE_TIMEOUT_MS } from '@/constants/admin/apiTimeout';
import type { PostEditorState } from '@/types/admin/posts';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));
vi.mock('@/lib/api/http', () => ({
  post: vi.fn(),
  del: vi.fn(),
}));
vi.mock('@/lib/utils/exceptErrorHandling', () => ({
  exceptErrorHandling: vi.fn(),
}));
vi.mock('@/lib/utils/postDraft', () => ({
  clearDraft: vi.fn(),
}));

const state = {
  title: 'タイトル',
  content: '本文',
  thumbnailUrl: null,
  tags: ['tag'],
  images: [],
  attachedImages: [],
} as unknown as PostEditorState;

describe('usePostSubmit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useToastStore.setState({ toasts: [] });
  });

  it('作成リクエストに延長したタイムアウトを指定する', async () => {
    vi.mocked(post).mockResolvedValue({});
    const showError = vi.fn();
    const { result } = renderHook(() => usePostSubmit({ showError }));

    await act(() => result.current.onSubmit(state, 'DRAFT'));

    expect(post).toHaveBeenCalledWith(
      '/api/admin/posts/',
      expect.objectContaining({ status: 'DRAFT' }),
      expect.objectContaining({ timeout: POST_SAVE_TIMEOUT_MS })
    );
  });

  it('成功時は公開トーストを表示してホームへ遷移する', async () => {
    vi.mocked(post).mockResolvedValue({});
    const showError = vi.fn();
    const { result } = renderHook(() => usePostSubmit({ showError }));

    await act(() => result.current.onSubmit(state, 'PUBLISHED'));

    expect(useToastStore.getState().toasts).toEqual([
      expect.objectContaining({
        type: 'success',
        message: '記事を公開しました',
      }),
    ]);
    expect(push).toHaveBeenCalledWith('/');
    expect(showError).not.toHaveBeenCalled();
  });

  it('API エラー時はエラーを通知し、遷移しない', async () => {
    const error = new Error('timeout');
    vi.mocked(post).mockRejectedValue(error);
    const showError = vi.fn();
    const { result } = renderHook(() => usePostSubmit({ showError }));

    await act(() => result.current.onSubmit(state, 'DRAFT'));

    expect(exceptErrorHandling).toHaveBeenCalledWith(error, showError);
    expect(push).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
