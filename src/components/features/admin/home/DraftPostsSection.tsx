import DraftPostsArea from '@/components/features/admin/home/DraftPostsArea';
import SectionError from '@/components/features/admin/common/SectionError';
import { serverGet } from '@/lib/api/server';
import type { PostResponse } from '@/types/api/post';

async function DraftPostsSection() {
  let res: PostResponse;
  try {
    const params = new URLSearchParams({ limit: '3', status: 'DRAFT' });
    res = await serverGet<PostResponse>('/admin/posts/', params, '下書き取得');
  } catch {
    return <SectionError />;
  }

  return <DraftPostsArea draftPostList={res.posts} />;
}

export default DraftPostsSection;
