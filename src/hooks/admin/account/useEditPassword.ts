import { useState, useCallback } from 'react';
import { patch } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import {
  ChangePasswordResponse,
  ChangePasswordRequest,
} from '@/types/api/account';
import { exceptErrorHandling } from '@/lib/utils/exceptErrorHandling';
import { useToastStore } from '@/stores/toastStore';

interface UseEditUsernameProps {
  showError: (message: string[]) => void;
}

function useEditUsername({ showError }: UseEditUsernameProps) {
  const [editFlag, setEditFlag] = useState(false);
  const [editPassword, setEditPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * パスワードを変更する
   */
  const changePassword = useCallback(async () => {
    setIsLoading(true);
    try {
      if (editPassword !== confirmPassword) {
        showError(['パスワードが一致しません']);
        return;
      }
      if (editPassword.length < 8) {
        showError(['パスワードは8文字以上で入力してください']);
        return;
      }
      if (editPassword.length > 20) {
        showError(['パスワードは20文字以内で入力してください']);
        return;
      }
      const request: ChangePasswordRequest = {
        current_password: currentPassword,
        new_password: editPassword,
      };
      const response = await patch<
        ChangePasswordResponse,
        ChangePasswordRequest
      >(API_ENDPOINTS.account.password, request);
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
  }, [showError, currentPassword, editPassword, confirmPassword]);

  const handlePasswordEdit = () => {
    if (editFlag) {
      setEditPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    }
    setEditFlag(!editFlag);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPassword(e.target.value);
  };

  return {
    editFlag,
    editPassword,
    confirmPassword,
    currentPassword,
    isLoading,
    changePassword,
    handlePasswordEdit,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleCurrentPasswordChange,
  };
}

export default useEditUsername;
