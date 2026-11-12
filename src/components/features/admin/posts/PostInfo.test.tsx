import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PostInfo from '@/components/features/admin/posts/PostInfo';
import type { Post } from '@/types/api/post';

const post: Post = {
  post_id: 1,
  user_id: 1,
  title: 'テスト記事',
  slug: 'test-post',
  thumbnail_url: null,
  status: 'PUBLISHED',
  published_at: '2026-01-10T15:00:00Z',
  created_at: '2026-01-10T15:00:00Z',
  updated_at: '2026-01-10T15:00:00Z',
};

describe('PostInfo', () => {
  it('created_at の日時を JST で表示する', () => {
    render(
      <PostInfo
        post={post}
        handleOpenDeleteAlert={vi.fn()}
        handleOpenPatchStatusAlert={vi.fn()}
        handleClickEdit={vi.fn()}
      />
    );
    expect(screen.getByText('2026年01月11日 00時00分')).toBeInTheDocument();
  });
});
