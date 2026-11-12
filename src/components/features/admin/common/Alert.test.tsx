import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Alert from '@/components/features/admin/common/Alert';

describe('Alert', () => {
  it('実行中はアクションが処理中表示になり、キャンセルも無効になる', () => {
    render(
      <Alert
        open
        onOpenChange={vi.fn()}
        title="削除しますか？"
        actionText="削除"
        isActionLoading
        loadingText="削除中…"
      />
    );

    const action = screen.getByRole('button', { name: '削除中…' });
    expect(action).toHaveAttribute('aria-busy', 'true');
    expect(action).toBeDisabled();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeDisabled();
  });

  it('親が処理中を制御する場合、アクション押下で自動的に閉じない', () => {
    const onOpenChange = vi.fn();
    const onAction = vi.fn();
    render(
      <Alert
        open
        onOpenChange={onOpenChange}
        title="削除しますか？"
        actionText="削除"
        onAction={onAction}
        isActionLoading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '削除' }));

    expect(onAction).toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it('処理中を制御しない場合は、アクション押下で閉じる', () => {
    const onOpenChange = vi.fn();
    render(
      <Alert
        open
        onOpenChange={onOpenChange}
        title="続けますか？"
        actionText="続ける"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '続ける' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
