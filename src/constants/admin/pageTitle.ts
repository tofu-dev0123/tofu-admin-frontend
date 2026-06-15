export const PAGE_TITLES = [
  {
    path: '/admin/home',
    title: 'ホーム',
  },
  {
    path: '/admin/account',
    title: 'アカウント管理',
  },
  {
    path: '/admin/posts',
    title: '投稿一覧',
  },
  {
    path: '/admin/posts/new',
    title: '投稿作成',
  },
  {
    path: '/admin/posts/:id/edit',
    title: '投稿編集',
  },
];

export const getPageTitle = (pathname: string): string => {
  // まず完全一致を確認
  const exactMatch = PAGE_TITLES.find((page) => page.path === pathname);
  if (exactMatch) {
    return exactMatch.title;
  }

  // 動的ルート（:id など）を含むパスを正規表現でマッチ
  for (const page of PAGE_TITLES) {
    // :id などの動的セグメントを正規表現に変換
    const pattern = page.path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(pathname)) {
      return page.title;
    }
  }

  return '';
};
