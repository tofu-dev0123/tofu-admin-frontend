export type MeResponse = {
  user_id: number;
  username: string;
  account_name: string;
};

// アカウント名変更
export type UpdateAccountNameRequest = {
  account_name: string;
};

export type UpdateAccountNameResponse = {
  message: string;
  user_id: number;
  account_name: string;
};

// パスワード変更
export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};

export type ChangePasswordResponse = {
  message: string;
};

// メールアドレス変更
export type ChangeEmailRequest = {
  current_email: string;
  new_email: string;
  password: string;
};

export type ChangeEmailResponse = {
  message: string;
  user_id: number;
  username: string;
};
