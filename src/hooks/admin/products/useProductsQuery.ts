'use client';

import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { queryKeys } from '@/lib/api/queryKeys';
import type { ProductListResponse } from '@/types/api/product';

/** プロダクト一覧を取得するクエリ */
function useProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: () => get<ProductListResponse>(API_ENDPOINTS.products.get),
  });
}

export default useProductsQuery;
