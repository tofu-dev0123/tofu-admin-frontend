import { MESSAGES } from '@/constants/messages';
import {
  POST_SLUG_MAX_LENGTH,
  POST_SLUG_PATTERN,
} from '@/constants/admin/postSlug';

/**
 * slug のバリデーション（未入力はバックエンドが自動生成するため許可する）
 * @param slug - 入力された slug
 * @returns エラーメッセージの配列（エラーがない場合は空配列）
 */
export function validateSlug(slug: string): string[] {
  if (slug === '') return [];

  if (slug.length > POST_SLUG_MAX_LENGTH) {
    return [MESSAGES.validation.slug.maxLength];
  }
  if (!POST_SLUG_PATTERN.test(slug)) {
    return [MESSAGES.validation.slug.format];
  }
  return [];
}
