import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxyRequest';

type RouteContext = { params: Promise<{ id: string }> };

async function handle(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return proxyRequest(req, `/admin/products/${id}`, {
    label: `プロダクト ${req.method} #${id}`,
  });
}

export async function GET(req: NextRequest, ctx: RouteContext) {
  return handle(req, ctx);
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  return handle(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  return handle(req, ctx);
}
