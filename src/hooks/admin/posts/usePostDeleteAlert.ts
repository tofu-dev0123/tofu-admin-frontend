'use client';

import { useState } from 'react';
import { del } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { PostDeleteResponse } from '@/types/api/post';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';

interface UsePostDeleteAlertProps {
  showError: (message: string[]) => void;
}

function usePostDeleteAlert({ showError }: UsePostDeleteAlertProps) {
  const [open, setOpen] = useState(false);
  const [postId, setPostId] = useState<number | null>(null);

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
    try {
      const response = await del<PostDeleteResponse>(
        API_ENDPOINTS.posts.delete(postId)
      );

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
      handleClose();
    }
  };

  return {
    open,
    handleOpen,
    handleClose,
    handleDelete,
  };
}

export default usePostDeleteAlert;
