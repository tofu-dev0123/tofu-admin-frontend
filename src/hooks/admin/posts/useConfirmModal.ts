import { useState, useCallback } from 'react';
import { validatePostSubmission } from '@/services/admin/posts/validatePostSubmission';
import { extractImageUrls } from '@/services/admin/posts/extractImageUrls';

interface UseConfirmModalProps {
  showError: (message: string[]) => void;
}

function useConfirmModal({ showError }: UseConfirmModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);

  const onOpen = useCallback(
    (thumbnailUrl: string, title: string, tags: string[], content: string) => {
      // バリデーションチェック
      const errorMessage = validatePostSubmission(
        thumbnailUrl,
        title,
        tags,
        content
      );
      if (errorMessage.length > 0) {
        showError(errorMessage);
        return;
      }

      // 画像URLを抽出
      const imageUrls = extractImageUrls(content);
      if (imageUrls.length > 0) {
        setAttachedImages(imageUrls);
      }

      // 確認モーダルを開く
      setIsOpen(true);
    },
    [showError]
  );

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, attachedImages, onOpen, onClose };
}

export default useConfirmModal;
