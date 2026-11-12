import type { PostStatus } from '@/types/api/post';

export interface PostListParams {
  offset?: number;
  limit?: number;
  keyword?: string;
  status?: PostStatus;
}

/**
 * TanStack Query のクエリキー定義。
 * 無効化（invalidateQueries）は前方一致なので、上位キー（例: posts.all）で関連クエリをまとめて無効化できる。
 */
export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    list: (params: PostListParams) => ['posts', 'list', params] as const,
    summary: ['posts', 'summary'] as const,
    detail: (id: number) => ['posts', 'detail', id] as const,
  },
  me: ['me'] as const,
  profile: ['profile'] as const,
  timelines: ['timelines'] as const,
  products: ['products'] as const,
};
