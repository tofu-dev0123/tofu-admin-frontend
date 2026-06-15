'use client';

import { useCallback, useMemo, useRef, useEffect } from 'react';
import { EditorView } from '@codemirror/view';
import type {
  PostEditorState,
  PostEditorActions,
  PostEditorUI,
} from '@/types/admin/posts';
import { useOnClickPreview } from './useOnClickPreview';
import { usePostTitle } from './usePostTitle';
import { usePostContent } from './usePostContent';
import { useThumbnail } from './useThumbnail';
import { useTags } from './useTags';
import { useImageInsertion } from './useImageInsertion';
import useErrorModal from '@/hooks/admin/common/useErrorModal';
import useEmbedLink from './useEmbedLink';
import useConfirmModal from './useConfirmModal';
import usePostEditSubmit from './usePostEditSubmit';
import type { PostEditInitialData } from '@/contexts/admin/posts/PostEditContext';

interface UsePostEditStateProps {
  postId: number;
  initialData: PostEditInitialData;
}

export function usePostEditState({
  postId,
  initialData,
}: UsePostEditStateProps) {
  const errorModalHooks = useErrorModal();
  const onClickPreviewHooks = useOnClickPreview();
  const postTitleHooks = usePostTitle();
  const postContentHooks = usePostContent();
  const thumbnailHooks = useThumbnail({
    showError: errorModalHooks.showError,
  });
  const tagsHooks = useTags({ initialTags: initialData.tags });
  const editorViewRef = useRef<EditorView | null>(null);
  const imageInsertionHooks = useImageInsertion({
    editorViewRef,
    initialImages: initialData.images,
    showError: errorModalHooks.showError,
  });
  const embedLinkHooks = useEmbedLink({
    editorViewRef,
    showError: errorModalHooks.showError,
  });
  const confirmModalHooks = useConfirmModal({
    showError: errorModalHooks.showError,
  });
  const postSubmitHooks = usePostEditSubmit({
    showError: errorModalHooks.showError,
    postId,
  });

  // 編集画面用の初期データ設定（初回のみ実行）
  useEffect(() => {
    postTitleHooks.setTitle(initialData.title);
    postContentHooks.setContent(initialData.content);
    thumbnailHooks.setImageId(initialData.thumbnailId);
    thumbnailHooks.setThumbnailUrl(initialData.thumbnailUrl);
    thumbnailHooks.setAltText(initialData.thumbnailAltText);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 初回のみ実行

  const state: PostEditorState = useMemo(
    () => ({
      // UI状態
      isPreview: onClickPreviewHooks.isPreview,
      isSubmitLoading: postSubmitHooks.isLoading,
      // 基本情報
      title: postTitleHooks.title,
      content: postContentHooks.content,
      // サムネイル情報
      thumbnailUrl: thumbnailHooks.thumbnailUrl,
      imageId: thumbnailHooks.imageId,
      altText: thumbnailHooks.altText,
      isThumbnailLoading: thumbnailHooks.isLoading,
      thumbnailDeleteFlag: thumbnailHooks.thumbnailDeleteFlag,
      loadingType: thumbnailHooks.loadingType,
      isAlertOpen: thumbnailHooks.isAlertOpen,
      previewImageUrl: thumbnailHooks.previewImageUrl,
      // タグ情報
      tags: tagsHooks.tags,
      inputValue: tagsHooks.inputValue,
      // エラーモーダル情報
      isErrorModalOpen: errorModalHooks.isOpen,
      errorMessage: errorModalHooks.errorMessage,
      // 画像挿入情報
      images: imageInsertionHooks.images,
      newImages: imageInsertionHooks.newImages,
      isImageAlertOpen: imageInsertionHooks.isImageAlertOpen,
      imagePreviewUrl: imageInsertionHooks.previewImageUrl,
      // 埋め込みリンク情報
      inputUrl: embedLinkHooks.inputUrl,
      isEmbedLinkOpen: embedLinkHooks.open,
      cursorPosition: embedLinkHooks.cursorPosition,
      // 確認モーダル情報
      isConfirmModalOpen: confirmModalHooks.isOpen,
      attachedImages: confirmModalHooks.attachedImages,
    }),
    [
      onClickPreviewHooks.isPreview,
      postSubmitHooks.isLoading,
      postTitleHooks.title,
      postContentHooks.content,
      thumbnailHooks.thumbnailUrl,
      thumbnailHooks.imageId,
      thumbnailHooks.altText,
      thumbnailHooks.isLoading,
      thumbnailHooks.thumbnailDeleteFlag,
      thumbnailHooks.loadingType,
      thumbnailHooks.isAlertOpen,
      thumbnailHooks.previewImageUrl,
      tagsHooks.tags,
      tagsHooks.inputValue,
      errorModalHooks.isOpen,
      errorModalHooks.errorMessage,
      imageInsertionHooks.images,
      imageInsertionHooks.newImages,
      imageInsertionHooks.isImageAlertOpen,
      imageInsertionHooks.previewImageUrl,
      embedLinkHooks.open,
      embedLinkHooks.cursorPosition,
      embedLinkHooks.inputUrl,
      confirmModalHooks.isOpen,
      confirmModalHooks.attachedImages,
    ]
  );

  // 編集画面用のリセット処理（初期データに戻す）
  const reset = useCallback(() => {
    postTitleHooks.setTitle(initialData.title);
    postContentHooks.setContent(initialData.content);
    thumbnailHooks.setThumbnailUrl(initialData.thumbnailUrl);
    // tagsとisPreviewのリセットは、必要に応じて各フックにリセット機能を追加
  }, [initialData, postTitleHooks, postContentHooks, thumbnailHooks]);

  const actions: PostEditorActions = useMemo(
    () => ({
      // サムネイル関連
      setThumbnailUrl: thumbnailHooks.setThumbnailUrl,
      setImageId: thumbnailHooks.setImageId,
      setAltText: thumbnailHooks.setAltText,
      // タグ関連
      addTag: tagsHooks.addTag,
      removeTag: tagsHooks.removeTag,
      setInputValue: tagsHooks.setInputValue,
      // UI状態関連
      handleThumbnailClick: thumbnailHooks.handleThumbnailClick,
      handleFileChange: thumbnailHooks.handleFileChange,
      handleDeleteThumbnail: thumbnailHooks.handleDeleteThumbnailInEdit,
      handleConfirmUpload: thumbnailHooks.handleConfirmUpload,
      handleCancelUpload: thumbnailHooks.handleCancelUpload,
      handleAlertOpenChange: thumbnailHooks.handleAlertOpenChange,
      // 基本情報関連
      setTitle: postTitleHooks.setTitle,
      setContent: postContentHooks.setContent,
      togglePreview: onClickPreviewHooks.togglePreview,
      reset,
      // エラーモーダル関連
      showError: errorModalHooks.showError,
      setIsOpen: errorModalHooks.setIsOpen,
      onClose: errorModalHooks.onClose,
      // 画像挿入関連
      handleImageIconClick: imageInsertionHooks.handleImageIconClick,
      handleImageFileChange: imageInsertionHooks.handleImageFileChange,
      handleConfirmImageInsert: imageInsertionHooks.handleConfirmNewImageInsert,
      handleCancelImageInsert: imageInsertionHooks.handleCancelImageInsert,
      handleImageAlertOpenChange:
        imageInsertionHooks.handleImageAlertOpenChange,
      // 埋め込みリンク関連
      handleOpenEmbedLink: embedLinkHooks.handleOpen,
      handleCloseEmbedLink: embedLinkHooks.handleClose,
      handleInputChange: embedLinkHooks.handleInputChange,
      handleInsert: embedLinkHooks.handleInsert,
      // 確認モーダル関連
      handleOpenConfirmModal: confirmModalHooks.onOpen,
      handleCloseConfirmModal: confirmModalHooks.onClose,
      // 投稿送信関連
      handleSubmit: postSubmitHooks.onSubmit,
    }),
    [
      thumbnailHooks.setThumbnailUrl,
      thumbnailHooks.setImageId,
      thumbnailHooks.setAltText,
      tagsHooks.addTag,
      tagsHooks.removeTag,
      tagsHooks.setInputValue,
      thumbnailHooks.handleThumbnailClick,
      thumbnailHooks.handleFileChange,
      thumbnailHooks.handleDeleteThumbnailInEdit,
      thumbnailHooks.handleConfirmUpload,
      thumbnailHooks.handleCancelUpload,
      thumbnailHooks.handleAlertOpenChange,
      postTitleHooks.setTitle,
      postContentHooks.setContent,
      onClickPreviewHooks.togglePreview,
      reset,
      errorModalHooks.showError,
      errorModalHooks.setIsOpen,
      errorModalHooks.onClose,
      imageInsertionHooks.handleImageIconClick,
      imageInsertionHooks.handleImageFileChange,
      imageInsertionHooks.handleConfirmNewImageInsert,
      imageInsertionHooks.handleCancelImageInsert,
      imageInsertionHooks.handleImageAlertOpenChange,
      embedLinkHooks.handleOpen,
      embedLinkHooks.handleClose,
      embedLinkHooks.handleInputChange,
      embedLinkHooks.handleInsert,
      confirmModalHooks.onOpen,
      confirmModalHooks.onClose,
      postSubmitHooks.onSubmit,
    ]
  );

  const ui: PostEditorUI = useMemo(
    () => ({
      thumbnailInputRef: thumbnailHooks.thumbnailInputRef,
      imageInputRef: imageInsertionHooks.imageInputRef,
      editorViewRef,
    }),
    [thumbnailHooks.thumbnailInputRef, imageInsertionHooks.imageInputRef]
  );

  return {
    state,
    actions,
    ui,
  };
}
