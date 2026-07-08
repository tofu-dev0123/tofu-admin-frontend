import PostListMain from '@/components/features/admin/posts/PostListMain';
import SectionError from '@/components/features/admin/common/SectionError';
import { serverGet } from '@/lib/api/server';
import type { PostResponse } from '@/types/api/post';

type SearchParams = { [key: string]: string | string[] | undefined };

interface PostsSectionProps {
  searchParamsPromise: Promise<SearchParams>;
}

async function PostsSection({ searchParamsPromise }: PostsSectionProps) {
  let res: PostResponse;
  try {
    const sp = await searchParamsPromise;
    const page = typeof sp.page === 'string' ? sp.page : undefined;
    const keyword = typeof sp.keyword === 'string' ? sp.keyword : undefined;
    const status = typeof sp.status === 'string' ? sp.status : undefined;

    const limit = 10;
    const offset = page ? (parseInt(page) - 1) * limit : 0;

    const query = new URLSearchParams();
    if (offset) query.append('offset', String(offset));
    query.append('limit', String(limit));
    if (keyword) query.append('keyword', keyword);
    if (status) query.append('status', status);

    res = await serverGet<PostResponse>('/admin/posts/', query, '投稿一覧取得');
  } catch {
    return <SectionError className="m-4" />;
  }

  return <PostListMain initialData={res} />;
}

export default PostsSection;
