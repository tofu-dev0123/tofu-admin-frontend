import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxyRequest';

export async function GET(req: NextRequest) {
  return proxyRequest(req, '/admin/timelines', { label: '年表一覧取得' });
}

export async function POST(req: NextRequest) {
  return proxyRequest(req, '/admin/timelines', { label: '年表作成' });
}
