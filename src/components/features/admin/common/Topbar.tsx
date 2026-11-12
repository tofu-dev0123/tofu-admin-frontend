'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getActiveNavInfo } from '@/constants/admin/navigationItem';

/**
 * コンテンツ上部のパンくずバー（モダン管理画面シェル）。
 * 現在パスに対応するナビゲーションのグループ名と項目名を表示する。
 */
function Topbar() {
  const pathname = usePathname();
  const active = getActiveNavInfo(pathname);

  return (
    <header className="sticky top-14 z-40 flex h-14 items-center border-b border-border bg-background/80 px-6 backdrop-blur lg:top-0 lg:h-16 lg:px-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {active ? (
          <>
            <span>{active.group}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">
              {active.item.label}
            </span>
          </>
        ) : (
          <span className="font-medium text-foreground">管理画面</span>
        )}
      </div>
    </header>
  );
}

export default Topbar;
