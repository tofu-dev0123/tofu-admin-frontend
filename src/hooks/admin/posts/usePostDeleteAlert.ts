'use client';

import { useState } from 'react';
import { del } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { PostDeleteResponse } from '@/types/api/post';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';
import { logger } from '@/lib/logger';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';

interface UsePostDeleteAlertProps {
  showError: (message: string[]) => void;
}

function usePostDeleteAlert({ showError }: UsePostDeleteAlertProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [postId, setPostId] = useState<number | null>(null);
  // 削除処理中フラグ（成功時は一覧の再取得完了まで維持する）
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpen = (id: number) => {
    setOpen(true);
    setPostId(id);
  };

  const handleClose = () => {
    setOpen(false);
    setPostId(null);
  };

  const handleDelete = async () => {
    if (!postId) return;
    setIsProcessing(true);
    try {
      const response = await del<PostDeleteResponse>(
        API_ENDPOINTS.posts.delete(postId)
      );
      logger.info('[posts] 投稿を削除しました', { postId });

      const message = response.message;
      useToastStore.getState().show({
        type: 'success',
        message: message,
      });
      // 一覧・サマリを再取得してから閉じる（完了まで処理中表示を維持）
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      setIsProcessing(false);
      handleClose();
    } catch (error) {
      exceptErrorHandling(error, showError);
      setIsProcessing(false);
      handleClose();
    }
  };

  return {
    open,
    isProcessing,
    handleOpen,
    handleClose,
    handleDelete,
  };
}

export default usePostDeleteAlert;
