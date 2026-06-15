import { CardContent } from '@/components/ui/card';
import Post from '@/components/features/admin/common/Post';
import type { Post as PostType } from '@/types/api/post';

interface DraftPostsAreaProps {
  draftPostList: PostType[];
  handleClickPost: (postId: number) => void;
}

function DraftPostsArea({
  draftPostList,
  handleClickPost,
}: DraftPostsAreaProps) {
  return (
    <div className="w-full h-full">
      <CardContent className="grid lg:grid-cols-3 grid-cols-1 gap-2 w-full">
        {draftPostList.map((post) => (
          <div
            key={post.post_id}
            className="lg:col-span-1 col-span-full flex flex-col justify-start items-center mb-4 p-1 border border-white rounded-md"
          >
            <Post
              key={post.post_id}
              post={post}
              handleClickPost={handleClickPost}
            />
          </div>
        ))}
      </CardContent>
      <div className="w-full flex justify-end items-center mb-4 p-1">
        {draftPostList.length === 0 ? (
          <p className="text-sm text-gray-500 w-full text-left px-4">
            投稿がありません
          </p>
        ) : (
          <p className="text-sm text-gray-500 w-full text-right underline px-4 hover:cursor-pointer hover:text-black duration-200">
            ...もっと見る
          </p>
        )}
      </div>
    </div>
  );
}

export default DraftPostsArea;
