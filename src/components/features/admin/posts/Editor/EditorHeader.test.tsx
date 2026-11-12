import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import EditorHeader from '@/components/features/admin/posts/Editor/EditorHeader';
import { usePostEditorContext } from '@/hooks/admin/posts/usePostEditorContext';
import type { PostEditorContextValue } from '@/types/admin/posts';
import type { PostStatus } from '@/types/api/post';

vi.mock('@/hooks/admin/posts/usePostEditorContext', () => ({
  usePostEditorContext: vi.fn(),
}));

// 任意の action / ref を返すモック（表示の検証に必要な値だけ state で指定する）
const anyActions = new Proxy({}, { get: () => vi.fn() });
const anyRefs = new Proxy({}, { get: () => ({ current: null }) });

const mockContext = (submittingStatus: PostStatus | null) => {
  vi.mocked(usePostEditorContext).mockReturnValue({
    state: {
      isPreview: false,
      isSubmitLoading: submittingStatus !== null,
      submittingStatus,
      isEmbedLinkOpen: false,
      inputUrl: '',
      title: '',
      content: '',
      tags: [],
      thumbnailUrl: null,
    },
    actions: anyActions,
    ui: anyRefs,
  } as unknown as PostEditorContextValue);
};

describe('EditorHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('未送信時は下書き保存・公開・ツールバーが押せる', () => {
    mockContext(null);
    render(<EditorHeader />);

    expect(screen.getByRole('button', { name: '下書き保存' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '公開' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '画像挿入' })).toBeEnabled();
  });

  it('下書き送信中は下書き保存が処理中表示になり、公開とツールバーは無効', () => {
    mockContext('DRAFT');
    render(<EditorHeader />);

    const draft = screen.getByRole('button', { name: '保存中…' });
    expect(draft).toHaveAttribute('aria-busy', 'true');
    expect(draft).toBeDisabled();
    expect(screen.getByRole('button', { name: '公開' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '画像挿入' })).toBeDisabled();
  });
});
