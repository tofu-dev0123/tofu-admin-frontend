'use client';

import { useParams } from 'next/navigation';
import usePostDetailQuery from '@/hooks/admin/posts/usePostDetailQuery';
import useErrorModal from '@/hooks/admin/common/useErrorModal';

export function useEditMain() {
  const params = useParams();
  const postId = Number(params.id);
  const errorModalHook = useErrorModal();
  const postDetailQuery = usePostDetailQuery(postId);

  // マウント後の最新取得が終わるまで待つ（古いキャッシュでエディタを初期化しないため）。
  // 一度表示した後の再取得（更新後の無効化など）ではエディタを差し替えない。
  const isLoading = !postDetailQuery.isFetchedAfterMount;
  const postData = postDetailQuery.isError ? null : postDetailQuery.data;

  return {
    postId,
    postData: postData ?? null,
    isLoading,
    errorModalHook,
  };
}
