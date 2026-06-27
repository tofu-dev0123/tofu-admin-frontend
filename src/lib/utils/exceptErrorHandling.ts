import axios from 'axios';
import { getErrorMessage } from './getErrorMessage';
import { MESSAGES } from '@/constants/messages';
import { logger } from '@/lib/logger';

export const exceptErrorHandling = (
  error: unknown,
  showError: (message: string[]) => void
) => {
  if (axios.isAxiosError(error) && error.response) {
    // API エラーの詳細をログに記録（ユーザーには toast で通知）
    logger.error(
      `[api] ${error.config?.method?.toUpperCase()} ${error.config?.url} が ${error.response.status} を返却`,
      error.response.data
    );
    const errorMessage = getErrorMessage(error.response.data);
    showError(errorMessage);
  } else {
    logger.error('[api] リクエストに失敗', error);
    showError([MESSAGES.errors.common.failed]);
  }
};
