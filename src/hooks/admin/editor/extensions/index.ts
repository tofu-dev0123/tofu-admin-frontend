import { markdown } from '@codemirror/lang-markdown';
import { Extension } from '@codemirror/state';
import { editorTheme } from './theme';
import { markdownKeymap } from './keymap';
import { editorPlaceholder } from './placeholder';
import { createUpdateListener } from './listener';
import { EditorView } from '@codemirror/view';
import { markdownFenceCompletion } from './fenceCompletion';

export function createExtensions(
  onChange: (value: string) => void
): Extension[] {
  return [
    markdown(),
    markdownKeymap,
    editorTheme,
    editorPlaceholder,
    EditorView.lineWrapping,
    createUpdateListener(onChange),
    markdownFenceCompletion,
  ];
}
