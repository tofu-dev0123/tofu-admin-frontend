'use client';

import { useState } from 'react';
import { patch } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import {
  PostStatus,
  PostStatusPatchRequest,
  PostStatusPatchResponse,
} from '@/types/api/post';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';
import { logger } from '@/lib/logger';

interface UsePatchStatusAlertProps {
  showError: (message: string[]) => void;
}

function usePatchStatusAlert({ showError }: UsePatchStatusAlertProps) {
  const [open, setOpen] = useState(false);
  const [postId, setPostId] = useState<number | null>(null);
  const [status, setStatus] = useState<PostStatus | null>(null);
  // 変更処理中フラグ（成功時はリロードまで維持する）
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpen = (id: number, status: PostStatus) => {
    setOpen(true);
    setPostId(id);
    setStatus(status);
  };

  const handleClose = () => {
    setOpen(false);
    setPostId(null);
    setStatus(null);
  };

  const handlePatchStatus = async () => {
    if (!postId || !status) return;
    const request: PostStatusPatchRequest = {
      status,
    };
    setIsProcessing(true);
    try {
      const response = await patch<PostStatusPatchResponse>(
        API_ENDPOINTS.posts.patchStatus(postId),
        request
      );
      logger.info('[posts] 投稿ステータスを変更しました', { postId, status });

      const message = response.message;
      useToastStore.getState().show({
        type: 'success',
        message: message,
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
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
    handlePatchStatus,
  };
}

export default usePatchStatusAlert;
