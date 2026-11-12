'use client';

import { useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/api/queryClient';

/** 管理画面のサーバー状態キャッシュ（TanStack Query）を供給する */
export function QueryProvider({ children }: { children: ReactNode }) {
  // レンダーごとに作り直さないよう state で 1 度だけ生成する
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
