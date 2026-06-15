import { useState, useCallback } from 'react';
import { patch } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import {
  UpdateAccountNameResponse,
  UpdateAccountNameRequest,
} from '@/types/api/account';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';

interface UseEditAccountNameProps {
  showError: (message: string[]) => void;
}

function useEditAccountName({ showError }: UseEditAccountNameProps) {
  const [editFlag, setEditFlag] = useState(false);
  const [editAccountName, setEditAccountName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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
      const message = response.message;
      useToastStore.getState().show({
        type: 'success',
        message: message,
      });
      window.location.reload();
    } catch (error) {
      exceptErrorHandling(error, showError);
    } finally {
      setIsLoading(false);
    }
  }, [showError, editAccountName]);

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
