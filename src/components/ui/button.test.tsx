import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
