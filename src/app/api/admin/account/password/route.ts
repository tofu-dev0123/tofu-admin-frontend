import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!backendUrl) {
    throw new Error('Backend URL is not configured');
  }

  const body = await req.text();

  // Cookieヘッダーを構築
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${backendUrl}/admin/account/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
    body: body || undefined,
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
