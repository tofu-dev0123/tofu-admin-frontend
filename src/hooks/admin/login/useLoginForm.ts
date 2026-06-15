'use client';
import { useForm } from 'react-hook-form';
import { postToNextApi } from '@/lib/api/http';
import { API_ENDPOINTS } from '@/lib/api/endpoint';
import { LoginRequest } from '@/types/api/login';
import { useState } from 'react';
import { MESSAGES } from '@/constants/messages';
import axios from 'axios';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { useRouter } from 'next/navigation';

interface LoginForm {
  username: string;
  password: string;
}

function useLoginForm() {
  const router = useRouter();
  const formHook = useForm<LoginForm>();

  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ログイン処理
  const onSubmit = async (data: LoginForm) => {
    setErrorMessage([]);
    setIsLoading(true);
    const request: LoginRequest = {
      username: data.username,
      password: data.password,
    };
    try {
      await postToNextApi<{ ok: boolean }>(API_ENDPOINTS.login.post, request);

      router.push('/admin/home');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // APIからエラーレスポンスが返ってきた場合
        const errorMessage = getErrorMessage(error.response.data);
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage([MESSAGES.errors.login.failed]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formHook,
    onSubmit: formHook.handleSubmit(onSubmit),
    errorMessage,
    isLoading,
  };
}

export default useLoginForm;
