'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { EditorView } from '@codemirror/view';
import { uploadFile } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { ImagesUploadResponse } from '@/types/api/imagesUpload';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { validate } from '@/lib/utils/validation';
import { MESSAGES } from '@/constants/messages';
import { THUMBNAIL_MAX_FILE_SIZE } from '@/constants/admin/fileFormats';
import { logger } from '@/lib/logger';
import { insertImage } from '@/lib/utils/markdown';
import { dispatchMarkdownResult } from '@/hooks/admin/editor/dispatchMarkdownResult';

interface UseImageInsertionProps {
  editorViewRef: React.RefObject<EditorView | null>;
  showError: (message: string[]) => void;
  initialImages?: ImageInsertionState[];
}

export interface ImageInsertionState {
  imageId: number;
  url: string;
}

export function useImageInsertion({
  editorViewRef,
  showError,
  initialImages,
}: UseImageInsertionProps) {
  const [images, setImages] = useState<ImageInsertionState[]>(
    initialImages ?? []
  );
  // 編集画面で新たに追加された画像データ（編集画面のみ）
  const [newImages, setNewImages] = useState<ImageInsertionState[]>([]);
  const [isImageAlertOpen, setIsImageAlertOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pendingFileRef = useRef<File | null>(null);

  // 初期画像データを prop の変化に追従して設定
  // （effect ではなく render 中に前回値と比較して更新する React 推奨パターン）
  const [prevInitialImages, setPrevInitialImages] = useState(initialImages);
  if (initialImages !== prevInitialImages) {
    setPrevInitialImages(initialImages);
    if (initialImages && initialImages.length > 0) {
      setImages(initialImages);
    }
  }

  // CodeMirror のカーソル位置に画像 Markdown を挿入（純粋関数 + 共通 dispatch）
  const insertImageMarkdown = useCallback(
    (imageUrl: string) => {
      const view = editorViewRef.current;
      if (!view) return;

      const { from, to } = view.state.selection.main;
      const result = insertImage(
        {
          text: view.state.doc.toString(),
          selectionStart: from,
          selectionEnd: to,
        },
        imageUrl
      );
      dispatchMarkdownResult(view, result);
    },
    [editorViewRef]
  );

  // 画像アイコンクリック時にファイル選択ダイアログを開く
  const handleImageIconClick = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  // ファイル選択時の処理
  const handleImageFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // ファイルサイズのバリデーション
      const fileSizeError = validate(file, 'maxFileSize', {
        maxSize: THUMBNAIL_MAX_FILE_SIZE,
        message: MESSAGES.validation.thumbnail.maxFileSize,
      });

      if (fileSizeError) {
        showError([fileSizeError]);
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
        return;
      }

      // 既存のプレビューURLを解放
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }

      // 新しいプレビューURLを生成
      const previewUrl = URL.createObjectURL(file);
      setPreviewImageUrl(previewUrl);
      pendingFileRef.current = file;
      setIsImageAlertOpen(true);
    },
    [previewImageUrl, showError]
  );

  // 画像アップロードとMarkdown挿入の共通処理
  const uploadAndInsertImage = useCallback(
    async (addImage: (image: ImageInsertionState) => void) => {
      const file = pendingFileRef.current;
      if (!file) {
        setIsImageAlertOpen(false);
        return;
      }

      setIsUploadingImage(true);

      try {
        const formData = new FormData();
        formData.append('image_file', file);
        formData.append('alt_text', ''); // 空文字列をデフォルトとして使用

        const response = await uploadFile<ImagesUploadResponse>(
          API_ENDPOINTS.images.post,
          formData
        );

        // CodeMirror に Markdown を挿入
        insertImageMarkdown(response.url);

        // 画像情報を追加
        addImage({ imageId: response.image_id, url: response.url });
        logger.info('[images] 画像をアップロードしました', {
          imageId: response.image_id,
        });

        pendingFileRef.current = null;

        // プレビューURLを解放
        if (previewImageUrl) {
          URL.revokeObjectURL(previewImageUrl);
          setPreviewImageUrl(null);
        }
      } catch (error) {
        exceptErrorHandling(error, showError);
        pendingFileRef.current = null;

        // エラー時もプレビューURLを解放
        if (previewImageUrl) {
          URL.revokeObjectURL(previewImageUrl);
          setPreviewImageUrl(null);
        }
      } finally {
        // アップロード完了（成功・失敗どちらでも）でダイアログを閉じる
        setIsUploadingImage(false);
        setIsImageAlertOpen(false);
        // ファイル入力をリセット
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      }
    },
    [showError, insertImageMarkdown, previewImageUrl]
  );

  // 確認ダイアログでOKを押した時の処理（アップロード → 挿入）
  const handleConfirmImageInsert = useCallback(async () => {
    await uploadAndInsertImage((image) => {
      setImages((prevImages) => [...prevImages, image]);
    });
  }, [uploadAndInsertImage]);

  // キャンセル時の処理
  const handleCancelImageInsert = useCallback(() => {
    pendingFileRef.current = null;
    // プレビューURLを解放
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
      setPreviewImageUrl(null);
    }
    // ファイル入力の値をリセット
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  }, [previewImageUrl]);

  // アラートの開閉を制御する
  const handleImageAlertOpenChange = useCallback(
    (open: boolean) => {
      setIsImageAlertOpen(open);
      if (!open && pendingFileRef.current) {
        // アラートが閉じられたときに、まだファイルが残っている場合はキャンセル処理を実行
        pendingFileRef.current = null;
        // プレビューURLを解放
        if (previewImageUrl) {
          URL.revokeObjectURL(previewImageUrl);
          setPreviewImageUrl(null);
        }
        // ファイル入力の値をリセット
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      }
    },
    [previewImageUrl]
  );

  // コンポーネントのアンマウント時にプレビューURLを解放
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  // 確認ダイアログでOKを押した時の処理（編集画面で新たに追加された画像データの挿入）
  const handleConfirmNewImageInsert = useCallback(async () => {
    await uploadAndInsertImage((image) => {
      setNewImages((prevImages) => [...prevImages, image]);
    });
  }, [uploadAndInsertImage]);

  return {
    images,
    newImages,
    isImageAlertOpen,
    isUploadingImage,
    previewImageUrl,
    imageInputRef,
    setImages,
    handleImageIconClick,
    handleImageFileChange,
    handleConfirmImageInsert,
    handleConfirmNewImageInsert,
    handleCancelImageInsert,
    handleImageAlertOpenChange,
  };
}
