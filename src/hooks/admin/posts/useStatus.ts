import { useCallback } from 'react';
import { PostStatus } from '@/types/api/post';
import { useRouter, useSearchParams } from 'next/navigation';

function useStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // アクティブなステータスは URL から導出する（pill のハイライトが URL と一致する）。
  const status = (searchParams.get('status') as PostStatus | null) ?? 'ALL';

  const handleStatusChange = useCallback(
    (newStatus: PostStatus | 'ALL') => {
      const keyword = searchParams.get('keyword');
      const queryParams = new URLSearchParams();
      if (keyword) queryParams.append('keyword', keyword);
      if (newStatus !== 'ALL') queryParams.append('status', newStatus);
      const qs = queryParams.toString();
      router.push(qs ? `/posts?${qs}` : '/posts');
    },
    [router, searchParams]
  );

  return {
    status,
    handleStatusChange,
  };
}

export default useStatus;
