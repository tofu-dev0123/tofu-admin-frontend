'use client';

import { useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { createExtensions } from './extensions';

export function useMarkdownEditor(
  value: string,
  onChange: (value: string) => void,
  isPreview: boolean
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const isInitializedRef = useRef(false);
  const initialValueRef = useRef<string>('');

  useEffect(() => {
    // プレビューモードの場合はエディタを初期化しない
    if (isPreview || !containerRef.current) return;

    // 既存のエディタがあれば破棄
    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
      isInitializedRef.current = false;
    }

    const state = EditorState.create({
      doc: value,
      extensions: createExtensions(onChange),
    });

    viewRef.current = new EditorView({
      state,
      parent: containerRef.current,
    });

    isInitializedRef.current = true;
    initialValueRef.current = value;

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
      isInitializedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreview, onChange]);

  // 初期データの設定：エディタが初期化された後、エディタの内容が空でvalueが設定された場合のみ更新
  useEffect(() => {
    if (!isPreview && viewRef.current && isInitializedRef.current) {
      const currentContent = viewRef.current.state.doc.toString();

      // 初期データの設定：エディタの内容が空で、valueが空でない場合のみ更新
      // これにより、初期データが後から設定された場合でも表示される
      if (
        currentContent === '' &&
        value !== '' &&
        initialValueRef.current === ''
      ) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: 0,
            insert: value,
          },
        });
        initialValueRef.current = value;
      }
    }
  }, [value, isPreview]);

  return {
    containerRef,
    viewRef,
  };
}
