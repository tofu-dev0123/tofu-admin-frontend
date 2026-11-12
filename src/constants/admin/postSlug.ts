/**
 * 記事 slug の定数（バックエンドの検証仕様に合わせる）
 */

/** slug の形式（小文字英数字をハイフンで区切る） */
export const POST_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** slug の最大文字数 */
export const POST_SLUG_MAX_LENGTH = 50;
