// Products（公開サイトの制作物一覧）ページ管理用の型。
// バックエンド: /admin/products（CRUD）。

export type Tag = {
  tag_id: number;
  name: string;
  slug: string;
};

export type Product = {
  product_id: number;
  title: string;
  description: string | null;
  link_url: string | null;
  published: boolean;
  sort_order: number;
  tags: Tag[];
};

export type ProductListResponse = {
  products: Product[];
};

// 作成・更新の入力。
// 注意: レスポンスの tags は Tag[] だが、リクエストの tags はタグ名の string[]。
// description / link_url は空文字を送るとバックエンドで null に正規化される。
export type ProductRequest = {
  title: string;
  description: string | null;
  link_url: string | null;
  published: boolean;
  sort_order: number;
  tags: string[];
};

export type ProductResponse = {
  message: string;
  product_id: number;
};

export type ProductDeleteResponse = {
  message: string;
};
