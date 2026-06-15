'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useErrorModal from '@/hooks/admin/common/useErrorModal';
import useSearchPost from '@/hooks/admin/posts/useSearchPost';
import useStatus from '@/hooks/admin/posts/useStatus';
import { PostStatus } from '@/types/api/post';
import usePostDeleteAlert from './usePostDeleteAlert';
import usePatchStatusAlert from './usePatchStatusAlert';

function usePostList() {
  const searchParams = useSearchParams();
  const { showError } = useErrorModal();
  const searchPostHook = useSearchPost();
  const statusHook = useStatus();
  const deleteAlertHook = usePostDeleteAlert({ showError });
  const patchStatusAlertHook = usePatchStatusAlert({ showError });
  const [displayedKeyword, setDisplayedKeyword] = useState<string>('');
  const router = useRouter();

  const handleClickEdit = (postId: number) => {
    router.push(`/admin/posts/${postId}/edit`);
  };

  useEffect(() => {
    // 初期処理
    const init = async () => {
      const page = searchParams.get('page');
      const keyword = searchParams.get('keyword');
      const status = searchParams.get('status') as PostStatus | undefined;

      let offset = 0;
      const limit = 10;
      if (page) {
        offset = (parseInt(page) - 1) * limit;
      }

      searchPostHook.search(
        offset,
        limit,
        keyword || undefined,
        status || undefined
      );
      setDisplayedKeyword(keyword || '');
    };

    init();
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
