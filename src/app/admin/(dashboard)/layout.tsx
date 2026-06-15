'use client';

import type { ReactNode } from 'react';
import useDashboard from '@/hooks/admin/common/useDashboard';
import ErrorModal from '@/components/features/admin/common/ErrorModal';
import Navigation from '@/components/features/admin/common/Navigation';
import Title from '@/components/features/admin/common/Title';
import { usePathname } from 'next/navigation';
import { getPageTitle } from '@/constants/admin/pageTitle';
import Logo from '@/components/features/admin/common/Logo';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { handleClickLogout, errorModalHook } = useDashboard();

  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="w-full min-h-screen bg-gray-100/50">
      {/* ロゴ */}
      <Logo />

      {/* ナビゲーション */}
      <Navigation handleClickLogout={handleClickLogout} />
      {/* メインコンテンツ */}
      <div className="w-full h-full flex flex-col justify-center items-center">
        <main className="flex-1 overflow-auto w-full">
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
