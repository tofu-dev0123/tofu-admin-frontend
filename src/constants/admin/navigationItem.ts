import homeGrayIcon from '@/assets/images/home-gray-icon.png';
import listIcon from '@/assets/images/list-icon.png';
import accountIcon from '@/assets/images/account-icon.png';

export const NAVIGATION_ITEMS = [
  {
    icon: homeGrayIcon,
    alt: 'home',
    path: '/admin/home',
    title: 'ホーム',
  },
  {
    icon: accountIcon,
    alt: 'add',
    path: '/admin/account',
    title: '投稿作成',
  },
  {
    icon: listIcon,
    alt: 'list',
    path: '/admin/posts',
    title: '投稿一覧',
  },
];

// アクティブなアイコンのインデックスを計算
export const getActiveIndex = (pathname: string): number => {
  return NAVIGATION_ITEMS.findIndex((item) => item.path === pathname);
};
