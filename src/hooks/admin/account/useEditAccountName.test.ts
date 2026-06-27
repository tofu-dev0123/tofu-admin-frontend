import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import useEditAccountName from '@/hooks/admin/account/useEditAccountName';
import { patch } from '@/lib/api/http';

vi.mock('@/lib/api/http', () => ({ patch: vi.fn() }));
vi.mock('@/lib/logger', () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const mockedPatch = vi.mocked(patch);

// updateAccountName 成功時に呼ばれる window.location.reload を差し替える
const reloadMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { reload: reloadMock },
  });
});

function changeEvent(value: string): ChangeEvent<HTMLInputElement> {
  return { target: { value } } as ChangeEvent<HTMLInputElement>;
}

describe('useEditAccountName', () => {
  it('入力したアカウント名で更新APIを呼ぶ', async () => {
    mockedPatch.mockResolvedValue({
      message: '更新しました',
      user_id: 1,
      account_name: 'はなこ',
    });
    const showError = vi.fn();

    const { result } = renderHook(() => useEditAccountName({ showError }));

    act(() => result.current.handleAccountNameChange(changeEvent('はなこ')));
    await act(async () => {
      await result.current.updateAccountName();
    });

    expect(mockedPatch).toHaveBeenCalledWith('/api/admin/account', {
      account_name: 'はなこ',
    });
    expect(reloadMock).toHaveBeenCalled();
    expect(showError).not.toHaveBeenCalled();
  });

  it('更新失敗時は showError を呼ぶ', async () => {
    mockedPatch.mockRejectedValue(new Error('boom'));
    const showError = vi.fn();

    const { result } = renderHook(() => useEditAccountName({ showError }));

    act(() => result.current.handleAccountNameChange(changeEvent('はなこ')));
    await act(async () => {
      await result.current.updateAccountName();
    });

    expect(showError).toHaveBeenCalled();
    expect(reloadMock).not.toHaveBeenCalled();
  });
});
