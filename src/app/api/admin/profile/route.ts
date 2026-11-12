import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxyRequest';

export async function GET(req: NextRequest) {
  return proxyRequest(req, '/admin/profile', { label: 'プロフィール取得' });
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req, '/admin/profile', { label: 'プロフィール更新' });
}
