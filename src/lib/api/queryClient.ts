import { QueryCache, QueryClient } from '@tanstack/react-query';
import { logger } from '@/lib/logger';

// 一度取得したデータを「新鮮」とみなす時間。この間は画面を戻ってもキャッシュを即表示し再取得しない
export const DEFAULT_STALE_TIME_MS = 30_000;

/**
 * 管理画面用の QueryClient を生成する。
 * 取得エラーはここで一括して記録する（表示は各 Section の SectionError が担う）。
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        logger.error('[query] データ取得に失敗', {
          queryKey: query.queryKey,
          error,
        });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME_MS,
        refetchOnWindowFocus: true,
        retry: 1,
      },
    },
  });
}
