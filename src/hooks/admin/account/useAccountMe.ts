'use client';

import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { post } from '@/lib/api/http';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { MeResponse } from '@/types/api/account';
import { useCallback, useEffect, useState } from 'react';

interface UseAccountMeProps {
  showError: (message: string[]) => void;
}

function useAccountMe({ showError }: UseAccountMeProps) {
  const [userId, setUserId] = useState<number>(0);
  const [accountName, setAccountName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const getAccount = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await post<MeResponse>(API_ENDPOINTS.account.me);
      setUserId(response.user_id);
      setAccountName(response.account_name);
      setUsername(response.username);
    } catch (error) {
      exceptErrorHandling(error, showError);
      setUserId(0);
      setAccountName('');
      setUsername('');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    getAccount();
  }, [getAccount]);

  return {
    userId,
    accountName,
    username,
    isLoading,
    getAccount,
  };
}

export default useAccountMe;
