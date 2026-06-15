'use client';

import { useState, useEffect } from 'react';
import { get } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { PostDetail } from '@/types/api/post';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';

interface UsePostDataProps {
  postId: number;
  showError: (message: string[]) => void;
}

export function usePostData({ postId, showError }: UsePostDataProps) {
  const [postData, setPostData] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await get<PostDetail>(
          API_ENDPOINTS.posts.edit(postId)
        );
        setPostData(response);
      } catch (error) {
        exceptErrorHandling(error, showError);
        setPostData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, showError]);

  return { postData, isLoading };
}
