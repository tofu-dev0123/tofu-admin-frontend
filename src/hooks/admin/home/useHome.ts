'use client';

import useSummary from '@/hooks/admin/home/useSummary';
import usePostList from '@/hooks/admin/home/usePostList';
import { useEffect } from 'react';
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

  const handleClickCreate = () => {
    router.push('/admin/posts/new');
  };

  const handleClickList = () => {
    router.push('/admin/posts');
  };

  const handleClickPost = (postId: number) => {
    router.push(`/admin/posts/${postId}/edit`);
  };

  useEffect(() => {
    // 初期処理
    getAccount();
    getSummary();
    getPostList({ limit: 3, status: 'PUBLISHED' as PostStatus });
    getPostList({ limit: 3, status: 'DRAFT' as PostStatus });
  }, [getAccount, getSummary, getPostList]);

  return {
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
