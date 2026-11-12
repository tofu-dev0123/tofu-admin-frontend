import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Post from '@/components/features/admin/common/Post';
import type { Post as PostType } from '@/types/api/post';

const post: PostType = {
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

describe('Post', () => {
  it('created_at の日時を JST で表示する', () => {
    render(<Post post={post} handleClickPost={vi.fn()} />);
    expect(screen.getByText('2026年01月11日 00時00分')).toBeInTheDocument();
  });
});
