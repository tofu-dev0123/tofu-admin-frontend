import { useState, useCallback } from 'react';
import { patch } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import {
  UpdateAccountNameResponse,
  UpdateAccountNameRequest,
} from '@/types/api/account';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';
import { logger } from '@/lib/logger';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';

interface UseEditAccountNameProps {
  showError: (message: string[]) => void;
}

function useEditAccountName({ showError }: UseEditAccountNameProps) {
  const [editFlag, setEditFlag] = useState(false);
  const [editAccountName, setEditAccountName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  /**
   * アカウント名を変更する
   */
  const updateAccountName = useCallback(async () => {
    setIsLoading(true);
    try {
      const request: UpdateAccountNameRequest = {
        account_name: editAccountName,
      };
      const response = await patch<
        UpdateAccountNameResponse,
        UpdateAccountNameRequest
      >(API_ENDPOINTS.account.patch, request);
      logger.info('[account] アカウント名を更新しました');
      const message = response.message;
      useToastStore.getState().show({
        type: 'success',
        message: message,
      });
      // アカウント情報を再取得して表示に反映し、編集欄を閉じる
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
      setEditAccountName('');
      setEditFlag(false);
    } catch (error) {
      exceptErrorHandling(error, showError);
    } finally {
      setIsLoading(false);
    }
  }, [showError, editAccountName, queryClient]);

  const handleAccountNameEdit = () => {
    if (editFlag) {
      setEditAccountName('');
    }
    setEditFlag(!editFlag);
  };

  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditAccountName(e.target.value);
  };

  return {
    editFlag,
    editAccountName,
    isLoading,
    updateAccountName,
    handleAccountNameEdit,
    handleAccountNameChange,
  };
}

export default useEditAccountName;
