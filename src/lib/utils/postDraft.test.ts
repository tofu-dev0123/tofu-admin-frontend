import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveDraft,
  loadDraft,
  clearDraft,
  DRAFT_STORAGE_KEY,
  type PostDraft,
} from '@/lib/utils/postDraft';

const sample: PostDraft = {
  title: 'タイトル',
  content: '本文',
  tags: ['tag1', 'tag2'],
  savedAt: '2026-07-08T00:00:00.000Z',
};

describe('postDraft', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('保存した下書きをそのまま読み込める', () => {
    saveDraft(sample);
    expect(loadDraft()).toEqual(sample);
  });

  it('下書きが無いときは null を返す', () => {
    expect(loadDraft()).toBeNull();
  });

  it('clearDraft で削除される', () => {
    saveDraft(sample);
    clearDraft();
    expect(loadDraft()).toBeNull();
  });

  it('壊れた JSON のときは null を返す', () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, '{ invalid json');
    expect(loadDraft()).toBeNull();
  });
});
