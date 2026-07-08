'use client';

import { useCallback, useEffect, useState } from 'react';
import { saveDraft, loadDraft, clearDraft } from '@/lib/utils/postDraft';

interface UseDraftAutosaveProps {
  title: string;
  content: string;
  tags: string[];
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTags: (tags: string[]) => void;
}

// 入力停止後にまとめて保存するまでの待ち時間（ms）
const AUTOSAVE_DEBOUNCE_MS = 800;

/**
 * 新規作成中の下書きを localStorage に自動保存し、復元を提供するフック。
 */
function useDraftAutosave({
  title,
  content,
  tags,
  setTitle,
  setContent,
  setTags,
}: UseDraftAutosaveProps) {
  // マウント時に保存済み下書きがあるかを遅延初期化で判定（effect での setState を回避）
  const [hasDraft, setHasDraft] = useState(() => loadDraft() !== null);

  // 入力の debounce 保存
  useEffect(() => {
    const isEmpty =
      title.trim() === '' && content.trim() === '' && tags.length === 0;
    if (isEmpty) return;

    const timer = setTimeout(() => {
      saveDraft({
        title,
        content,
        tags,
        savedAt: new Date().toISOString(),
      });
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [title, content, tags]);

  const restore = useCallback(() => {
    const draft = loadDraft();
    if (draft) {
      setTitle(draft.title);
      setContent(draft.content);
      setTags(draft.tags);
    }
    setHasDraft(false);
  }, [setTitle, setContent, setTags]);

  const discard = useCallback(() => {
    clearDraft();
    setHasDraft(false);
  }, []);

  return { hasDraft, restore, discard };
}

export default useDraftAutosave;
