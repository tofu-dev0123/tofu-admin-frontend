import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// PostListMain の骨組み（検索バー + 5件分の一覧行）。Suspense の fallback に使う。
function PostListSkeleton() {
  return (
    <div className="h-full w-full lg:w-6xl flex flex-col mx-auto p-4 lg:px-0">
      <div className="h-full lg:w-200 w-full lg:mx-auto flex flex-col">
        <div className="w-full flex justify-between items-center">
          <Skeleton className="m-4 h-4 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
        <Card className="min-h-screen w-full flex flex-col gap-4 justify-start border-none shadow-none">
          <CardContent className="flex items-center justify-between lg:p-4 p-2">
            <Skeleton className="h-9 w-full lg:w-100 rounded-full" />
          </CardContent>
          <CardContent className="px-4 lg:px-0">
            <hr className="w-full border-gray-200" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="w-full min-h-25">
                <div className="lg:w-150 w-full min-h-25 lg:mx-auto flex justify-between items-center lg:gap-4 gap-2">
                  <div className="lg:w-100 w-50 flex flex-col justify-center items-start lg:gap-4 gap-2 lg:p-4 p-0">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="lg:h-20 h-15 lg:w-20 w-15 rounded-md" />
                  <div className="lg:h-20 lg:w-20" />
                </div>
                <hr className="w-full border-gray-200" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PostListSkeleton;
