import { Skeleton } from '@/components/ui/skeleton';

// PostListMain の骨組み（パネル: 検索ヘッダー + 5件分の一覧行）。Suspense の fallback に使う。
function PostListSkeleton() {
  return (
    <div className="w-full lg:w-6xl flex flex-col mx-auto p-4 lg:px-0 lg:py-8">
      <div className="w-full lg:w-200 lg:mx-auto">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* 検索ヘッダー領域 */}
          <div className="flex flex-col gap-3 border-b border-gray-100 bg-white p-4">
            <Skeleton className="h-11 w-full rounded-md" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-40 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          {/* リスト領域 */}
          <div className="p-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index}>
                {index > 0 && <div className="mx-3 border-b border-gray-100" />}
                <div className="flex min-h-[84px] items-center gap-4 px-4 py-3">
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostListSkeleton;
