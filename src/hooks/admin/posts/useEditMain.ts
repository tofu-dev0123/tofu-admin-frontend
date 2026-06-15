'use client';

import { useParams } from 'next/navigation';
import { usePostData } from './usePostData';
import useErrorModal from '@/hooks/admin/common/useErrorModal';

export function useEditMain() {
  const params = useParams();
  const postId = Number(params.id);
  const errorModalHook = useErrorModal();
  const { postData, isLoading } = usePostData({
    postId,
    showError: errorModalHook.showError,
  });

  return {
    postId,
    postData,
    isLoading,
    errorModalHook,
  };
}
