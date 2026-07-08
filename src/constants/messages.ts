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
  posts: {
    empty: '記事がありません',
    emptySearch: (keyword: string) =>
      `「${keyword}」に一致する記事はありません`,
  },
  draft: {
    restore: {
      title: '下書きを復元しますか？',
      description: '前回保存した未送信の下書きがあります。',
      restore: '復元',
      discard: '破棄',
    },
  },
} as const;
