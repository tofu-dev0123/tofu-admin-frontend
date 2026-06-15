import type { RefObject } from 'react';
import type { EditorView } from '@codemirror/view';
import type { ImageInsertionState } from '@/hooks/admin/posts/useImageInsertion';
import type { PostStatus } from '@/types/api/post';

export interface PostEditorState {
  // UI状態
  isPreview: boolean;
  isSubmitLoading: boolean;
  // 基本情報
  title: string;
  content: string;

  // サムネイル情報
  thumbnailUrl: string | null;
  imageId: number | null;
  altText: string | null;
  isThumbnailLoading: boolean;
  loadingType: 'upload' | 'delete' | null;
  isAlertOpen: boolean;
  previewImageUrl: string | null;
  thumbnailDeleteFlag?: boolean;

  // タグ情報
  tags: string[];
  inputValue: string;

  // エラーモーダル情報
  isErrorModalOpen: boolean;
  errorMessage: string[];

  // 画像挿入情報
  images: ImageInsertionState[];
  newImages?: ImageInsertionState[];
  isImageAlertOpen: boolean;
  imagePreviewUrl: string | null;

  // 埋め込みリンク情報
  inputUrl: string;
  isEmbedLinkOpen: boolean;
  cursorPosition: { x: number; y: number };

  // 確認モーダル情報
  isConfirmModalOpen: boolean;
  attachedImages: string[];
}

export interface PostEditorActions {
  // 基本情報関連
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setThumbnailUrl: (url: string | null) => void;
  setImageId: (id: number | null) => void;
  setAltText: (text: string | null) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  setInputValue: (value: string) => void;
  togglePreview: () => void;
  reset: () => void;
  // サムネイル関連
  handleThumbnailClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteThumbnail: () => void;
  handleConfirmUpload: () => void;
  handleCancelUpload: () => void;
  handleAlertOpenChange: (open: boolean) => void;
  showError: (message: string[]) => void;
  setIsOpen: (open: boolean) => void;
  onClose: () => void;
  // 画像挿入関連
  handleImageIconClick: () => void;
  handleImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmImageInsert: () => void;
  handleCancelImageInsert: () => void;
  handleImageAlertOpenChange: (open: boolean) => void;
  // 埋め込みリンク関連
  handleOpenEmbedLink: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleCloseEmbedLink: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInsert: () => void;
  // 確認モーダル関連
  handleOpenConfirmModal: (
    thumbnailUrl: string,
    title: string,
    tags: string[],
    content: string
  ) => void;
  handleCloseConfirmModal: () => void;
  // 投稿送信関連
  handleSubmit: (state: PostEditorState, status: PostStatus) => void;
}

export interface PostEditorUI {
  // サムネイル情報
  thumbnailInputRef: RefObject<HTMLInputElement | null>;
  // 画像挿入情報
  imageInputRef: RefObject<HTMLInputElement | null>;
  editorViewRef: RefObject<EditorView | null>;
}

export interface PostEditorContextValue {
  state: PostEditorState;
  actions: PostEditorActions;
  ui: PostEditorUI;
}
