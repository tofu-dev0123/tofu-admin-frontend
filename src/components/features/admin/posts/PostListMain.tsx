'use client';

import PostSearchInfo from '@/components/features/admin/posts/PostSearchInfo';
import PostList from '@/components/features/admin/posts/PostList';
import usePostList from '@/hooks/admin/posts/usePostList';

function PostListMain() {
  const {
    searchPost,
    status: statusHook,
    deleteAlert,
    patchStatusAlert,
    displayedKeyword,
    handleClickEdit,
  } = usePostList();
  return (
    // PostListMain.tsx の17-18行目
    <div className="h-full w-full lg:w-6xl flex flex-col mx-auto p-4 lg:px-0">
      <div className="h-full lg:w-200 w-full lg:mx-auto flex flex-col">
        <PostSearchInfo
          totalPosts={searchPost.totalCount}
          keyword={displayedKeyword}
          status={statusHook}
        />
        <PostList
          searchPost={searchPost}
          deleteAlert={deleteAlert}
          patchStatusAlert={patchStatusAlert}
          handleClickEdit={handleClickEdit}
        />
      </div>
    </div>
  );
}

export default PostListMain;
