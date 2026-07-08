'use client';

import { useState } from 'react';
import { MeResponse } from '@/types/api/account';

interface UseAccountMeProps {
  // サーバー（RSC）で取得済みの初期アカウント情報
  initial: MeResponse;
}

/**
 * アカウント情報を保持するフック。
 * 初期データはサーバー側（AccountSection）で取得して props で渡す。
 * 更新は各編集フックが window.location.reload() で反映するため、
 * ここではクライアント側の再取得は行わない。
 */
function useAccountMe({ initial }: UseAccountMeProps) {
  const [userId] = useState<number>(initial.user_id);
  const [accountName] = useState<string>(initial.account_name);
  const [username] = useState<string>(initial.username);

  return {
    userId,
    accountName,
    username,
  };
}

export default useAccountMe;
