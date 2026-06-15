export type PostStatus = 'DRAFT' | 'PUBLISHED';

export type Post = {
  post_id: number;
  user_id: number;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostResponse = {
  total_count: number;
  total_pages: number;
  posts: Post[];
};

export type PostRequest = {
  title: string;
  content_md: string;
  thumbnail_url: string | null;
  status: PostStatus;
  images: number[];
  tags: string[];
};

export type PostDeleteResponse = {
  message: string;
};

export type PostStatusPatchRequest = {
  status: PostStatus;
};

export type PostStatusPatchResponse = {
  message: string;
};

export type PostImage = {
  image_id: number;
  url: string;
  alt_text: string;
};

export type PostTag = {
  tag_id: number;
  name: string;
  slug: string;
};

export type PostDetail = {
  post_id: number;
  title: string;
  slug: string;
  content_md: string;
  content_html: string;
  thumbnail_id: number | null;
  thumbnail_url: string | null;
  thumbnail_alt_text: string | null;
  status: PostStatus;
  images: PostImage[];
  tags: PostTag[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PostPutRequest = {
  title: string;
  content_md: string;
  thumbnail_url: string | null;
  thumbnail_delete_flag?: boolean;
  status?: PostStatus;
  delete_images?: number[];
  new_images?: number[];
  tags?: string[];
};

export type PostPutResponse = {
  message: string;
  post_id: number;
};
