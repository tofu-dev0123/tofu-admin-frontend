'use client';

import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { queryKeys } from '@/lib/api/queryKeys';
import type { ProfileResponse } from '@/types/api/about';

/** プロフィール（シングルトン）を取得するクエリ */
function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => get<ProfileResponse>(API_ENDPOINTS.profile.get),
  });
}

export default useProfileQuery;
