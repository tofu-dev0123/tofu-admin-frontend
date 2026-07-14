import {
  LayoutDashboard,
  FileText,
  UserRound,
  Package,
  CircleUser,
  type LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

// サイドバーのグループ構成（モダン管理画面シェル）
export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    label: 'メニュー',
    items: [
      { icon: LayoutDashboard, label: 'ダッシュボード', path: '/' },
      { icon: FileText, label: '投稿', path: '/posts' },
    ],
  },
  {
    label: '公開サイト',
    items: [
      { icon: UserRound, label: 'About', path: '/about' },
      { icon: Package, label: 'Products', path: '/products' },
    ],
  },
  {
    label: '設定',
    items: [{ icon: CircleUser, label: 'アカウント', path: '/account' }],
  },
];

// パスがナビゲーション項目に対応するか（配下パスも対象。ルート '/' は完全一致のみ）
export const isNavItemActive = (
  itemPath: string,
  pathname: string
): boolean => {
  if (itemPath === '/') {
    return pathname === '/';
  }
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
};

// 現在パスに対応するグループ名と項目を返す（パンくず表示用）
export const getActiveNavInfo = (
  pathname: string
): { group: string; item: NavigationItem } | null => {
  for (const group of NAVIGATION_GROUPS) {
    const item = group.items.find((i) => isNavItemActive(i.path, pathname));
    if (item) {
      return { group: group.label, item };
    }
  }
  return null;
};
