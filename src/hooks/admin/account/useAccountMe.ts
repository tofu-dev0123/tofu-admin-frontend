'use client';

import { MeResponse } from '@/types/api/account';

interface UseAccountMeProps {
  // クエリ（useMeQuery）で取得済みのアカウント情報。更新後は無効化で最新に差し替わる
  account: MeResponse;
}

/**
 * 表示用のアカウント情報を返すフック。
 * 値はクエリのデータから導出し、手元に state として複製しない。
 */
function useAccountMe({ account }: UseAccountMeProps) {
  return {
    userId: account.user_id,
    accountName: account.account_name,
    username: account.username,
  };
}

export default useAccountMe;
