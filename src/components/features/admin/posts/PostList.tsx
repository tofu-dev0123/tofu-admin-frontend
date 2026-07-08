'use client';

import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import PostInfo from '@/components/features/admin/posts/PostInfo';
import Alert from '@/components/features/admin/common/Alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MESSAGES } from '@/constants/messages';
import useSearchPost from '@/hooks/admin/posts/useSearchPost';
import usePostDeleteAlert from '@/hooks/admin/posts/usePostDeleteAlert';
import usePatchStatusAlert from '@/hooks/admin/posts/usePatchStatusAlert';

interface PostListProps {
  searchPost: ReturnType<typeof useSearchPost>;
  deleteAlert: ReturnType<typeof usePostDeleteAlert>;
  patchStatusAlert: ReturnType<typeof usePatchStatusAlert>;
  handleClickEdit: (postId: number) => void;
  displayedKeyword: string;
  // 前のリストを保持したまま再取得中（薄化 + pending 表示）
  isRefetching: boolean;
  // 表示できる内容が無く取得中（スケルトン）
  isColdLoading: boolean;
  // 結果ゼロ
  isEmpty: boolean;
}

function PostList({
  searchPost,
  deleteAlert,
  patchStatusAlert,
  handleClickEdit,
  displayedKeyword,
  isRefetching,
  isColdLoading,
  isEmpty,
}: PostListProps) {
  return (
    <div className="relative p-2">
      {/* 再取得中の上部 indeterminate バー */}
      {isRefetching && (
        <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden">
          <div className="absolute h-0.5 rounded-full bg-gray-700 animate-indeterminate" />
        </div>
      )}
      {isColdLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <div key={index}>
            {index > 0 && <div className="mx-3 border-b border-gray-100" />}
            <div className="flex min-h-[84px] items-center gap-4 px-4 py-3">
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="h-8 w-8" />
            </div>
          </div>
        ))
      ) : isEmpty ? (
        <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-sm text-gray-500">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-gray-100 text-gray-400">
            <FileText className="h-6 w-6" strokeWidth={1.5} />
          </div>
          {displayedKeyword
            ? MESSAGES.posts.emptySearch(displayedKeyword)
            : MESSAGES.posts.empty}
        </div>
      ) : (
        <div
          className={cn(
            'transition-opacity duration-200',
            isRefetching && 'opacity-[0.85] pointer-events-none'
          )}
        >
          {searchPost.postList.map((post, index) => (
            <div key={post.post_id}>
              {index > 0 && <div className="mx-3 border-b border-gray-100" />}
              <PostInfo
                post={post}
                handleOpenDeleteAlert={deleteAlert.handleOpen}
                handleOpenPatchStatusAlert={patchStatusAlert.handleOpen}
                handleClickEdit={handleClickEdit}
              />
            </div>
          ))}
        </div>
      )}
      <Alert
        open={deleteAlert.open}
        onOpenChange={deleteAlert.handleClose}
        title="記事を削除しますか？"
        cancelText="キャンセル"
        actionText="削除"
        onCancel={deleteAlert.handleClose}
        onAction={deleteAlert.handleDelete}
      />
      <Alert
        open={patchStatusAlert.open}
        onOpenChange={patchStatusAlert.handleClose}
        title="公開を解除しますか？"
        cancelText="キャンセル"
        actionText="公開を解除"
        onCancel={patchStatusAlert.handleClose}
        onAction={patchStatusAlert.handlePatchStatus}
      />
    </div>
  );
}

export default PostList;
