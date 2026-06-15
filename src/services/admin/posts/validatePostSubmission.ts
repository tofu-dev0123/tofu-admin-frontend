import { validate } from '@/lib/utils/validation';
import { POST_MAX_CHARACTERS } from '@/constants/admin/fileFormats';

/**
 * 投稿送信時のバリデーション処理
 * @param title - 投稿のタイトル
 * @param tags - 投稿のタグ配列
 * @returns エラーメッセージの配列（エラーがない場合は空配列）
 */
export function validatePostSubmission(
  thumbnailUrl: string,
  title: string,
  tags: string[],
  content: string
): string[] {
  const errorMessage: string[] = [];

  const thumbnailUrlError = validate(thumbnailUrl, 'required', {
    message: 'サムネイルは必須です',
  });
  if (thumbnailUrlError) {
    errorMessage.push(thumbnailUrlError);
  }

  const contentError = validate(content, 'required', {
    message: '内容は必須です',
  });
  if (contentError) {
    errorMessage.push(contentError);
  }

  const contentLengthError = validate(content, 'maxLength', {
    value: POST_MAX_CHARACTERS,
    message: '本文が長すぎます',
  });
  if (contentLengthError) {
    errorMessage.push(contentLengthError);
  }

  const titleError = validate(title, 'required', {
    message: 'タイトルは必須です',
  });
  if (titleError) {
    errorMessage.push(titleError);
  }

  const tagsError = validate(tags[0], 'required', {
    message: 'タグは必須です',
  });
  if (tagsError) {
    errorMessage.push(tagsError);
  }

  return errorMessage;
}
