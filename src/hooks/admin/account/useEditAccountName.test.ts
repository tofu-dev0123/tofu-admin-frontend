import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import useEditAccountName from '@/hooks/admin/account/useEditAccountName';
import { patch } from '@/lib/api/http';
import { queryKeys } from '@/lib/api/queryKeys';
import { createQueryWrapper } from '@/test/queryWrapper';

vi.mock('@/lib/api/http', () => ({ patch: vi.fn() }));
vi.mock('@/lib/logger', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const mockedPatch = vi.mocked(patch);

beforeEach(() => {
  vi.clearAllMocks();
});

function changeEvent(value: string): ChangeEvent<HTMLInputElement> {
  return { target: { value } } as ChangeEvent<HTMLInputElement>;
}

// QueryClient 付きでフックを描画し、invalidateQueries を監視する
const setup = (showError = vi.fn()) => {
  const { wrapper, queryClient } = createQueryWrapper();
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  const { result } = renderHook(() => useEditAccountName({ showError }), {
    wrapper,
  });
  return { result, showError, invalidate };
};

describe('useEditAccountName', () => {
  it('入力したアカウント名で更新し、アカウント情報を無効化して編集欄を閉じる', async () => {
    mockedPatch.mockResolvedValue({
      message: '更新しました',
      user_id: 1,
      account_name: 'はなこ',
    });
    const { result, showError, invalidate } = setup();

    act(() => result.current.handleAccountNameEdit());
    act(() => result.current.handleAccountNameChange(changeEvent('はなこ')));
    await act(async () => {
      await result.current.updateAccountName();
    });

    expect(mockedPatch).toHaveBeenCalledWith('/api/admin/account', {
      account_name: 'はなこ',
    });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.me });
    expect(result.current.editFlag).toBe(false);
    expect(result.current.editAccountName).toBe('');
    expect(showError).not.toHaveBeenCalled();
  });

  it('更新失敗時は showError を呼び、無効化しない', async () => {
    mockedPatch.mockRejectedValue(new Error('boom'));
    const { result, showError, invalidate } = setup();

    act(() => result.current.handleAccountNameChange(changeEvent('はなこ')));
    await act(async () => {
      await result.current.updateAccountName();
    });

    expect(showError).toHaveBeenCalled();
    expect(invalidate).not.toHaveBeenCalled();
  });
});
