import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import usePostEditSubmit from '@/hooks/admin/posts/usePostEditSubmit';
import { put, del } from '@/lib/api/http';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';
import { POST_SAVE_TIMEOUT_MS } from '@/constants/admin/apiTimeout';
import type { PostEditorState } from '@/types/admin/posts';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));
vi.mock('@/lib/api/http', () => ({
  put: vi.fn(),
  del: vi.fn(),
}));
vi.mock('@/lib/utils/exceptErrorHandling', () => ({
  exceptErrorHandling: vi.fn(),
}));

const state = {
  title: 'タイトル',
  content: '本文',
  thumbnailUrl: null,
  thumbnailDeleteFlag: false,
  tags: ['tag'],
  images: [],
  newImages: [],
  attachedImages: [],
} as unknown as PostEditorState;

describe('usePostEditSubmit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useToastStore.setState({ toasts: [] });
  });

  it('更新リクエストに延長したタイムアウトを指定する', async () => {
    vi.mocked(put).mockResolvedValue({});
    const showError = vi.fn();
    const { result } = renderHook(() =>
      usePostEditSubmit({ showError, postId: 1 })
    );

    await act(() => result.current.onSubmit(state, 'DRAFT'));

    expect(put).toHaveBeenCalledWith(
      '/api/admin/posts/1',
      expect.objectContaining({ status: 'DRAFT' }),
      expect.objectContaining({ timeout: POST_SAVE_TIMEOUT_MS })
    );
  });

  it('成功時は下書き更新トーストを表示してホームへ遷移する', async () => {
    vi.mocked(put).mockResolvedValue({});
    const showError = vi.fn();
    const { result } = renderHook(() =>
      usePostEditSubmit({ showError, postId: 1 })
    );

    await act(() => result.current.onSubmit(state, 'DRAFT'));

    expect(useToastStore.getState().toasts).toEqual([
      expect.objectContaining({
        type: 'success',
        message: '下書きを更新しました',
      }),
    ]);
    expect(push).toHaveBeenCalledWith('/');
    expect(showError).not.toHaveBeenCalled();
  });

  it('送信中は押されたステータスを保持し、成功時は遷移まで維持する', async () => {
    let resolvePut: (value: unknown) => void = () => {};
    vi.mocked(put).mockReturnValue(
      new Promise((resolve) => {
        resolvePut = resolve;
      })
    );
    const showError = vi.fn();
    const { result } = renderHook(() =>
      usePostEditSubmit({ showError, postId: 1 })
    );

    let submitting: Promise<void> = Promise.resolve();
    act(() => {
      submitting = result.current.onSubmit(state, 'PUBLISHED');
    });

    expect(result.current.submittingStatus).toBe('PUBLISHED');

    await act(async () => {
      resolvePut({});
      await submitting;
    });

    // 遷移中の再送信を防ぐため、成功後も解除しない
    expect(push).toHaveBeenCalledWith('/');
    expect(result.current.submittingStatus).toBe('PUBLISHED');
  });

  it('追加画像の削除に失敗したらエラーを通知し、送信中を解除して更新しない', async () => {
    const error = new Error('delete failed');
    vi.mocked(del).mockRejectedValue(error);
    const showError = vi.fn();
    const { result } = renderHook(() =>
      usePostEditSubmit({ showError, postId: 1 })
    );

    // 本文で使われていない追加画像があると削除対象になる
    const stateWithUnusedImage = {
      ...state,
      newImages: [{ imageId: 10, url: 'https://example.com/unused.png' }],
    } as unknown as PostEditorState;

    await act(() => result.current.onSubmit(stateWithUnusedImage, 'DRAFT'));

    expect(exceptErrorHandling).toHaveBeenCalledWith(error, showError);
    expect(result.current.submittingStatus).toBeNull();
    expect(put).not.toHaveBeenCalled();
  });

  it('API エラー時はエラーを通知し、遷移しない', async () => {
    const error = new Error('timeout');
    vi.mocked(put).mockRejectedValue(error);
    const showError = vi.fn();
    const { result } = renderHook(() =>
      usePostEditSubmit({ showError, postId: 1 })
    );

    await act(() => result.current.onSubmit(state, 'DRAFT'));

    expect(exceptErrorHandling).toHaveBeenCalledWith(error, showError);
    expect(push).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
