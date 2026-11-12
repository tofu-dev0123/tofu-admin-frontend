import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('children をボタンとして描画する', () => {
    render(<Button>送信</Button>);
    expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument();
  });

  it('variant に応じたクラスが付与される', () => {
    render(<Button variant="destructive">削除</Button>);
    expect(screen.getByRole('button', { name: '削除' })).toHaveClass(
      'bg-destructive'
    );
  });

  it('ghost-destructive variant のクラスが付与される', () => {
    render(<Button variant="ghost-destructive">削除</Button>);
    expect(screen.getByRole('button', { name: '削除' })).toHaveClass(
      'hover:text-destructive'
    );
  });

  it('loading 時は無効化され、aria-busy とスピナーが付く', () => {
    render(<Button loading>保存</Button>);
    const button = screen.getByRole('button', { name: /保存/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('通常時は aria-busy もスピナーも付かない', () => {
    render(<Button>保存</Button>);
    const button = screen.getByRole('button', { name: '保存' });
    expect(button).not.toHaveAttribute('aria-busy');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('loading 中はクリックしても onClick が呼ばれない', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        保存
      </Button>
    );
    fireEvent.click(screen.getByRole('button', { name: /保存/ }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('asChild + loading ではスピナーを出さず aria-busy のみ付く', () => {
    render(
      <Button asChild loading>
        <a href="https://example.com">ホーム</a>
      </Button>
    );
    expect(screen.getByRole('link', { name: 'ホーム' })).toHaveAttribute(
      'aria-busy',
      'true'
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
