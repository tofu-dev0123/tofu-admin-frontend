'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import {
  NAVIGATION_GROUPS,
  NAVIGATION_ITEMS,
  isNavItemActive,
} from '@/constants/admin/navigationItem';
import { cn } from '@/lib/utils';

interface NavigationProps {
  handleClickLogout?: () => void;
}

function Navigation({ handleClickLogout }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClickItem = (path: string) => {
    router.push(path);
  };

  return (
    <>
      {/* デスクトップ: 左固定ダークサイドバー */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-neutral-950 text-neutral-300 lg:flex">
        {/* ロゴ */}
        <button
          type="button"
          onClick={() => handleClickItem('/')}
          className="flex h-16 cursor-pointer items-center gap-2.5 px-5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-neutral-950">
            T
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Tofu Admin
          </span>
        </button>

        {/* メニュー（グループ） */}
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-3">
          {NAVIGATION_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              <p className="px-3 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 first:pt-2">
                {group.label}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = isNavItemActive(item.path, pathname);
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleClickItem(item.path)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white text-neutral-950 shadow-sm'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ユーザー + ログアウト */}
        <div className="border-t border-neutral-800 p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-white">
              T
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium text-white">
                tofu 管理者
              </p>
              <p className="truncate text-xs text-neutral-500">@tofu_admin</p>
            </div>
            <button
              type="button"
              onClick={handleClickLogout}
              className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-white"
              title="ログアウト"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </aside>

      {/* モバイル: 上部ヘッダー（ロゴ） */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center bg-neutral-950 px-4 lg:hidden">
        <button
          type="button"
          onClick={() => handleClickItem('/')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-neutral-950">
            T
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            Tofu Admin
          </span>
        </button>
      </header>

      {/* モバイル: 下部タブバー */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-800 bg-neutral-950 lg:hidden">
        <div className="flex w-full items-center justify-around px-1 py-2">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(item.path, pathname);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleClickItem(item.path)}
                className={cn(
                  'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg py-1.5 transition-colors',
                  isActive ? 'text-white' : 'text-neutral-500'
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
            className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-neutral-500 transition-colors"
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
