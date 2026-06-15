'use client';

import { useCallback, useMemo, useRef } from 'react';
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
import usePostSubmit from './usePostSubmit';

export function usePostState() {
  const errorModalHooks = useErrorModal();
  const onClickPreviewHooks = useOnClickPreview();
  const postTitleHooks = usePostTitle();
  const postContentHooks = usePostContent();
  const thumbnailHooks = useThumbnail({
    showError: errorModalHooks.showError,
  });
  const tagsHooks = useTags();
  const editorViewRef = useRef<EditorView | null>(null);
  const imageInsertionHooks = useImageInsertion({
    editorViewRef,
    showError: errorModalHooks.showError,
  });
  const embedLinkHooks = useEmbedLink({
    editorViewRef,
    showError: errorModalHooks.showError,
  });
  const confirmModalHooks = useConfirmModal({
    showError: errorModalHooks.showError,
  });
  const postSubmitHooks = usePostSubmit({
    showError: errorModalHooks.showError,
  });

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
      thumbnailHooks.loadingType,
      thumbnailHooks.isAlertOpen,
      thumbnailHooks.previewImageUrl,
      tagsHooks.tags,
      tagsHooks.inputValue,
      errorModalHooks.isOpen,
      errorModalHooks.errorMessage,
      imageInsertionHooks.images,
      imageInsertionHooks.isImageAlertOpen,
      imageInsertionHooks.previewImageUrl,
      embedLinkHooks.open,
      embedLinkHooks.cursorPosition,
      embedLinkHooks.inputUrl,
      confirmModalHooks.isOpen,
      confirmModalHooks.attachedImages,
    ]
  );

  const reset = useCallback(() => {
    postTitleHooks.setTitle('');
    postContentHooks.setContent('');
    thumbnailHooks.setThumbnailUrl(null);
    // tagsとisPreviewのリセットは、必要に応じて各フックにリセット機能を追加
  }, [postTitleHooks, postContentHooks, thumbnailHooks]);

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
      handleDeleteThumbnail: thumbnailHooks.handleDeleteThumbnail,
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
      handleConfirmImageInsert: imageInsertionHooks.handleConfirmImageInsert,
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
      // 基本情報関連
      postTitleHooks.setTitle,
      postContentHooks.setContent,
      thumbnailHooks.setThumbnailUrl,
      thumbnailHooks.setImageId,
      thumbnailHooks.setAltText,
      onClickPreviewHooks.togglePreview,
      reset,
      // タグ関連
      tagsHooks.addTag,
      tagsHooks.removeTag,
      tagsHooks.setInputValue,
      // UI状態関連
      thumbnailHooks.handleThumbnailClick,
      thumbnailHooks.handleFileChange,
      thumbnailHooks.handleDeleteThumbnail,
      thumbnailHooks.handleConfirmUpload,
      thumbnailHooks.handleCancelUpload,
      thumbnailHooks.handleAlertOpenChange,
      // エラーモーダル関連
      errorModalHooks.showError,
      errorModalHooks.setIsOpen,
      errorModalHooks.onClose,
      // 画像挿入関連
      imageInsertionHooks.handleImageIconClick,
      imageInsertionHooks.handleImageFileChange,
      imageInsertionHooks.handleConfirmImageInsert,
      imageInsertionHooks.handleCancelImageInsert,
      imageInsertionHooks.handleImageAlertOpenChange,
      // 埋め込みリンク関連
      embedLinkHooks.handleOpen,
      embedLinkHooks.handleClose,
      embedLinkHooks.handleInputChange,
      embedLinkHooks.handleInsert,
      // 確認モーダル関連
      confirmModalHooks.onOpen,
      confirmModalHooks.onClose,
      // 投稿送信関連
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
