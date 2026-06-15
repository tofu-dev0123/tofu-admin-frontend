import type { Post } from '@/types/api/post';
import Image from 'next/image';
import dummyImage from '@/assets/images/dummy-image.png';
import { formatDateTime } from '@/lib/utils/dateFormat';

interface PostProps {
  post: Post;
  handleClickPost: (postId: number) => void;
}

function Post({ post, handleClickPost }: PostProps) {
  const thumbnailUrl = post.thumbnail_url || dummyImage;

  return (
    <>
      <div
        className="w-full h-full flex flex-col justify-start items-center gap-1"
        onClick={() => handleClickPost(post.post_id)}
      >
        <div
          className="relative w-full aspect-video rounded-md overflow-hidden shadow-md hover:cursor-pointer hover:opacity-80 hover:scale-102 duration-200"
          onClick={() => handleClickPost(post.post_id)}
        >
          <Image
            src={thumbnailUrl}
            alt={post.title}
            unoptimized
            fill
            className="object-contain"
          />
        </div>
        <div className="w-full flex justify-center items-center">
          <p className="w-full text-md truncate whitespace-normal break-words">
            {post.title || 'タイトル未設定'}
          </p>
        </div>
        <div className="w-full flex justify-end items-center">
          <p className="w-full text-right text-xs text-gray-500">
            {formatDateTime(post.createdAt)}
          </p>
        </div>
      </div>
    </>
  );
}

export default Post;
