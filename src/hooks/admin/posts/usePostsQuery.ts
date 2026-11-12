'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { queryKeys, type PostListParams } from '@/lib/api/queryKeys';
import type { PostResponse } from '@/types/api/post';

// 記事一覧のクエリ文字列を組み立てる
function buildPostListQuery(params: PostListParams): string {
  const query = new URLSearchParams();
  if (params.offset) query.append('offset', String(params.offset));
  if (params.limit) query.append('limit', String(params.limit));
  if (params.keyword) query.append('keyword', params.keyword);
  if (params.status) query.append('status', params.status);
  return query.toString();
}

/**
 * 記事一覧を取得するクエリ。
 * 条件を変えて再取得する間は前の一覧を表示し続ける（keepPreviousData）。
 */
function usePostsQuery(params: PostListParams) {
  return useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: () =>
      get<PostResponse>(
        `${API_ENDPOINTS.posts.get}?${buildPostListQuery(params)}`
      ),
    placeholderData: keepPreviousData,
  });
}

export default usePostsQuery;
