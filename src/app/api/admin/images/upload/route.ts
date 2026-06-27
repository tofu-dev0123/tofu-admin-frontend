import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxyRequest';

export async function POST(req: NextRequest) {
  return proxyRequest(req, '/admin/images/upload', {
    label: '画像アップロード',
  });
}
