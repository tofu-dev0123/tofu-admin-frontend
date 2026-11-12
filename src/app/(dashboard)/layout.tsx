'use client';

import type { ReactNode } from 'react';
import useDashboard from '@/hooks/admin/common/useDashboard';
import ErrorModal from '@/components/features/admin/common/ErrorModal';
import Navigation from '@/components/features/admin/common/Navigation';
import Topbar from '@/components/features/admin/common/Topbar';
import { QueryProvider } from '@/components/common/QueryProvider';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { handleClickLogout, isLoggingOut, errorModalHook } = useDashboard();

  return (
    <div className="w-full min-h-screen bg-background">
      {/* ナビゲーション（PC: 左ダークサイドバー / スマホ: 上部ヘッダー + 下部タブ） */}
      <Navigation
        handleClickLogout={handleClickLogout}
        isLoggingOut={isLoggingOut}
      />
      {/* メインコンテンツ（サイドバー幅・モバイルバー分の余白を確保） */}
      <div className="w-full pt-14 lg:pl-64 lg:pt-0">
        <Topbar />
        {/* ログアウトでこのレイアウトを抜けると QueryClient ごと破棄され、キャッシュも残らない */}
        <main className="w-full">
          <QueryProvider>{children}</QueryProvider>
        </main>
      </div>
      <ErrorModal
        isOpen={errorModalHook.isOpen}
        errorMessage={errorModalHook.errorMessage}
        onClose={errorModalHook.onClose}
      />
    </div>
  );
}
