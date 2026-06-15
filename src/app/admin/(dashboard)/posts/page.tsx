import { Suspense } from 'react';
import PostListMain from '@/components/features/admin/posts/PostListMain';
import { Spinner } from '@/components/ui/spinner';

export default function Page() {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full w-full">
            <Spinner className="size-8" />
          </div>
        }
      >
        <PostListMain />
      </Suspense>
    </div>
  );
}
