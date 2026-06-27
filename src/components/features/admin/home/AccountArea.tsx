interface AccountAreaProps {
  accountName: string;
  username: string;
}

function AccountArea({ accountName, username }: AccountAreaProps) {
  // アバターのイニシャル（先頭1文字）
  const initial = accountName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
        {initial}
      </span>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-foreground">{accountName}</p>
        <p className="text-xs text-muted-foreground">@{username}</p>
      </div>
    </div>
  );
}

export default AccountArea;
