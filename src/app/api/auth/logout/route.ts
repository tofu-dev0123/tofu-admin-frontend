import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();

  // FastAPIにリクエストを送信（Cookieをそのまま渡す）
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backendUrl) {
    throw new Error('Backend URL is not configured');
  }

  // Cookieヘッダーを構築
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${backendUrl}/admin/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
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

  // 正常レスポンスが返ってきたらCookieを削除
  cookieStore.delete('auth_token');

  return NextResponse.json({ ok: true });
}
