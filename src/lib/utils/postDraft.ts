/**
 * 新規作成中の記事下書きを localStorage に保全するユーティリティ。
 * テキスト（タイトル・本文・タグ）のみを対象とする。
 */

export type PostDraft = {
  title: string;
  content: string;
  tags: string[];
  savedAt: string;
};

export const DRAFT_STORAGE_KEY = 'admin:post-draft:new';

/** 下書きを保存する */
export function saveDraft(draft: PostDraft): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

/** 下書きを読み込む。無い/壊れている場合は null */
export function loadDraft(): PostDraft | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PostDraft;
  } catch {
    return null;
  }
}

/** 下書きを削除する */
export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
}
