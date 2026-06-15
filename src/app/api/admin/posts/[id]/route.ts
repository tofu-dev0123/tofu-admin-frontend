import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

async function handleRequest(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!backendUrl) {
    throw new Error('Backend URL is not configured');
  }

  // paramsをawaitする
  const { id } = await params;
  const method = req.method;

  // Cookieヘッダーを構築
  const cookieHeader = cookieStore.toString();

  // リクエストヘッダーを準備
  const headers: HeadersInit = {
    ...(cookieHeader && { Cookie: cookieHeader }),
  };

  // リクエストボディを準備
  let body: BodyInit | undefined;
  if (method === 'GET' || method === 'DELETE') {
    body = undefined;
  } else {
    const bodyText = await req.text();
    body = bodyText || undefined;
    if (body) {
      headers['Content-Type'] = 'application/json';
    }
  }

  const response = await fetch(`${backendUrl}/admin/posts/${id}`, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    const errorData = await response.text();
    let errorJson;
    try {
      errorJson = JSON.parse(errorData);
    } catch {
      errorJson = { error: errorData || 'An error occurred' };
    }
    return NextResponse.json(errorJson, {
      status: response.status,
    });
  }

  const data = await response.json();
  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleRequest(req, { params });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleRequest(req, { params });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleRequest(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleRequest(req, { params });
}
