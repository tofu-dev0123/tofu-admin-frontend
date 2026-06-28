import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // クッキーから認証トークンを取得
  const authToken = request.cookies.get('auth_token');

  // トークンが存在しない場合はログイン画面にリダイレクト
  if (!authToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 認証済みはそのまま通過
  return NextResponse.next();
}

// 認証ガードの対象は保護対象パスに限定する。
// /login・/api・静的アセット・未定義パスは対象外（未定義パスは not-found で 404 になる）。
export const config = {
  matcher: ['/', '/account/:path*', '/posts/:path*'],
};
