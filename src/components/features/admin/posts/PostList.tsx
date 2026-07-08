'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '@/components/ui/input-group';
import { SearchIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import PostInfo from '@/components/features/admin/posts/PostInfo';
import Alert from '@/components/features/admin/common/Alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MESSAGES } from '@/constants/messages';
import useSearchPost from '@/hooks/admin/posts/useSearchPost';
import usePostDeleteAlert from '@/hooks/admin/posts/usePostDeleteAlert';
import usePatchStatusAlert from '@/hooks/admin/posts/usePatchStatusAlert';
import reloadIcon from '@/assets/images/reload-icon.png';
import Image from 'next/image';

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
    <Card className="min-h-screen w-full flex flex-col gap-4 justify-start border-none shadow-none">
      <CardContent className="flex flex-col lg:flex-row items-end lg:items-center justify-between lg:p-4 p-2 lg:gap-4 gap-2">
        <div className="lg:w-100 w-full flex items-center justify-between lg:justify-start gap-4 px-2 lg:px-0">
          <InputGroup className="rounded-full">
            <InputGroupInput
              placeholder="Search..."
              value={searchPost.keyword}
              onChange={searchPost.handleInputChange}
            />
            <InputGroupAddon className="rounded-full">
              <SearchIcon
                className="cursor-pointer hover:opacity-60 duration-200"
                onClick={searchPost.handleSearch}
              />
            </InputGroupAddon>
          </InputGroup>
          <button
            onClick={searchPost.handleReset}
            className="cursor-pointer hover:opacity-60 duration-200 border-none shadow-none"
          >
            <Image
              src={reloadIcon}
              alt="reload"
              width={20}
              height={20}
              className="w-4 h-4"
            />
          </button>
          {/* 再取得中の小さな pending スピナー */}
          {isRefetching && (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          )}
        </div>
      </CardContent>
      <CardContent className="relative px-4 lg:px-0">
        {/* 再取得中の上部 indeterminate バー */}
        {isRefetching && (
          <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden">
            <div className="absolute h-0.5 rounded-full bg-gray-700 animate-indeterminate" />
          </div>
        )}
        <hr className="w-full border-gray-200" />
        {isColdLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-full min-h-25">
              <div className="lg:w-150 w-full min-h-25 lg:mx-auto flex justify-between items-center lg:gap-4 gap-2">
                <div className="lg:w-100 w-50 flex flex-col justify-center items-start lg:gap-4 gap-2 lg:p-4 p-0">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="lg:h-20 h-15 lg:w-20 w-15 rounded-md" />
                <div className="lg:h-20 lg:w-20" />
              </div>
              <hr className="w-full border-gray-200" />
            </div>
          ))
        ) : isEmpty ? (
          <div className="w-full min-h-50 flex items-center justify-center text-sm text-gray-500">
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
            {searchPost.postList.map((post) => (
              <div
                key={post.post_id}
                className="w-full min-h-25 hover:bg-gray-100/50 duration-200 cursor-pointer"
              >
                <PostInfo
                  key={post.post_id}
                  post={post}
                  handleOpenDeleteAlert={deleteAlert.handleOpen}
                  handleOpenPatchStatusAlert={patchStatusAlert.handleOpen}
                  handleClickEdit={handleClickEdit}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
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
    </Card>
  );
}

export default PostList;
