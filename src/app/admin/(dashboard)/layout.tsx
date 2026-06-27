'use client';

import type { ReactNode } from 'react';
import useDashboard from '@/hooks/admin/common/useDashboard';
import ErrorModal from '@/components/features/admin/common/ErrorModal';
import Navigation from '@/components/features/admin/common/Navigation';
import Title from '@/components/features/admin/common/Title';
import { usePathname } from 'next/navigation';
import { getPageTitle } from '@/constants/admin/pageTitle';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { handleClickLogout, errorModalHook } = useDashboard();

  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="w-full min-h-screen bg-gray-100/50">
      {/* ナビゲーション（PC: 左サイドバー / スマホ: 上部ヘッダー + 下部タブ） */}
      <Navigation handleClickLogout={handleClickLogout} />
      {/* メインコンテンツ（サイドバー幅・モバイルバー分の余白を確保） */}
      <div className="w-full lg:pl-60">
        <main className="w-full overflow-auto pt-14 pb-24 lg:pt-0 lg:pb-0">
          <Title title={pageTitle} />
          {children}
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
