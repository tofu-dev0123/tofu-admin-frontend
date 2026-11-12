'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import useErrorModal from '@/hooks/admin/common/useErrorModal';
import useSearchPost from '@/hooks/admin/posts/useSearchPost';
import useStatus from '@/hooks/admin/posts/useStatus';
import usePostsQuery from '@/hooks/admin/posts/usePostsQuery';
import { PostStatus } from '@/types/api/post';
import usePostDeleteAlert from './usePostDeleteAlert';
import usePatchStatusAlert from './usePatchStatusAlert';

// 1 ページあたりの表示件数
const POSTS_PER_PAGE = 10;

function usePostList() {
  const searchParams = useSearchParams();
  const { showError } = useErrorModal();
  const searchPostHook = useSearchPost();
  const statusHook = useStatus();
  const deleteAlertHook = usePostDeleteAlert({ showError });
  const patchStatusAlertHook = usePatchStatusAlert({ showError });
  const router = useRouter();

  // 検索条件は URL から導出し、取得はクエリに任せる（同条件はキャッシュから即表示）
  const page = searchParams.get('page');
  const keyword = searchParams.get('keyword') || undefined;
  const status = (searchParams.get('status') as PostStatus | null) || undefined;
  const offset = page ? (parseInt(page) - 1) * POSTS_PER_PAGE : 0;
  const postsQuery = usePostsQuery({
    offset,
    limit: POSTS_PER_PAGE,
    keyword,
    status,
  });

  // 検索済みキーワードは URL から導出する（表示用）
  const displayedKeyword = keyword ?? '';

  const handleClickEdit = (postId: number) => {
    router.push(`/posts/${postId}/edit`);
  };

  const postList = postsQuery.data?.posts ?? [];
  const totalCount = postsQuery.data?.total_count ?? 0;

  // 表示状態の判定はここに寄せる（コンポーネントは分岐を持たない）。
  const hasPosts = postList.length > 0;
  // 条件変更で前の一覧を表示したまま取得中
  const isRefetching = postsQuery.isPlaceholderData && hasPosts;
  // 表示できる内容が無く取得中
  const isColdLoading =
    (postsQuery.isPending || postsQuery.isPlaceholderData) && !hasPosts;
  const isError = postsQuery.isError && !postsQuery.data;
  const isEmpty =
    !postsQuery.isPending &&
    !postsQuery.isPlaceholderData &&
    !isError &&
    !hasPosts;

  return {
    searchPost: searchPostHook,
    status: statusHook,
    deleteAlert: deleteAlertHook,
    patchStatusAlert: patchStatusAlertHook,
    postList,
    totalCount,
    displayedKeyword,
    handleClickEdit,
    isRefetching,
    isColdLoading,
    isError,
    isEmpty,
  };
}

export default usePostList;
