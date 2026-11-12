'use client';

import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { queryKeys } from '@/lib/api/queryKeys';
import type { TimelineListResponse } from '@/types/api/about';

/** 年表一覧を取得するクエリ */
function useTimelinesQuery() {
  return useQuery({
    queryKey: queryKeys.timelines,
    queryFn: () => get<TimelineListResponse>(API_ENDPOINTS.timelines.get),
  });
}

export default useTimelinesQuery;
