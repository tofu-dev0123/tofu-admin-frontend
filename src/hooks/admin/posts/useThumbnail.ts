'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { uploadFile, del } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { ImagesUploadResponse } from '@/types/api/imagesUpload';
import { ImagesDeleteResponse } from '@/types/api/imagesDelete';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { validate } from '@/lib/utils/validation';
import { MESSAGES } from '@/constants/messages';
import { THUMBNAIL_MAX_FILE_SIZE } from '@/constants/admin/fileFormats';
import { cropImageToBlob } from '@/lib/utils/imageCrop';

interface UseThumbnailProps {
  showError: (message: string[]) => void;
}

export function useThumbnail({ showError }: UseThumbnailProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [loadingType, setLoadingType] = useState<'upload' | 'delete' | null>(
    null
  );
  const [imageId, setImageId] = useState<number | null>(null);
  const [thumbnailUrl, setThumbnailUrlState] = useState<string | null>(null);
  const [altText, setAltText] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [thumbnailDeleteFlag, setThumbnailDeleteFlag] = useState(false);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const pendingFileRef = useRef<File | null>(null);

  const handleThumbnailClick = () => {
    thumbnailInputRef.current?.click();
  };

  /* 
  ファイル選択でアラートを表示する
  */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // ファイルサイズのバリデーション
      const fileSizeError = validate(file, 'maxFileSize', {
        maxSize: THUMBNAIL_MAX_FILE_SIZE,
        message: MESSAGES.validation.thumbnail.maxFileSize,
      });

      if (fileSizeError) {
        // エラーメッセージを設定してモーダルを開く
        showError([fileSizeError]);
        // ファイル入力をリセット
        if (thumbnailInputRef.current) {
          thumbnailInputRef.current.value = '';
        }
        return; // エラーがある場合は処理を中断
      }

      // 既存のプレビューURLを解放
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }

      // 新しいプレビューURLを生成
      const previewUrl = URL.createObjectURL(file);
      setPreviewImageUrl(previewUrl);
      pendingFileRef.current = file;
      setIsAlertOpen(true);
    },
    [previewImageUrl, showError]
  );

  const setThumbnailUrl = useCallback((url: string | null) => {
    setThumbnailUrlState(url);
  }, []);

  /* 画像を削除する */
  const handleDeleteThumbnail = useCallback(async () => {
    if (!imageId) return;
    setIsLoading(true);
    setLoadingType('delete');

    try {
      await del<ImagesDeleteResponse>(API_ENDPOINTS.images.delete(imageId));

      setThumbnailUrl(null);
      setImageId(null);
      setAltText(null);
      setThumbnailDeleteFlag(true);
      // ファイル入力の値をリセット
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = '';
      }
    } catch (error) {
      // エラー時は先にローディング状態をリセットしてからエラーモーダルを表示
      setIsLoading(false);
      setLoadingType(null);
      exceptErrorHandling(error, showError);
      setThumbnailDeleteFlag(false);
      return; // エラー時は finally ブロックの処理をスキップ
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  }, [imageId, showError, setThumbnailUrl]);

  /* 編集画面での画像削除処理 */
  const handleDeleteThumbnailInEdit = useCallback(() => {
    if (!imageId) return;
    setThumbnailUrl(null);
    setImageId(null);
    setAltText(null);
    setThumbnailDeleteFlag(true);
    // ファイル入力の値をリセット
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  }, [
    imageId,
    setThumbnailUrl,
    setImageId,
    setAltText,
    setThumbnailDeleteFlag,
    thumbnailInputRef,
  ]);

  /* アラートの保存ボタン押下時にアップロード処理を実行 */
  const handleConfirmUpload = useCallback(async () => {
    const file = pendingFileRef.current;
    if (!file) {
      setIsAlertOpen(false);
      return;
    }

    setIsAlertOpen(false);
    setIsLoading(true);
    setLoadingType('upload');

    try {
      // プレビューURLを使用して画像をトリミング
      if (!previewImageUrl) {
        throw new Error('Preview image URL is not available');
      }

      const croppedBlob = await cropImageToBlob(previewImageUrl, 16 / 9);

      // 元のファイル名を保持しつつ、拡張子を.jpgに統一
      const fileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
      const croppedFile = new File([croppedBlob], fileName, {
        type: 'image/jpeg',
      });

      const formData = new FormData();
      formData.append('image_file', croppedFile);
      formData.append('alt_text', fileName);

      const response = await uploadFile<ImagesUploadResponse>(
        API_ENDPOINTS.images.post,
        formData
      );
      setThumbnailUrl(response.url);
      setImageId(response.image_id);
      setAltText(response.alt_text);
      pendingFileRef.current = null;

      // プレビューURLを解放
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
        setPreviewImageUrl(null);
      }
    } catch (error) {
      // エラー時は先にローディング状態をリセットしてからエラーモーダルを表示
      setIsLoading(false);
      setLoadingType(null);
      exceptErrorHandling(error, showError);
      pendingFileRef.current = null;

      // エラー時もプレビューURLを解放
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
        setPreviewImageUrl(null);
      }
      return; // エラー時は finally ブロックの処理をスキップ
    } finally {
      setIsLoading(false);
      setLoadingType(null);
      setThumbnailDeleteFlag(false);
    }
  }, [showError, setThumbnailUrl, previewImageUrl]);

  /* アラートのキャンセルボタン押下時の処理 */
  const handleCancelUpload = useCallback(() => {
    pendingFileRef.current = null;
    // プレビューURLを解放
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
      setPreviewImageUrl(null);
    }
    // ファイル入力の値をリセット
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  }, [previewImageUrl]);

  /* アラートの開閉を制御する（ダイアログの外側クリックやESCキーで閉じられた場合の処理） */
  const handleAlertOpenChange = useCallback(
    (open: boolean) => {
      setIsAlertOpen(open);
      if (!open && pendingFileRef.current) {
        // アラートが閉じられたときに、まだファイルが残っている場合はキャンセル処理を実行
        pendingFileRef.current = null;
        // プレビューURLを解放
        if (previewImageUrl) {
          URL.revokeObjectURL(previewImageUrl);
          setPreviewImageUrl(null);
        }
        // ファイル入力の値をリセット
        if (thumbnailInputRef.current) {
          thumbnailInputRef.current.value = '';
        }
      }
    },
    [previewImageUrl]
  );

  /* コンポーネントのアンマウント時にプレビューURLを解放 */
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  return {
    thumbnailUrl,
    altText,
    imageId,
    isLoading,
    loadingType,
    isAlertOpen,
    previewImageUrl,
    thumbnailInputRef,
    thumbnailDeleteFlag,
    handleThumbnailClick,
    handleFileChange,
    handleDeleteThumbnail,
    handleConfirmUpload,
    handleCancelUpload,
    handleAlertOpenChange,
    setThumbnailUrl,
    setImageId,
    setAltText,
    handleDeleteThumbnailInEdit,
  };
}
