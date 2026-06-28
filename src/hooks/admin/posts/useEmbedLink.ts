import React, { useState, useCallback } from 'react';
import { EditorView } from '@codemirror/view';
import { validate } from '@/lib/utils/validation';
import { insertLink } from '@/lib/utils/markdown';
import { dispatchMarkdownResult } from '@/hooks/admin/editor/dispatchMarkdownResult';

interface UseEmbedLinkProps {
  editorViewRef: React.RefObject<EditorView | null>;
  showError: (message: string[]) => void;
}

function useEmbedLink({ editorViewRef, showError }: UseEmbedLinkProps) {
  const [open, setOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setInputUrl('');
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputUrl(e.target.value);
    },
    []
  );

  const handleInsert = useCallback(() => {
    // URL のバリデーション
    const urlError = validate(inputUrl, 'url');
    if (urlError) {
      showError([urlError]);
      return;
    }

    const view = editorViewRef.current;
    if (view) {
      const { from, to } = view.state.selection.main;
      const result = insertLink(
        {
          text: view.state.doc.toString(),
          selectionStart: from,
          selectionEnd: to,
        },
        inputUrl
      );
      dispatchMarkdownResult(view, result);
    }

    setInputUrl('');
    setOpen(false);
  }, [editorViewRef, inputUrl, showError]);

  return {
    open,
    inputUrl,
    handleOpenChange,
    handleInputChange,
    handleInsert,
  };
}

export default useEmbedLink;
