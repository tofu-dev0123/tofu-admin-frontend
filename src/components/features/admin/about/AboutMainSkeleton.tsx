import { Skeleton } from '@/components/ui/skeleton';

/** About 設定（プロフィール + 年表）のローディング骨組み */
function AboutMainSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <Skeleton className="h-6 w-32" />
          <div className="mt-6 flex flex-col gap-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <Skeleton className="h-6 w-32" />
          <div className="mt-6 flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMainSkeleton;
