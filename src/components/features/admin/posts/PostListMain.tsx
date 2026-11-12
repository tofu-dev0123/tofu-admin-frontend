'use client';

import PostSearchBar from '@/components/features/admin/posts/PostSearchBar';
import PostList from '@/components/features/admin/posts/PostList';
import usePostList from '@/hooks/admin/posts/usePostList';

function PostListMain() {
  const {
    searchPost,
    status: statusHook,
    deleteAlert,
    patchStatusAlert,
    postList,
    totalCount,
    displayedKeyword,
    handleClickEdit,
    isRefetching,
    isColdLoading,
    isError,
    isEmpty,
  } = usePostList();
  return (
    <div className="w-full lg:w-6xl flex flex-col mx-auto p-4 lg:px-0 lg:py-8">
      <div className="w-full lg:w-200 lg:mx-auto">
        {/* 検索バー + リストを 1 枚のパネルにまとめる */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <PostSearchBar
            searchPost={searchPost}
            status={statusHook}
            totalCount={totalCount}
            isRefetching={isRefetching}
          />
          <PostList
            postList={postList}
            deleteAlert={deleteAlert}
            patchStatusAlert={patchStatusAlert}
            handleClickEdit={handleClickEdit}
            displayedKeyword={displayedKeyword}
            isRefetching={isRefetching}
            isColdLoading={isColdLoading}
            isError={isError}
            isEmpty={isEmpty}
          />
        </div>
      </div>
    </div>
  );
}

export default PostListMain;
