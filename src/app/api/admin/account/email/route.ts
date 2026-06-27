import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxyRequest';

export async function PATCH(req: NextRequest) {
  return proxyRequest(req, '/admin/account/email', {
    label: 'メールアドレス更新',
  });
}
