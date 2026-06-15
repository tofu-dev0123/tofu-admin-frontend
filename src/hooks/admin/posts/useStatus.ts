import { useState, useCallback } from 'react';
import { PostStatus } from '@/types/api/post';
import { useRouter, useSearchParams } from 'next/navigation';

function useStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PostStatus | 'ALL'>('ALL');

  const handleStatus = useCallback(
    async (newStatus: PostStatus | 'ALL') => {
      const keyword = searchParams.get('keyword');
      const queryParams = new URLSearchParams();
      if (keyword) queryParams.append('keyword', keyword);
      if (newStatus !== 'ALL') queryParams.append('status', newStatus);
      router.push(`/admin/posts?${queryParams.toString()}`);
    },
    [router, searchParams]
  );

  const handleStatusChange = useCallback(
    (newStatus: PostStatus | 'ALL') => {
      setStatus(newStatus);
      handleStatus(newStatus);
    },
    [handleStatus]
  );

  return {
    status,
    handleStatusChange,
  };
}

export default useStatus;
