import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxyRequest';

export async function POST(req: NextRequest) {
  return proxyRequest(req, '/admin/auth/me', { label: 'アカウント情報取得' });
}
