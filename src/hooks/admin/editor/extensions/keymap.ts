import { keymap } from '@codemirror/view';
import { insertNewlineContinueMarkup } from '@codemirror/lang-markdown';

export const markdownKeymap = keymap.of([
  { key: 'Enter', run: insertNewlineContinueMarkup },
]);
