'use client';

import { PostStatus, Post } from '@/types/api/post';
import { MoreHorizontal, Calendar, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils/dateFormat';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface PostInfoProps {
  post: Post;
  handleOpenDeleteAlert: (id: number) => void;
  handleOpenPatchStatusAlert: (id: number, status: PostStatus) => void;
  handleClickEdit: (id: number) => void;
}

function PostInfo({
  post,
  handleOpenDeleteAlert,
  handleOpenPatchStatusAlert,
  handleClickEdit,
}: PostInfoProps) {
  const isPublished = post.status === 'PUBLISHED';
  return (
    <div className="group flex min-h-[84px] items-center gap-4 rounded-lg px-4 py-3 duration-200 hover:bg-gray-50">
      {/* タイトル + メタ情報 */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h4
          className={cn(
            'truncate text-md font-bold',
            post.title ? 'text-gray-900' : 'text-gray-400'
          )}
        >
          {post.title ? post.title : 'タイトル未設定'}
        </h4>
        <div className="flex items-center gap-3 text-xs">
          {/* ステータスバッジ */}
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ring-1',
              isPublished
                ? 'bg-green-50 text-green-700 ring-green-600/20'
                : 'bg-gray-100 text-gray-600 ring-gray-500/20'
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                isPublished ? 'bg-green-500' : 'bg-gray-400'
              )}
            ></span>
            {isPublished ? '公開' : '下書き'}
          </span>
          <span className="inline-flex items-center gap-1 text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateTime(post.createdAt)}
          </span>
        </div>
      </div>

      {/* サムネイル（未設定時はプレースホルダ） */}
      {post.thumbnail_url ? (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200">
          <Image
            src={post.thumbnail_url}
            alt={post.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      ) : (
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-md border border-dashed border-gray-200 bg-gray-50 text-gray-300">
          <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
        </div>
      )}

      {/* 操作メニュー */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="操作メニュー"
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-md text-gray-400 duration-200 hover:bg-gray-200/70 hover:text-gray-600"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-30 p-0 flex flex-col justify-start items-start border border-gray-200 rounded-md">
          <p
            className="w-full py-2 px-4 text-start text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-100/50 duration-200"
            onClick={() => handleClickEdit(post.post_id)}
          >
            編集
          </p>
          {isPublished && (
            <p
              className="w-full py-2 px-4 text-start text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-100/50 duration-200"
              onClick={() => handleOpenPatchStatusAlert(post.post_id, 'DRAFT')}
            >
              公開を解除
            </p>
          )}
          <p
            className="w-full py-2 px-4 text-start text-sm text-red-700 hover:cursor-pointer hover:bg-gray-100/50 duration-200"
            onClick={() => handleOpenDeleteAlert(post.post_id)}
          >
            削除
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default PostInfo;
