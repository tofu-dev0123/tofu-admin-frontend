export type ErrorDetail = {
  message: string;
  value: string;
};

export type ErrorResponse = {
  message: string;
  error: string;
  details: ErrorDetail[];
};
