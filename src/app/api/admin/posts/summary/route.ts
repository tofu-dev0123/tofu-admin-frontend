import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxyRequest';

export async function GET(req: NextRequest) {
  return proxyRequest(req, '/admin/posts/summary', { label: '投稿サマリ取得' });
}
