'use client';

import { useRouter } from 'next/navigation';
import CreateArea from '@/components/features/admin/home/CreateArea';
import ListArea from '@/components/features/admin/home/ListArea';

function HomeActions() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <CreateArea handleClickCreate={() => router.push('/posts/new')} />
      <ListArea handleClickList={() => router.push('/posts')} />
    </div>
  );
}

export default HomeActions;
