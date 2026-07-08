import { Skeleton } from '@/components/ui/skeleton';

interface AccountAreaProps {
  accountName: string;
  username: string;
  isLoading?: boolean;
}

function AccountArea({ accountName, username, isLoading }: AccountAreaProps) {
  // アバターのイニシャル（先頭1文字）
  const initial = accountName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      {isLoading ? (
        <Skeleton className="h-11 w-11 rounded-full" />
      ) : (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
          {initial}
        </span>
      )}
      <div className="leading-tight">
        {isLoading ? (
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-foreground">
              {accountName}
            </p>
            <p className="text-xs text-muted-foreground">@{username}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default AccountArea;
