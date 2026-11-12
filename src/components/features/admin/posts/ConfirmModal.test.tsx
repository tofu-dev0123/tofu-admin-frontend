import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '@/components/features/admin/posts/ConfirmModal';
import { usePostEditorContext } from '@/hooks/admin/posts/usePostEditorContext';
import type { PostEditorContextValue } from '@/types/admin/posts';
import type { PostStatus } from '@/types/api/post';

vi.mock('@/hooks/admin/posts/usePostEditorContext', () => ({
  usePostEditorContext: vi.fn(),
}));

const mockContext = (submittingStatus: PostStatus | null) => {
  vi.mocked(usePostEditorContext).mockReturnValue({
    state: {
      isSubmitLoading: submittingStatus !== null,
      submittingStatus,
    },
    actions: { handleSubmit: vi.fn() },
    ui: {},
  } as unknown as PostEditorContextValue);
};

describe('ConfirmModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('未送信時は公開・戻るが押せる', () => {
    mockContext(null);
    render(<ConfirmModal isOpen onClose={vi.fn()} title="記事" tags={[]} />);

    expect(screen.getByRole('button', { name: '公開' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '戻る' })).toBeEnabled();
  });

  it('公開送信中は公開が処理中表示になり、戻る・背景クリックで閉じない', () => {
    mockContext('PUBLISHED');
    const onClose = vi.fn();
    const { container } = render(
      <ConfirmModal isOpen onClose={onClose} title="記事" tags={[]} />
    );

    const publish = screen.getByRole('button', { name: '公開中…' });
    expect(publish).toHaveAttribute('aria-busy', 'true');
    expect(publish).toBeDisabled();
    expect(screen.getByRole('button', { name: '戻る' })).toBeDisabled();

    // 背景（オーバーレイ）クリックでも閉じない
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClose).not.toHaveBeenCalled();
  });
});
