import { EditorView } from '@codemirror/view';

export const editorTheme = EditorView.baseTheme({
  '&.cm-editor': {
    resize: 'none', // resize-none
    width: '100%',
    height: '100%',
    letterSpacing: '0.05em', // 文字間隔を少し広げる
    fontSize: '1rem',
  },
  '&.cm-editor.cm-focused': {
    outline: 'none',
  },
  '.cm-content': {
    padding: 0,
    minHeight: '20rem', // minRows={20} 相当
    lineHeight: '1.5', // 読みやすい行間を設定
    letterSpacing: '0.05em', // 文字間隔を少し広げる
  },
  '.cm-line': {
    lineHeight: '1.5', // 読みやすい行間を設定
    padding: '0.125rem 0', // 行間を広げるためのパディング
    letterSpacing: '0.05em', // 文字間隔を少し広げる
  },
  '.cm-placeholder': {
    color: '#9ca3af', // text-gray-400
    fontWeight: 'bold',
  },
});
