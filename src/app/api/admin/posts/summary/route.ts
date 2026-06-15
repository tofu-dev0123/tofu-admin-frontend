import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!backendUrl) {
    throw new Error('Backend URL is not configured');
  }

  // Cookieヘッダーを構築
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${backendUrl}/admin/posts/summary`, {
    method: 'GET',
    headers: {
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
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
