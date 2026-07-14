import { Skeleton } from '@/components/ui/skeleton';

/** Products 設定のローディング骨組み */
function ProductsMainSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="mb-6 grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}

export default ProductsMainSkeleton;
