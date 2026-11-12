import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Post from '@/components/features/admin/common/Post';
import type { Post as PostType } from '@/types/api/post';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface PostListCardProps {
  title: string;
  icon: LucideIcon;
  postList: PostType[];
  handleClickPost: (postId: number) => void;
  handleClickViewAll: () => void;
  isLoading?: boolean;
}

function PostListCard({
  title,
  icon: Icon,
  postList,
  handleClickPost,
  handleClickViewAll,
  isLoading,
}: PostListCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </h2>
        {postList.length > 0 && (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={handleClickViewAll}
            className="h-auto gap-1 px-0 text-muted-foreground hover:text-foreground"
          >
            すべて見る
            <ChevronRight className="size-3.5!" />
          </Button>
        )}
      </div>
      {isLoading ? (
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="flex items-center gap-3 py-2">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </li>
          ))}
        </ul>
      ) : postList.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          投稿がありません
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {postList.map((post) => (
            <li key={post.post_id}>
              <Post post={post} handleClickPost={handleClickPost} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostListCard;
