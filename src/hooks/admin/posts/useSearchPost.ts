'use client';

import React, { useState, useCallback } from 'react';
import { get } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { PostResponse, Post, PostStatus } from '@/types/api/post';
import { useRouter } from 'next/navigation';

interface UseSearchPostProps {
  // サーバー（RSC）で取得済みの初期一覧。以降の検索はクライアントで行う
  initial?: PostResponse;
}

function useSearchPost({ initial }: UseSearchPostProps = {}) {
  const router = useRouter();
  const [totalCount, setTotalCount] = useState(initial?.total_count ?? 0);
  const [totalPages, setTotalPages] = useState(initial?.total_pages ?? 0);
  const [postList, setPostList] = useState<Post[]>(initial?.posts ?? []);
  const [keyword, setKeyword] = useState<string>('');

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
      // 取得完了時にまとめて差し替える。取得中は前のリストを保持し、
      // pending 表示は呼び出し側の useTransition(isPending) が担う（ちらつき防止）。
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
    },
    []
  );

  const handleSearch = useCallback(async () => {
    if (!keyword) return;
    router.push(`/posts?keyword=${encodeURIComponent(keyword)}`);
  }, [router, keyword]);

  const handleReset = useCallback(() => {
    // 入力だけクリアして /posts へ遷移する。リストの即時クリアはせず、
    // 再取得（useTransition）が完了してから差し替えてちらつきを防ぐ。
    setKeyword('');
    router.push('/posts');
  }, [router]);

  return {
    totalCount,
    totalPages,
    postList,
    keyword,
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
