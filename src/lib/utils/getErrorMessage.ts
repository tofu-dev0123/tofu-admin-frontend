import { ErrorResponse } from '@/types/api/error';

export const getErrorMessage = (error: ErrorResponse) => {
  if (error.message) {
    return [error.message];
  } else if (error.details) {
    return error.details.map((detail) => detail.message);
  }

  return [];
};
