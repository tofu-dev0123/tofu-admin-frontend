'use client';

import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { queryKeys } from '@/lib/api/queryKeys';
import type { PostDetail } from '@/types/api/post';

/**
 * 編集画面用の記事詳細を取得するクエリ。
 * エディタは初期データを 1 度だけ取り込み、未保存判定（isDirty）にも使うため、
 * 古いキャッシュで開いたり編集中に再取得で差し替わったりしないよう、毎回最新を取得し自動再取得はしない。
 * 画面を離れたらキャッシュを破棄する（gcTime: 0）ため、次回マウント時の取得が失敗しても
 * 前回のデータ（削除済み記事など）でエディタを初期化しない。
 */
function usePostDetailQuery(postId: number) {
  return useQuery({
    queryKey: queryKeys.posts.detail(postId),
    queryFn: () => get<PostDetail>(API_ENDPOINTS.posts.edit(postId)),
    enabled: Number.isFinite(postId) && postId > 0,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export default usePostDetailQuery;
