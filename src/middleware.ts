import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin配下のパスをチェック
  if (pathname.startsWith('/admin')) {
    // /admin/loginは認証不要として除外
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // クッキーから認証トークンを取得
    const authToken = request.cookies.get('auth_token');

    // トークンが存在しない場合はログイン画面にリダイレクト
    if (!authToken) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 認証が成功した場合、または/admin配下以外の場合はそのまま通過
  return NextResponse.next();
}

// middlewareを適用するパスを指定
export const config = {
  matcher: '/admin/:path*',
};
