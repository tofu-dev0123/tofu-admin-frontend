import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

interface ProxyOptions {
  // ログ用の操作名（例: '投稿一覧取得'）。未指定なら "METHOD path" を使う
  label?: string;
}

/**
 * 管理画面用 API の共通プロキシ。
 * 受け取ったリクエストを backend（NEXT_PUBLIC_API_BASE_URL）へ cookie 付きで転送し、
 * レスポンスを status を保ったまま返す。エラーは logger に詳細を記録する。
 */
export async function proxyRequest(
  req: NextRequest,
  backendPath: string,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  const method = req.method;
  const ctx = options.label ?? `${method} ${backendPath}`;

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backendUrl) {
    logger.error(`[proxy] ${ctx}: Backend URL is not configured`);
    return NextResponse.json(
      { error: 'Backend URL is not configured' },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const headers: Record<string, string> = {
    ...(cookieHeader && { Cookie: cookieHeader }),
  };

  // ボディ転送: GET/DELETE/HEAD は無し、multipart はそのまま、それ以外は JSON
  let body: BodyInit | undefined;
  if (method !== 'GET' && method !== 'DELETE' && method !== 'HEAD') {
    const contentType = req.headers.get('content-type') ?? '';
    if (contentType.includes('multipart/form-data')) {
      body = await req.formData();
    } else {
      const text = await req.text();
      if (text) {
        headers['Content-Type'] = 'application/json';
        body = text;
      }
    }
  }

  // クエリ文字列はそのまま backend へ引き継ぐ
  const url = `${backendUrl}${backendPath}${req.nextUrl.search}`;

  let response: Response;
  try {
    response = await fetch(url, { method, headers, body });
  } catch (error) {
    logger.error(`[proxy] ${ctx}: backend への接続に失敗`, error);
    return NextResponse.json(
      { error: 'バックエンドへの接続に失敗しました' },
      { status: 502 }
    );
  }

  if (!response.ok) {
    const errorData = await response.text();
    let errorJson: unknown;
    try {
      errorJson = JSON.parse(errorData);
    } catch {
      errorJson = { error: errorData || 'An error occurred' };
    }
    const message = `[proxy] ${ctx}: backend が ${response.status} を返却`;
    if (response.status >= 500) {
      logger.error(message, errorJson);
    } else {
      logger.warn(message, errorJson);
    }
    return NextResponse.json(errorJson, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
