import { cookies } from 'next/headers';
import { logger } from '@/lib/logger';

interface ServerFetchInit {
  // HTTP メソッド（既定 GET）。me のような POST 取得にも対応する
  method?: string;
  // クエリ文字列
  searchParams?: URLSearchParams;
  // ログ用の操作名（例: '投稿サマリ取得'）
  label?: string;
}

/**
 * RSC（Server Component）からバックエンドを直接叩くためのヘルパ。
 * proxyRequest と同じ定型（cookies() で認証クッキーを転送し、
 * NEXT_PUBLIC_API_BASE_URL + backendPath へ fetch）をサーバー取得用に切り出したもの。
 * ブラウザ前提の http.ts / axios は RSC からは使えないためこちらを使う。
 * 失敗時は throw し、呼び出し側の Section で捕捉させる（1領域の失敗で全画面を落とさない）。
 *
 * @param backendPath backend のパス（例: '/admin/posts/summary'。'/api' は付けない）
 */
export async function serverFetch<T>(
  backendPath: string,
  init: ServerFetchInit = {}
): Promise<T> {
  const method = init.method ?? 'GET';
  const ctx = init.label ?? `${method} ${backendPath}`;

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backendUrl) {
    logger.error(`[server] ${ctx}: Backend URL is not configured`);
    throw new Error('Backend URL is not configured');
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const headers: Record<string, string> = {
    ...(cookieHeader && { Cookie: cookieHeader }),
  };

  const search = init.searchParams?.toString();
  const url = `${backendUrl}${backendPath}${search ? `?${search}` : ''}`;

  let response: Response;
  try {
    // 認証付きの動的データなのでキャッシュしない
    response = await fetch(url, { method, headers, cache: 'no-store' });
  } catch (error) {
    logger.error(`[server] ${ctx}: backend への接続に失敗`, error);
    throw error;
  }

  if (!response.ok) {
    const message = `[server] ${ctx}: backend が ${response.status} を返却`;
    // 4xx=warn / 5xx=error（logging.md 準拠）
    if (response.status >= 500) {
      logger.error(message);
    } else {
      logger.warn(message);
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

/**
 * serverFetch の GET ショートハンド。
 */
export function serverGet<T>(
  backendPath: string,
  searchParams?: URLSearchParams,
  label?: string
): Promise<T> {
  return serverFetch<T>(backendPath, { method: 'GET', searchParams, label });
}
