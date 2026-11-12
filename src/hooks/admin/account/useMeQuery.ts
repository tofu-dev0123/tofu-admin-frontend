'use client';

import { useQuery } from '@tanstack/react-query';
import { post } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { queryKeys } from '@/lib/api/queryKeys';
import type { MeResponse } from '@/types/api/account';

/** ログイン中のアカウント情報を取得するクエリ（API は POST の取得系） */
function useMeQuery() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => post<MeResponse>(API_ENDPOINTS.account.me),
  });
}

export default useMeQuery;
