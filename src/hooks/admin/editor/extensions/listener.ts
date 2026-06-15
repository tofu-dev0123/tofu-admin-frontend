import { EditorView } from '@codemirror/view';

export function createUpdateListener(onChange: (value: string) => void) {
  return EditorView.updateListener.of((v) => {
    if (v.docChanged) {
      onChange(v.state.doc.toString());
    }
  });
}
