'use client';

import { PostStatus, Post } from '@/types/api/post';
import threeDotsIcon from '@/assets/images/three-dots-reader-icon.png';
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils/dateFormat';
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
  return (
    <>
      <div className="lg:w-150 w-full min-h-25 lg:mx-auto flex justify-between items-center lg:gap-4 gap-2">
        <div className="lg:w-100 w-50 flex flex-col justify-center items-start lg:gap-4 gap-2 lg:p-4 p-0">
          <h4 className="text-md font-bold">
            {post.title ? post.title : 'タイトル未設定'}
          </h4>
          <div className="w-full flex justify-start items-center lg:gap-4 gap-2">
            <div className="flex justify-start items-center lg:gap-2 gap-1">
              <span
                className={`h-2 w-2 rounded-full ${post.status === 'PUBLISHED' ? 'bg-green-400' : 'bg-gray-400'}`}
              ></span>
              <span className="lg:text-sm text-[10px] lg:text-xs text-gray-500">
                {post.status === 'PUBLISHED' ? '公開' : '下書き'}
              </span>
            </div>
            <span className="lg:text-sm text-[10px] lg:text-xs text-gray-500">
              {formatDateTime(post.createdAt)}
            </span>
          </div>
        </div>
        <div
          className={`lg:h-20 h-15 lg:w-20 w-15 relative overflow-hidden ${post.thumbnail_url ? 'rounded-md border border-gray-200' : ''}`}
        >
          {post.thumbnail_url && (
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              unoptimized
              className="object-cover"
            />
          )}
        </div>
        <div className="lg:h-20 lg:w-20 flex justify-center items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Image
                src={threeDotsIcon}
                alt="three-dots"
                width={20}
                height={20}
                className="hover:cursor-pointer hover:opacity-60 duration-200"
              />
            </PopoverTrigger>
            <PopoverContent className="w-30 p-0 flex flex-col justify-start items-start border border-gray-200 rounded-md">
              <p
                className="w-full py-2 px-4 text-start text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-100/50 duration-200"
                onClick={() => handleClickEdit(post.post_id)}
              >
                編集
              </p>
              {post.status === 'PUBLISHED' && (
                <p
                  className="w-full py-2 px-4 text-start text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-100/50 duration-200"
                  onClick={() =>
                    handleOpenPatchStatusAlert(post.post_id, 'DRAFT')
                  }
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
      </div>
      <hr className="w-full border-gray-200" />
    </>
  );
}

export default PostInfo;
