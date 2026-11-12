'use client';

import Link, { useLinkStatus } from 'next/link';
import { LogOut, Menu, X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import {
  NAVIGATION_GROUPS,
  isNavItemActive,
} from '@/constants/admin/navigationItem';
import { cn } from '@/lib/utils';
import useNavigationDrawer from '@/hooks/admin/common/useNavigationDrawer';

interface NavigationProps {
  handleClickLogout?: () => void;
  isLoggingOut?: boolean;
}

// 遷移中（Link の pending 中）だけ表示するインジケーター。Link の子孫で使う必要がある
function NavPendingIndicator() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <Spinner aria-hidden="true" className="ml-auto size-3.5" />;
}

// ロゴ（白背景の T + サービス名）
function Logo({ onNavigate }: { onNavigate?: (path: string) => void }) {
  return (
    <Link
      href="/"
      onClick={() => onNavigate?.('/')}
      className="flex items-center gap-2.5"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-neutral-950">
        T
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-white">
        Tofu Admin
      </span>
    </Link>
  );
}

// グループ分けされたメニュー本体（デスクトップ／モバイルドロワー共用）
function NavGroups({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-3">
      {NAVIGATION_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-0.5">
          <p className="px-3 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 first:pt-2">
            {group.label}
          </p>
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(item.path, pathname);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => onNavigate(item.path)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
                <NavPendingIndicator />
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

// ユーザーチップ + ログアウト（デスクトップ／モバイルドロワー共用）
function UserFooter({
  onClickLogout,
  isLoggingOut,
}: {
  onClickLogout?: () => void;
  isLoggingOut?: boolean;
}) {
  return (
    <div className="border-t border-neutral-800 p-3">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-white">
          T
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium text-white">tofu 管理者</p>
          <p className="truncate text-xs text-neutral-500">@tofu_admin</p>
        </div>
        <button
          type="button"
          onClick={onClickLogout}
          disabled={isLoggingOut}
          aria-busy={isLoggingOut || undefined}
          className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-white disabled:opacity-60"
          title="ログアウト"
          aria-label="ログアウト"
        >
          {isLoggingOut ? (
            <Spinner aria-hidden="true" className="h-[18px] w-[18px]" />
          ) : (
            <LogOut className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>
    </div>
  );
}

function Navigation({ handleClickLogout, isLoggingOut }: NavigationProps) {
  // 遷移は Link が行う（プリフェッチ有効）。ドロワーは遷移完了で閉じる
  const { pathname, isDrawerOpen, openDrawer, closeDrawer, handleNavigate } =
    useNavigationDrawer();

  return (
    <>
      {/* デスクトップ: 左固定ダークサイドバー */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-neutral-950 text-neutral-300 lg:flex">
        <div className="flex h-16 items-center px-5">
          <Logo onNavigate={handleNavigate} />
        </div>
        <NavGroups pathname={pathname} onNavigate={handleNavigate} />
        <UserFooter
          onClickLogout={handleClickLogout}
          isLoggingOut={isLoggingOut}
        />
      </aside>

      {/* モバイル: 上部ヘッダー（ハンバーガー + ロゴ） */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 bg-neutral-950 px-4 lg:hidden">
        <button
          type="button"
          onClick={openDrawer}
          className="-ml-1 rounded-md p-1.5 text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white"
          aria-label="メニューを開く"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Logo onNavigate={handleNavigate} />
      </header>

      {/* モバイル: ドロワー用スクリム */}
      {isDrawerOpen && (
        <div
          onClick={closeDrawer}
          className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* モバイル: 左スライドドロワー */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-neutral-950 text-neutral-300 shadow-2xl transition-transform duration-300 lg:hidden',
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-hidden={!isDrawerOpen}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <Logo onNavigate={handleNavigate} />
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
            aria-label="メニューを閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavGroups pathname={pathname} onNavigate={handleNavigate} />
        <UserFooter
          onClickLogout={handleClickLogout}
          isLoggingOut={isLoggingOut}
        />
      </aside>
    </>
  );
}

export default Navigation;
