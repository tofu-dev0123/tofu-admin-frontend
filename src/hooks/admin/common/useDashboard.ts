'use client';

import { useState } from 'react';
import { postToNextApi } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { MESSAGES } from '@/constants/messages';
import useErrorModal from './useErrorModal';

function useDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  // エラーモーダル状態管理フック
  const errorModalHook = useErrorModal();

  const handleClickMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // ログアウト
  const handleClickLogout = async () => {
    try {
      const result = await confirm('ログアウトしますか？');
      if (result) {
        await postToNextApi<{ ok: boolean }>(API_ENDPOINTS.logout.post);
        router.push('/login');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // APIからエラーレスポンスが返ってきた場合
        const errorMessage = getErrorMessage(error.response.data);
        errorModalHook.showError(errorMessage);
      } else {
        errorModalHook.showError([MESSAGES.errors.common.failed]);
      }
    }
  };

  return {
    isMenuOpen,
    handleClickMenu,
    handleClickLogout,
    errorModalHook,
  };
}

export default useDashboard;
