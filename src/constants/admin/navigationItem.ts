import { Home, User, FileText, type LucideIcon } from 'lucide-react';

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    icon: Home,
    label: 'ホーム',
    path: '/admin/home',
  },
  {
    icon: User,
    label: 'アカウント',
    path: '/admin/account',
  },
  {
    icon: FileText,
    label: '投稿一覧',
    path: '/admin/posts',
  },
];

// アクティブなアイコンのインデックスを計算
export const getActiveIndex = (pathname: string): number => {
  return NAVIGATION_ITEMS.findIndex((item) => item.path === pathname);
};
