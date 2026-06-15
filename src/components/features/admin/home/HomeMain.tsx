'use client';

import ErrorModal from '@/components/features/admin/common/ErrorModal';
import SummaryArea from '@/components/features/admin/home/SummaryArea';
import CreateArea from '@/components/features/admin/home/CreateArea';
import RecentPostsArea from '@/components/features/admin/home/RecentPostsArea';
import useHome from '@/hooks/admin/home/useHome';
import ListArea from '@/components/features/admin/home/ListArea';
import BaseArea from '@/components/features/admin/home/BaseArea';
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
    <div className="h-full w-full lg:w-6xl flex flex-col mx-auto">
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 grid-cols-1 gap-4 py-4 lg:px-20 px-10">
        {/* アカウント名 */}
        <div className="lg:col-span-6 h-full">
          <BaseArea title="アカウント名">
            <AccountArea value={accountName} />
          </BaseArea>
        </div>

        {/* ユーザー名 */}
        <div className="lg:col-span-6 h-full">
          <BaseArea title="ユーザー名">
            <AccountArea value={username} />
          </BaseArea>
        </div>

        {/* サマリ */}
        <div className="lg:col-span-8 h-full">
          <BaseArea title="投稿のサマリ">
            <SummaryArea
              totalPosts={totalPosts}
              publishedPosts={publishedPosts}
              draftPosts={draftPosts}
            />
          </BaseArea>
        </div>

        {/* 投稿一覧 */}
        <div className="lg:col-span-2 h-full w-full">
          <BaseArea title="投稿一覧">
            <ListArea handleClickList={handleClickList} />
          </BaseArea>
        </div>

        {/* ブログを書く */}
        <div className="lg:col-span-2 h-full w-full">
          <BaseArea title="ブログを書く">
            <CreateArea handleClickCreate={handleClickCreate} />
          </BaseArea>
        </div>

        {/* 最近の投稿 */}
        <div className="lg:col-span-12 h-full w-full">
          <BaseArea title="最近の投稿">
            <RecentPostsArea
              postList={postList}
              handleClickPost={handleClickPost}
            />
          </BaseArea>
        </div>
        {/* 下書き */}
        <div className="lg:col-span-12 h-full w-full">
          <BaseArea title="下書き">
            <DraftPostsArea
              draftPostList={draftPostList}
              handleClickPost={handleClickPost}
            />
          </BaseArea>
        </div>
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
