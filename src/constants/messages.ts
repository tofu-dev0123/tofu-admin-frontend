export const MESSAGES = {
  errors: {
    common: {
      failed: 'エラーが発生しました',
    },
    login: {
      failed: 'ログインに失敗しました',
    },
  },
  validation: {
    username: {
      required: 'ユーザー名の入力は必須です',
      maxLength: '50文字以内で入力してください',
    },
    password: {
      required: 'パスワードの入力は必須です',
      minLength: '8文字以上入力してください',
      maxLength: '20文字以内で入力してください',
    },
    thumbnail: {
      maxFileSize: 'ファイルサイズは5MB以下にしてください',
    },
  },
} as const;
