import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxyRequest';

export async function GET(req: NextRequest) {
  return proxyRequest(req, '/admin/products', { label: 'プロダクト一覧取得' });
}

export async function POST(req: NextRequest) {
  return proxyRequest(req, '/admin/products', { label: 'プロダクト作成' });
}
