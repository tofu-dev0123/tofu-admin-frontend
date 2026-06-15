import React, { useState, useCallback } from 'react';
import { EditorView } from '@codemirror/view';
import { validate } from '@/lib/utils/validation';

interface UseEmbedLinkProps {
  editorViewRef: React.RefObject<EditorView | null>;
  showError: (message: string[]) => void;
}

function useEmbedLink({ editorViewRef, showError }: UseEmbedLinkProps) {
  const [open, setOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [inputUrl, setInputUrl] = useState('');

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const handleClose = () => {
    setOpen(false);
    setCursorPosition({ x: 0, y: 0 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };

  // CodeMirror のカーソル位置に Markdown リンクを挿入
  const insertLinkMarkdown = useCallback(
    (url: string) => {
      const view = editorViewRef.current;
      if (!view) return;

      const { from, to } = view.state.selection.main;
      const doc = view.state.doc;

      // カーソル位置の前の文字を確認
      const charBefore = from > 0 ? doc.sliceString(from - 1, from) : '';
      const needsLeadingNewline = charBefore !== '' && charBefore !== '\n';

      // 改行を追加してからリンクマークダウンを挿入
      const leadingNewline = needsLeadingNewline ? '\n' : '';
      const markdownText = `${leadingNewline}[](${url})\n`;

      view.dispatch({
        changes: { from, to, insert: markdownText },
        selection: {
          anchor: from + markdownText.length,
        },
        scrollIntoView: true,
      });

      view.focus();
    },
    [editorViewRef]
  );

  const handleInsert = () => {
    // URLのバリデーション
    const urlError = validate(inputUrl, 'url');

    if (urlError) {
      showError([urlError]);
      return;
    }

    // CodeMirror に Markdown リンクを挿入
    insertLinkMarkdown(inputUrl);

    // 入力URLをクリア
    setInputUrl('');

    // ダイアログを閉じる
    setOpen(false);
    setCursorPosition({ x: 0, y: 0 });
  };

  return {
    open,
    cursorPosition,
    inputUrl,
    handleInputChange,
    handleInsert,
    handleOpen,
    handleClose,
  };
}

export default useEmbedLink;
