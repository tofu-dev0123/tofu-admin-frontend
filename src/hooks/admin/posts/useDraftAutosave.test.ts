import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useDraftAutosave from '@/hooks/admin/posts/useDraftAutosave';
import { saveDraft, loadDraft } from '@/lib/utils/postDraft';

vi.mock('@/lib/utils/postDraft', () => ({
  saveDraft: vi.fn(),
  loadDraft: vi.fn(),
  clearDraft: vi.fn(),
}));

const setters = () => ({
  setTitle: vi.fn(),
  setSlug: vi.fn(),
  setContent: vi.fn(),
  setTags: vi.fn(),
});

describe('useDraftAutosave', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('slug のみの入力でも下書きを保存する', () => {
    vi.mocked(loadDraft).mockReturnValue(null);
    renderHook(() =>
      useDraftAutosave({
        title: '',
        slug: 'my-post',
        content: '',
        tags: [],
        ...setters(),
      })
    );

    act(() => {
      vi.runAllTimers();
    });

    expect(saveDraft).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'my-post' })
    );
  });

  it('復元時に slug を反映する', () => {
    vi.mocked(loadDraft).mockReturnValue({
      title: 'タイトル',
      slug: 'my-post',
      content: '本文',
      tags: ['tag'],
      savedAt: '2026-11-12T00:00:00.000Z',
    });
    const s = setters();
    const { result } = renderHook(() =>
      useDraftAutosave({ title: '', slug: '', content: '', tags: [], ...s })
    );

    act(() => result.current.restore());

    expect(s.setSlug).toHaveBeenCalledWith('my-post');
    expect(result.current.hasDraft).toBe(false);
  });

  it('slug を持たない古い下書きは slug を空で復元する', () => {
    vi.mocked(loadDraft).mockReturnValue({
      title: 'タイトル',
      content: '本文',
      tags: [],
      savedAt: '2026-11-12T00:00:00.000Z',
    });
    const s = setters();
    const { result } = renderHook(() =>
      useDraftAutosave({ title: '', slug: '', content: '', tags: [], ...s })
    );

    act(() => result.current.restore());

    expect(s.setSlug).toHaveBeenCalledWith('');
    expect(s.setTitle).toHaveBeenCalledWith('タイトル');
  });
});
