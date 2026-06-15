import { useState, useCallback } from 'react';
import { patch } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { ChangeEmailResponse, ChangeEmailRequest } from '@/types/api/account';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';

interface UseEditUsernameProps {
  showError: (message: string[]) => void;
}

function useEditUsername({ showError }: UseEditUsernameProps) {
  const [editFlag, setEditFlag] = useState(false);
  const [editUsername, setEditUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * メールアドレスを変更する
   */
  const changeEmail = useCallback(
    async (currentUsername: string) => {
      setIsLoading(true);
      try {
        const request: ChangeEmailRequest = {
          current_email: currentUsername,
          new_email: editUsername,
          password: password,
        };
        const response = await patch<ChangeEmailResponse, ChangeEmailRequest>(
          API_ENDPOINTS.account.email,
          request
        );
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
    },
    [showError, editUsername, password]
  );

  const handleUsernameEdit = () => {
    if (editFlag) {
      setEditUsername('');
    }
    setEditFlag(!editFlag);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return {
    editFlag,
    editUsername,
    password,
    isLoading,
    changeEmail,
    handleUsernameEdit,
    handleUsernameChange,
    handlePasswordChange,
  };
}

export default useEditUsername;
