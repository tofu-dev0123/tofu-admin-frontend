'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * サイドバー（モバイルドロワー）の開閉を管理するフック。
 * 遷移中の表示をドロワー内で見せるため、リンク押下では閉じず、パスが変わった時点で閉じる。
 */
function useNavigationDrawer() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 遷移完了（pathname の変化）でドロワーを閉じる。effect ではなく render 中に前回値と比較する
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsDrawerOpen(false);
  }

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // リンク押下時: 現在のページへのリンクはパスが変わらないため即座に閉じる
  const handleNavigate = (path: string) => {
    if (path === pathname) setIsDrawerOpen(false);
  };

  return { pathname, isDrawerOpen, openDrawer, closeDrawer, handleNavigate };
}

export default useNavigationDrawer;
