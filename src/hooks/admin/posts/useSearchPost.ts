'use client';

import React, { useState, useCallback } from 'react';
import { get } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { PostResponse, Post, PostStatus } from '@/types/api/post';
import { useRouter } from 'next/navigation';

function useSearchPost() {
  const router = useRouter();
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [postList, setPostList] = useState<Post[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    },
    []
  );

  const search = useCallback(
    async (
      offset?: number,
      limit?: number,
      keyword?: string,
      status?: PostStatus
    ) => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (offset) queryParams.append('offset', offset.toString());
        if (limit) queryParams.append('limit', limit.toString());
        if (keyword) queryParams.append('keyword', keyword);
        if (status) queryParams.append('status', status);
        const response = await get<PostResponse>(
          `${API_ENDPOINTS.posts.get}?${queryParams.toString()}`
        );
        setPostList(response.posts);
        setTotalCount(response.total_count);
        setTotalPages(response.total_pages);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSearch = useCallback(async () => {
    if (!keyword) return;
    router.push(`/posts?keyword=${encodeURIComponent(keyword)}`);
  }, [router, keyword]);

  const handleReset = useCallback(() => {
    setKeyword('');
    setPostList([]);
    setTotalCount(0);
    setTotalPages(0);
    setIsLoading(true);
    router.push('/posts');
  }, [router]);

  return {
    totalCount,
    totalPages,
    postList,
    keyword,
    isLoading,
    search,
    handleSearch,
    handleInputChange,
    setTotalCount,
    setTotalPages,
    setPostList,
    setKeyword,
    handleReset,
  };
}

export default useSearchPost;
