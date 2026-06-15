import axios from 'axios';
import { getErrorMessage } from './getErrorMessage';
import { MESSAGES } from '@/constants/messages';

export const exceptErrorHandling = (
  error: unknown,
  showError: (message: string[]) => void
) => {
  if (axios.isAxiosError(error) && error.response) {
    const errorMessage = getErrorMessage(error.response.data);
    showError(errorMessage);
  } else {
    showError([MESSAGES.errors.common.failed]);
  }
};
