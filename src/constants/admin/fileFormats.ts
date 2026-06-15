/**
 * ファイル形式の定数定義
 * 管理画面で使用するファイルアップロードの許可形式を管理
 */

/**
 * サムネイル画像で許可するファイル形式
 * HTMLのaccept属性で使用する形式を指定
 */
export const THUMBNAIL_ACCEPT_FORMATS = '.jpeg,.png,.jpg' as const;

/**
 * サムネイル画像の最大ファイルサイズ（バイト単位）
 * 5MB = 5 * 1024 * 1024 バイト
 */
export const THUMBNAIL_MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * 画像挿入で許可するファイル形式
 * HTMLのaccept属性で使用する形式を指定
 */
export const IMAGE_ACCEPT_FORMATS = '.jpeg,.png,.jpg' as const;

/**
 * 投稿の最大文字数
 * 100000文字
 */
export const POST_MAX_CHARACTERS = 100000;
