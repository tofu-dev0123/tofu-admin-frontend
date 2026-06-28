import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useAccountMe from '@/hooks/admin/account/useAccountMe';
import { post } from '@/lib/api/http';

vi.mock('@/lib/api/http', () => ({ post: vi.fn() }));
vi.mock('@/lib/logger', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const mockedPost = vi.mocked(post);

describe('useAccountMe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('マウント時にアカウント情報を取得して state に反映する', async () => {
    mockedPost.mockResolvedValue({
      user_id: 1,
      account_name: 'たろう',
      username: 'taro@example.com',
    });
    const showError = vi.fn();

    const { result } = renderHook(() => useAccountMe({ showError }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.accountName).toBe('たろう');
    expect(result.current.username).toBe('taro@example.com');
    expect(showError).not.toHaveBeenCalled();
  });

  it('取得失敗時は showError を呼び state は初期値に戻す', async () => {
    mockedPost.mockRejectedValue(new Error('boom'));
    const showError = vi.fn();

    const { result } = renderHook(() => useAccountMe({ showError }));

    await waitFor(() => expect(showError).toHaveBeenCalled());
    expect(result.current.accountName).toBe('');
    expect(result.current.username).toBe('');
  });
});
