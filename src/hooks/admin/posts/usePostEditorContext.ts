'use client';

import { useContext } from 'react';
import type { PostEditorContextValue } from '@/types/admin/posts';
import { PostEditorContext } from '@/contexts/admin/posts/PostEditorContext';
import { PostEditContext } from '@/contexts/admin/posts/PostEditContext';

/**
 * 登録画面と編集画面の両方で使用できる共通のコンテキストフック
 * どちらのコンテキストが利用可能かを自動的に判定します
 */
export function usePostEditorContext(): PostEditorContextValue {
  const createContext = useContext(PostEditorContext);
  const editContext = useContext(PostEditContext);

  if (createContext !== undefined) {
    return createContext;
  }

  if (editContext !== undefined) {
    return editContext;
  }

  throw new Error(
    'usePostEditorContext must be used within a PostEditorProvider or PostEditProvider'
  );
}
