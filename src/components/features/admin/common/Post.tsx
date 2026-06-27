import type { Post } from '@/types/api/post';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import dummyImage from '@/assets/images/dummy-image.png';
import { formatDateTime } from '@/lib/utils/dateFormat';

interface PostProps {
  post: Post;
  handleClickPost: (postId: number) => void;
}

function Post({ post, handleClickPost }: PostProps) {
  const thumbnailUrl = post.thumbnail_url || dummyImage;

  return (
    <button
      type="button"
      onClick={() => handleClickPost(post.post_id)}
      className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent"
    >
      <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-md bg-muted shadow-sm">
        <Image
          src={thumbnailUrl}
          alt={post.title}
          unoptimized
          fill
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {post.title || 'タイトル未設定'}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {formatDateTime(post.createdAt)}
        </p>
      </div>
    </button>
  );
}

export default Post;
