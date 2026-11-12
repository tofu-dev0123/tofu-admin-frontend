import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import useNavigationDrawer from '@/hooks/admin/common/useNavigationDrawer';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('useNavigationDrawer', () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue('/');
  });

  it('別ページへのリンク押下では閉じず、パスが変わったら閉じる', () => {
    const { result, rerender } = renderHook(() => useNavigationDrawer());

    act(() => result.current.openDrawer());
    act(() => result.current.handleNavigate('/posts'));
    expect(result.current.isDrawerOpen).toBe(true);

    vi.mocked(usePathname).mockReturnValue('/posts');
    rerender();
    expect(result.current.isDrawerOpen).toBe(false);
  });

  it('現在のページへのリンク押下では即座に閉じる', () => {
    const { result } = renderHook(() => useNavigationDrawer());

    act(() => result.current.openDrawer());
    act(() => result.current.handleNavigate('/'));

    expect(result.current.isDrawerOpen).toBe(false);
  });
});
