import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Post from '@/components/features/admin/common/Post';
import type { Post as PostType } from '@/types/api/post';

interface PostListCardProps {
  title: string;
  icon: LucideIcon;
  postList: PostType[];
  handleClickPost: (postId: number) => void;
  handleClickViewAll: () => void;
}

function PostListCard({
  title,
  icon: Icon,
  postList,
  handleClickPost,
  handleClickViewAll,
}: PostListCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </h2>
        {postList.length > 0 && (
          <button
            type="button"
            onClick={handleClickViewAll}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            すべて見る
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {postList.length === 0 ? (
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
