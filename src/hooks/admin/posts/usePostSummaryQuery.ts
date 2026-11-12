'use client';

import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { queryKeys } from '@/lib/api/queryKeys';
import type { SummaryResponse } from '@/types/api/summary';

/** 投稿サマリ（総数・公開数・下書き数）を取得するクエリ */
function usePostSummaryQuery() {
  return useQuery({
    queryKey: queryKeys.posts.summary,
    queryFn: () => get<SummaryResponse>(API_ENDPOINTS.summary.get),
  });
}

export default usePostSummaryQuery;
