import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!backendUrl) {
    throw new Error('Backend URL is not configured');
  }

  // FormDataを取得
  const formData = await req.formData();

  // Cookieヘッダーを構築
  const cookieHeader = cookieStore.toString();

  // バックエンドにリクエストを送信
  const response = await fetch(`${backendUrl}/admin/images/upload`, {
    method: 'POST',
    headers: {
      ...(cookieHeader && { Cookie: cookieHeader }),
      // FormDataの場合はContent-Typeを設定しない（ブラウザが自動設定）
    },
    body: formData,
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

  // レスポンスを取得
  const data = await response.json();
  return NextResponse.json(data, {
    status: response.status,
  });
}
