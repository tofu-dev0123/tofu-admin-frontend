'use client';

import ErrorModal from '@/components/features/admin/common/ErrorModal';
import SummaryArea from '@/components/features/admin/home/SummaryArea';
import CreateArea from '@/components/features/admin/home/CreateArea';
import RecentPostsArea from '@/components/features/admin/home/RecentPostsArea';
import useHome from '@/hooks/admin/home/useHome';
import ListArea from '@/components/features/admin/home/ListArea';
import DraftPostsArea from '@/components/features/admin/home/DraftPostsArea';
import AccountArea from '@/components/features/admin/home/AccountArea';

function HomeMain() {
  const {
    totalPosts,
    publishedPosts,
    draftPosts,
    errorModalHook,
    handleClickCreate,
    handleClickList,
    handleClickPost,
    postList,
    draftPostList,
    accountName,
    username,
  } = useHome();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-4 lg:px-20">
      {/* 上段: アカウントカード + 主要導線 */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AccountArea accountName={accountName} username={username} />
        <div className="flex items-center gap-2">
          <CreateArea handleClickCreate={handleClickCreate} />
          <ListArea handleClickList={handleClickList} />
        </div>
      </div>

      {/* サマリ（KPIカード） */}
      <div className="mb-6">
        <SummaryArea
          totalPosts={totalPosts}
          publishedPosts={publishedPosts}
          draftPosts={draftPosts}
        />
      </div>

      {/* 最近の投稿 / 下書き（横2カラム） */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentPostsArea
          postList={postList}
          handleClickPost={handleClickPost}
          handleClickViewAll={handleClickList}
        />
        <DraftPostsArea
          draftPostList={draftPostList}
          handleClickPost={handleClickPost}
          handleClickViewAll={handleClickList}
        />
      </div>

      <ErrorModal
        isOpen={errorModalHook.isOpen}
        errorMessage={errorModalHook.errorMessage}
        onClose={errorModalHook.onClose}
      />
    </div>
  );
}

export default HomeMain;
