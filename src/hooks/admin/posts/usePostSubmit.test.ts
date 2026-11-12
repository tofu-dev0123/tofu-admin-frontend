import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import usePostSubmit from '@/hooks/admin/posts/usePostSubmit';
import { post, del } from '@/lib/api/http';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';
import { POST_SAVE_TIMEOUT_MS } from '@/constants/admin/apiTimeout';
import { queryKeys } from '@/lib/api/queryKeys';
import { createQueryWrapper } from '@/test/queryWrapper';
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

// QueryClient 付きでフックを描画し、invalidateQueries を監視する
const setup = (showError = vi.fn()) => {
  const { wrapper, queryClient } = createQueryWrapper();
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  const { result } = renderHook(() => usePostSubmit({ showError }), {
    wrapper,
  });
  return { result, showError, invalidate };
};

describe('usePostSubmit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useToastStore.setState({ toasts: [] });
  });

  it('作成リクエストに延長したタイムアウトを指定する', async () => {
    vi.mocked(post).mockResolvedValue({});
    const { result } = setup();

    await act(() => result.current.onSubmit(state, 'DRAFT'));

    expect(post).toHaveBeenCalledWith(
      '/api/admin/posts/',
      expect.objectContaining({ status: 'DRAFT' }),
      expect.objectContaining({ timeout: POST_SAVE_TIMEOUT_MS })
    );
  });

  it('成功時は公開トーストを表示し、記事キャッシュを無効化してホームへ遷移する', async () => {
    vi.mocked(post).mockResolvedValue({});
    const { result, showError, invalidate } = setup();

    await act(() => result.current.onSubmit(state, 'PUBLISHED'));

    expect(useToastStore.getState().toasts).toEqual([
      expect.objectContaining({
        type: 'success',
        message: '記事を公開しました',
      }),
    ]);
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.posts.all,
    });
    expect(push).toHaveBeenCalledWith('/');
    expect(showError).not.toHaveBeenCalled();
  });

  it('送信中は押されたステータスを保持し、成功時は遷移まで維持する', async () => {
    let resolvePost: (value: unknown) => void = () => {};
    vi.mocked(post).mockReturnValue(
      new Promise((resolve) => {
        resolvePost = resolve;
      })
    );
    const { result } = setup();

    let submitting: Promise<void> = Promise.resolve();
    act(() => {
      submitting = result.current.onSubmit(state, 'DRAFT');
    });

    expect(result.current.submittingStatus).toBe('DRAFT');
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePost({});
      await submitting;
    });

    // 遷移中の再送信を防ぐため、成功後も解除しない
    expect(push).toHaveBeenCalledWith('/');
    expect(result.current.submittingStatus).toBe('DRAFT');
  });

  it('不要画像の削除に失敗したらエラーを通知し、送信中を解除して投稿しない', async () => {
    const error = new Error('delete failed');
    vi.mocked(del).mockRejectedValue(error);
    const { result, showError } = setup();

    // 本文で使われていない画像があると削除対象になる
    const stateWithUnusedImage = {
      ...state,
      images: [{ imageId: 10, url: 'https://example.com/unused.png' }],
    } as unknown as PostEditorState;

    await act(() => result.current.onSubmit(stateWithUnusedImage, 'DRAFT'));

    expect(exceptErrorHandling).toHaveBeenCalledWith(error, showError);
    expect(result.current.submittingStatus).toBeNull();
    expect(post).not.toHaveBeenCalled();
  });

  it('API エラー時はエラーを通知し、無効化も遷移もしない', async () => {
    const error = new Error('timeout');
    vi.mocked(post).mockRejectedValue(error);
    const { result, showError, invalidate } = setup();

    await act(() => result.current.onSubmit(state, 'DRAFT'));

    expect(exceptErrorHandling).toHaveBeenCalledWith(error, showError);
    expect(invalidate).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.submittingStatus).toBeNull();
  });
});
