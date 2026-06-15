import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest, LoginResponse } from '@/types/api/login';

export async function POST(req: NextRequest) {
  const body: LoginRequest = await req.json();

  // FastAPIにリクエストを送信
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backendUrl) {
    throw new Error('Backend URL is not configured');
  }

  const response = await fetch(`${backendUrl}/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    // FastAPIからのエラーレスポンスをそのまま返す
    const errorData = await response.text();
    let errorJson;
    try {
      errorJson = JSON.parse(errorData);
    } catch {
      // JSONでない場合は、エラーメッセージとして返す
      errorJson = { error: errorData || 'An error occurred' };
    }
    return NextResponse.json(errorJson, {
      status: response.status,
    });
  }

  const data: LoginResponse = await response.json();

  // Cookieをセット
  const cookieStore = await cookies();
  cookieStore.set('auth_token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 3, // 3時間
  });

  return NextResponse.json({ ok: true });
}
