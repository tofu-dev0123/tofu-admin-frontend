import RecentPostsArea from '@/components/features/admin/home/RecentPostsArea';
import SectionError from '@/components/features/admin/common/SectionError';
import { serverGet } from '@/lib/api/server';
import type { PostResponse } from '@/types/api/post';

async function RecentPostsSection() {
  let res: PostResponse;
  try {
    const params = new URLSearchParams({ limit: '3', status: 'PUBLISHED' });
    res = await serverGet<PostResponse>(
      '/admin/posts/',
      params,
      '最近の投稿取得'
    );
  } catch {
    return <SectionError />;
  }

  return <RecentPostsArea postList={res.posts} />;
}

export default RecentPostsSection;
