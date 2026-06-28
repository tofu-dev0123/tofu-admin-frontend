// Markdown 書式変換の純粋関数で扱う選択状態。
// textarea / CodeMirror 双方に依存しない汎用的な表現。
export interface SelectionState {
  // ドキュメント全文
  text: string;
  // 選択開始位置（カーソルのみの場合は selectionEnd と同値）
  selectionStart: number;
  // 選択終了位置
  selectionEnd: number;
}

// 変換結果。SelectionState と同じ形（新しい全文と新しい選択範囲）。
export type StyleResult = SelectionState;
