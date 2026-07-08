'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useErrorModal from '@/hooks/admin/common/useErrorModal';
import useSearchPost from '@/hooks/admin/posts/useSearchPost';
import useStatus from '@/hooks/admin/posts/useStatus';
import { PostResponse, PostStatus } from '@/types/api/post';
import usePostDeleteAlert from './usePostDeleteAlert';
import usePatchStatusAlert from './usePatchStatusAlert';

interface UsePostListProps {
  // サーバー（RSC）で取得済みの初期一覧
  initialData: PostResponse;
}

function usePostList({ initialData }: UsePostListProps) {
  const searchParams = useSearchParams();
  const { showError } = useErrorModal();
  const searchPostHook = useSearchPost({ initial: initialData });
  const statusHook = useStatus();
  const deleteAlertHook = usePostDeleteAlert({ showError });
  const patchStatusAlertHook = usePatchStatusAlert({ showError });
  const router = useRouter();

  // 検索済みキーワードは URL から導出する（表示用）
  const displayedKeyword = searchParams.get('keyword') ?? '';

  // 初回はサーバー取得済みの初期データを使うため、クライアント再取得はしない。
  // 以降 searchParams が変わったとき（検索・絞り込み・リセット）だけクライアントで再取得する。
  const isInitialRender = useRef(true);

  const handleClickEdit = (postId: number) => {
    router.push(`/posts/${postId}/edit`);
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const page = searchParams.get('page');
    const keyword = searchParams.get('keyword');
    const status = searchParams.get('status') as PostStatus | null;

    const limit = 10;
    const offset = page ? (parseInt(page) - 1) * limit : 0;

    searchPostHook.search(
      offset,
      limit,
      keyword || undefined,
      status || undefined
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return {
    searchPost: searchPostHook,
    status: statusHook,
    deleteAlert: deleteAlertHook,
    patchStatusAlert: patchStatusAlertHook,
    displayedKeyword,
    handleClickEdit,
  };
}

export default usePostList;
