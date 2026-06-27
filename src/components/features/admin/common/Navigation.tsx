'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import {
  NAVIGATION_ITEMS,
  getActiveIndex,
} from '@/constants/admin/navigationItem';
import Logo from '@/components/features/admin/common/Logo';
import { cn } from '@/lib/utils';

interface NavigationProps {
  handleClickLogout?: () => void;
}

function Navigation({ handleClickLogout }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  const activeIndex = getActiveIndex(pathname);

  // ナビゲーションアイテムのクリックハンドラー
  const handleClickItem = (path: string) => {
    router.push(path);
  };

  return (
    <>
      {/* デスクトップ: 左固定サイドバー */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-border bg-card lg:flex">
        {/* ロゴ */}
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>

        {/* メニュー */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {NAVIGATION_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeIndex === index;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleClickItem(item.path)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ログアウト */}
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={handleClickLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-[18px] w-[18px]" />
            ログアウト
          </button>
        </div>
      </aside>

      {/* モバイル: 上部ヘッダー（ロゴ） */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b border-border bg-card/90 px-4 backdrop-blur lg:hidden">
        <Logo />
      </header>

      {/* モバイル: 下部タブバー */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="flex w-full items-center justify-around px-1 py-2">
          {NAVIGATION_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeIndex === index;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleClickItem(item.path)}
                className={cn(
                  'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg py-1.5 transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[11px] font-medium">{item.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={handleClickLogout}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-muted-foreground transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-[11px] font-medium">ログアウト</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
