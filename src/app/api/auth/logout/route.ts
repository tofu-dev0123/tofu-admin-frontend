import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST() {
  const cookieStore = await cookies();

  // FastAPIにリクエストを送信（Cookieをそのまま渡す）
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backendUrl) {
    logger.error('[auth] ログアウト: Backend URL is not configured');
    throw new Error('Backend URL is not configured');
  }

  // Cookieヘッダーを構築
  const cookieHeader = cookieStore.toString();

  let response: Response;
  try {
    response = await fetch(`${backendUrl}/admin/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });
  } catch (error) {
    logger.error('[auth] ログアウト: backend への接続に失敗', error);
    return NextResponse.json(
      { error: 'バックエンドへの接続に失敗しました' },
      { status: 502 }
    );
  }

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
    const message = `[auth] ログアウト失敗: backend が ${response.status} を返却`;
    if (response.status >= 500) {
      logger.error(message, errorJson);
    } else {
      logger.warn(message, errorJson);
    }
    return NextResponse.json(errorJson, {
      status: response.status,
    });
  }

  // 正常レスポンスが返ってきたらCookieを削除
  cookieStore.delete('auth_token');

  logger.info('[auth] ログアウト成功');
  return NextResponse.json({ ok: true });
}
