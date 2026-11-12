'use client';

import React, { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * 記事一覧の検索入力を扱うフック。
 * 検索条件は URL に載せ、一覧の取得は usePostsQuery が URL から行う。
 */
function useSearchPost() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 入力欄は URL のキーワードで初期化し、URL が変わったら同期する
  // （effect ではなく render 中比較。戻る/クリア/検索に追従させるため）。
  const urlKeyword = searchParams.get('keyword') ?? '';
  const [keyword, setKeyword] = useState<string>(urlKeyword);
  const [prevUrlKeyword, setPrevUrlKeyword] = useState<string>(urlKeyword);
  if (urlKeyword !== prevUrlKeyword) {
    setPrevUrlKeyword(urlKeyword);
    setKeyword(urlKeyword);
  }

  // 現在のステータス条件を保ったまま遷移するための共通クエリ生成
  const buildQuery = useCallback(
    (nextKeyword: string) => {
      const params = new URLSearchParams();
      const trimmed = nextKeyword.trim();
      if (trimmed) params.append('keyword', trimmed);
      const status = searchParams.get('status');
      if (status) params.append('status', status);
      const qs = params.toString();
      return qs ? `/posts?${qs}` : '/posts';
    },
    [searchParams]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    },
    []
  );

  // Enter / 検索実行。空文字ならキーワードを外して全件に戻る（ステータスは保持）。
  const handleSearch = useCallback(() => {
    router.push(buildQuery(keyword));
  }, [router, buildQuery, keyword]);

  // 入力欄の × クリア。入力を空にしてキーワードを外す（ステータスは保持）。
  const handleClear = useCallback(() => {
    setKeyword('');
    router.push(buildQuery(''));
  }, [router, buildQuery]);

  return {
    keyword,
    handleSearch,
    handleClear,
    handleInputChange,
    setKeyword,
  };
}

export default useSearchPost;
