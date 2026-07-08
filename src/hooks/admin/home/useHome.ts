'use client';

import useSummary from '@/hooks/admin/home/useSummary';
import usePostList from '@/hooks/admin/home/usePostList';
import { useEffect, useState } from 'react';
import useErrorModal from '@/hooks/admin/common/useErrorModal';
import { useRouter } from 'next/navigation';
import { PostStatus } from '@/types/api/post';
import useAccountMe from '@/hooks/admin/account/useAccountMe';
function useHome() {
  const router = useRouter();

  // エラーモーダル状態管理フック
  const errorModalHook = useErrorModal();

  // アカウント名の状態管理フック
  const { accountName, username, getAccount } = useAccountMe({
    showError: errorModalHook.showError,
  });

  // サマリの状態管理フック
  const { totalPosts, publishedPosts, draftPosts, getSummary } = useSummary({
    showError: errorModalHook.showError,
  });

  // 投稿一覧の状態管理フック
  const { postList, draftPostList, getPostList } = usePostList({
    showError: errorModalHook.showError,
  });

  // 初期ローディング状態（初期値からの差し替えによるちらつきを防ぐ）
  const [isLoading, setIsLoading] = useState(true);

  const handleClickCreate = () => {
    router.push('/posts/new');
  };

  const handleClickList = () => {
    router.push('/posts');
  };

  const handleClickPost = (postId: number) => {
    router.push(`/posts/${postId}/edit`);
  };

  useEffect(() => {
    // 初期処理（全取得を待って一括でローディング解除）
    (async () => {
      try {
        await Promise.all([
          getAccount(),
          getSummary(),
          getPostList({ limit: 3, status: 'PUBLISHED' as PostStatus }),
          getPostList({ limit: 3, status: 'DRAFT' as PostStatus }),
        ]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [getAccount, getSummary, getPostList]);

  return {
    isLoading,
    accountName,
    username,
    totalPosts,
    publishedPosts,
    draftPosts,
    errorModalHook,
    handleClickCreate,
    handleClickList,
    handleClickPost,
    postList,
    draftPostList,
  };
}

export default useHome;
