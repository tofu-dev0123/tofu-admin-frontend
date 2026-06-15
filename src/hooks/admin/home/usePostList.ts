'use client';

import { useState, useCallback } from 'react';
import type { Post, PostResponse, PostStatus } from '@/types/api/post';
import { get } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';

interface UsePostListProps {
  showError: (message: string[]) => void;
}

function usePostList({ showError }: UsePostListProps) {
  const [postList, setPostList] = useState<Post[]>([]);
  const [draftPostList, setDraftPostList] = useState<Post[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const getPostList = useCallback(
    async (params: {
      offset?: number;
      limit?: number;
      keyword?: string;
      status?: PostStatus;
    }) => {
      const { offset, limit, keyword, status } = params;
      const queryParams = new URLSearchParams();

      if (offset) queryParams.append('offset', offset.toString());
      if (limit) queryParams.append('limit', limit.toString());
      if (keyword) queryParams.append('keyword', keyword);
      if (status) queryParams.append('status', status);

      try {
        const response = await get<PostResponse>(
          `${API_ENDPOINTS.posts.get}?${queryParams.toString()}`
        );
        if (status === 'DRAFT') {
          setDraftPostList(response.posts);
        } else {
          setPostList(response.posts);
        }
        setTotalCount(response.total_count);
        setTotalPages(response.total_pages);
      } catch (error) {
        exceptErrorHandling(error, showError);
      }
    },
    [showError]
  );

  return {
    postList,
    draftPostList,
    totalCount,
    totalPages,
    getPostList,
  };
}

export default usePostList;
