'use client';

import PostSearchBar from '@/components/features/admin/posts/PostSearchBar';
import PostList from '@/components/features/admin/posts/PostList';
import usePostList from '@/hooks/admin/posts/usePostList';
import type { PostResponse } from '@/types/api/post';

interface PostListMainProps {
  initialData: PostResponse;
}

function PostListMain({ initialData }: PostListMainProps) {
  const {
    searchPost,
    status: statusHook,
    deleteAlert,
    patchStatusAlert,
    displayedKeyword,
    handleClickEdit,
    isRefetching,
    isColdLoading,
    isEmpty,
  } = usePostList({ initialData });
  return (
    <div className="h-full w-full lg:w-6xl flex flex-col mx-auto p-4 lg:px-0">
      <div className="h-full lg:w-200 w-full lg:mx-auto flex flex-col">
        <PostSearchBar
          searchPost={searchPost}
          status={statusHook}
          totalCount={searchPost.totalCount}
          isRefetching={isRefetching}
        />
        <PostList
          searchPost={searchPost}
          deleteAlert={deleteAlert}
          patchStatusAlert={patchStatusAlert}
          handleClickEdit={handleClickEdit}
          displayedKeyword={displayedKeyword}
          isRefetching={isRefetching}
          isColdLoading={isColdLoading}
          isEmpty={isEmpty}
        />
      </div>
    </div>
  );
}

export default PostListMain;
