'use client';

import React, { useState, useCallback } from 'react';
import { get } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { PostResponse, Post, PostStatus } from '@/types/api/post';
import { useRouter, useSearchParams } from 'next/navigation';

interface UseSearchPostProps {
  // サーバー（RSC）で取得済みの初期一覧。以降の検索はクライアントで行う
  initial?: PostResponse;
}

function useSearchPost({ initial }: UseSearchPostProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [totalCount, setTotalCount] = useState(initial?.total_count ?? 0);
  const [totalPages, setTotalPages] = useState(initial?.total_pages ?? 0);
  const [postList, setPostList] = useState<Post[]>(initial?.posts ?? []);

  // 入力欄は URL のキーワードで初期化し、URL が変わったら同期する
  // （effect ではなく render 中比較。戻る/クリア/検索に追従させるため）。
  const urlKeyword = searchParams.get('keyword') ?? '';
  const [keyword, setKeyword] = useState<string>(urlKeyword);
  const [prevUrlKeyword, setPrevUrlKeyword] = useState<string>(urlKeyword);
  if (urlKeyword !== prevUrlKeyword) {
    setPrevUrlKeyword(urlKeyword);
    setKeyword(urlKeyword);
  }

  // 現在のステータス条件を保ったまま遷移するための共通クエリ生成
  const buildQuery = useCallback(
    (nextKeyword: string) => {
      const params = new URLSearchParams();
      const trimmed = nextKeyword.trim();
      if (trimmed) params.append('keyword', trimmed);
      const status = searchParams.get('status');
      if (status) params.append('status', status);
      const qs = params.toString();
      return qs ? `/posts?${qs}` : '/posts';
    },
    [searchParams]
  );

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

  // Enter / 検索実行。空文字ならキーワードを外して全件に戻る（ステータスは保持）。
  const handleSearch = useCallback(() => {
    router.push(buildQuery(keyword));
  }, [router, buildQuery, keyword]);

  // 入力欄の × クリア。入力を空にしてキーワードを外す（ステータスは保持）。
  const handleClear = useCallback(() => {
    setKeyword('');
    router.push(buildQuery(''));
  }, [router, buildQuery]);

  return {
    totalCount,
    totalPages,
    postList,
    keyword,
    search,
    handleSearch,
    handleClear,
    handleInputChange,
    setTotalCount,
    setTotalPages,
    setPostList,
    setKeyword,
  };
}

export default useSearchPost;
