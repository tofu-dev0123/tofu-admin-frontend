/**
 * 汎用バリデーション関数
 * 値とバリデーションルールタイプを受け取り、エラーメッセージを返します
 */

/**
 * バリデーションルールタイプ
 */
export type ValidationRuleType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'email'
  | 'url'
  | 'pattern'
  | 'number'
  | 'min'
  | 'max'
  | 'custom'
  | 'maxFileSize';

/**
 * バリデーションオプションの基本型
 */
interface BaseValidationOptions {
  message?: string;
}

/**
 * 最小/最大文字数用のオプション
 */
interface LengthValidationOptions extends BaseValidationOptions {
  value: number;
}

/**
 * 数値の最小/最大値用のオプション
 */
interface NumberValidationOptions extends BaseValidationOptions {
  value: number;
}

/**
 * 正規表現パターン用のオプション
 */
interface PatternValidationOptions extends BaseValidationOptions {
  pattern: RegExp;
}

/**
 * カスタムバリデーション用のオプション
 */
interface CustomValidationOptions extends BaseValidationOptions {
  validator: (value: unknown) => boolean;
}

/**
 * ファイルサイズ用のオプション
 */
interface FileSizeValidationOptions extends BaseValidationOptions {
  maxSize: number; // バイト単位で指定（例: 5 * 1024 * 1024 = 5MB）
}

/**
 * バリデーションオプションの統合型
 */
export type ValidationOptions =
  | BaseValidationOptions
  | LengthValidationOptions
  | NumberValidationOptions
  | PatternValidationOptions
  | CustomValidationOptions
  | FileSizeValidationOptions;

/**
 * 必須チェック
 */
function validateRequired(
  value: unknown,
  options?: BaseValidationOptions
): string | null {
  if (value === null || value === undefined || value === '') {
    return options?.message || '入力は必須です';
  }
  // 文字列の場合、空白文字のみも無効とする
  if (typeof value === 'string' && value.trim() === '') {
    return options?.message || '入力は必須です';
  }
  return null;
}

/**
 * 最小文字数チェック
 */
function validateMinLength(
  value: unknown,
  options?: LengthValidationOptions
): string | null {
  if (!options || typeof options.value !== 'number') {
    throw new Error('minLengthバリデーションにはvalueオプションが必要です');
  }

  if (value === null || value === undefined || value === '') {
    return null; // 必須チェックは別途行う
  }

  const strValue = String(value);
  if (strValue.length < options.value) {
    return options.message || `${options.value}文字以上で入力してください`;
  }
  return null;
}

/**
 * 最大文字数チェック
 */
function validateMaxLength(
  value: unknown,
  options?: LengthValidationOptions
): string | null {
  if (!options || typeof options.value !== 'number') {
    throw new Error('maxLengthバリデーションにはvalueオプションが必要です');
  }

  if (value === null || value === undefined || value === '') {
    return null; // 必須チェックは別途行う
  }

  const strValue = String(value);
  if (strValue.length > options.value) {
    return options.message || `${options.value}文字以内で入力してください`;
  }
  return null;
}

/**
 * メールアドレス形式チェック
 */
function validateEmail(
  value: unknown,
  options?: BaseValidationOptions
): string | null {
  if (value === null || value === undefined || value === '') {
    return null; // 必須チェックは別途行う
  }

  const strValue = String(value);
  // 基本的なメールアドレス形式の正規表現
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(strValue)) {
    return options?.message || '有効なメールアドレスを入力してください';
  }
  return null;
}

/**
 * URL形式チェック
 */
function validateUrl(
  value: unknown,
  options?: BaseValidationOptions
): string | null {
  if (value === null || value === undefined || value === '') {
    return null; // 必須チェックは別途行う
  }

  const strValue = String(value);
  try {
    new URL(strValue);
    return null;
  } catch {
    return options?.message || '有効なURLを入力してください';
  }
}

/**
 * 正規表現パターンチェック
 */
function validatePattern(
  value: unknown,
  options?: PatternValidationOptions
): string | null {
  if (!options || !(options.pattern instanceof RegExp)) {
    throw new Error(
      'patternバリデーションにはpatternオプション（RegExp）が必要です'
    );
  }

  if (value === null || value === undefined || value === '') {
    return null; // 必須チェックは別途行う
  }

  const strValue = String(value);
  if (!options.pattern.test(strValue)) {
    return options.message || '入力形式が正しくありません';
  }
  return null;
}

/**
 * 数値チェック
 */
function validateNumber(
  value: unknown,
  options?: BaseValidationOptions
): string | null {
  if (value === null || value === undefined || value === '') {
    return null; // 必須チェックは別途行う
  }

  if (typeof value === 'number') {
    if (isNaN(value) || !isFinite(value)) {
      return options?.message || '有効な数値を入力してください';
    }
    return null;
  }

  // 文字列の場合も数値として解釈可能かチェック
  const numValue = Number(value);
  if (isNaN(numValue) || !isFinite(numValue)) {
    return options?.message || '有効な数値を入力してください';
  }
  return null;
}

/**
 * 最小値チェック（数値）
 */
function validateMin(
  value: unknown,
  options?: NumberValidationOptions
): string | null {
  if (!options || typeof options.value !== 'number') {
    throw new Error('minバリデーションにはvalueオプションが必要です');
  }

  if (value === null || value === undefined || value === '') {
    return null; // 必須チェックは別途行う
  }

  const numValue = typeof value === 'number' ? value : Number(value);
  if (isNaN(numValue) || !isFinite(numValue)) {
    return null; // 数値チェックは別途行う
  }

  if (numValue < options.value) {
    return options.message || `${options.value}以上の値を入力してください`;
  }
  return null;
}

/**
 * 最大値チェック（数値）
 */
function validateMax(
  value: unknown,
  options?: NumberValidationOptions
): string | null {
  if (!options || typeof options.value !== 'number') {
    throw new Error('maxバリデーションにはvalueオプションが必要です');
  }

  if (value === null || value === undefined || value === '') {
    return null; // 必須チェックは別途行う
  }

  const numValue = typeof value === 'number' ? value : Number(value);
  if (isNaN(numValue) || !isFinite(numValue)) {
    return null; // 数値チェックは別途行う
  }

  if (numValue > options.value) {
    return options.message || `${options.value}以下の値を入力してください`;
  }
  return null;
}

/**
 * カスタムバリデーション
 */
function validateCustom(
  value: unknown,
  options?: CustomValidationOptions
): string | null {
  if (!options || typeof options.validator !== 'function') {
    throw new Error(
      'customバリデーションにはvalidatorオプション（関数）が必要です'
    );
  }

  const isValid = options.validator(value);
  if (!isValid) {
    return options.message || '入力値が無効です';
  }
  return null;
}

/**
 * ファイルサイズチェック
 */
function validateMaxFileSize(
  value: unknown,
  options?: FileSizeValidationOptions
): string | null {
  if (!options || typeof options.maxSize !== 'number') {
    throw new Error('maxFileSizeバリデーションにはmaxSizeオプションが必要です');
  }

  if (value === null || value === undefined) {
    return null; // 必須チェックは別途行う
  }

  // Fileオブジェクトの場合
  if (value instanceof File) {
    if (value.size > options.maxSize) {
      return (
        options.message ||
        `ファイルサイズは${(options.maxSize / (1024 * 1024)).toFixed(1)}MB以下にしてください`
      );
    }
    return null;
  }

  // 数値としてファイルサイズが渡された場合
  if (typeof value === 'number') {
    if (value > options.maxSize) {
      return (
        options.message ||
        `ファイルサイズは${(options.maxSize / (1024 * 1024)).toFixed(1)}MB以下にしてください`
      );
    }
    return null;
  }

  return options?.message || 'ファイルサイズが無効です';
}

/**
 * 汎用バリデーション関数
 * @param value - バリデーション対象の値
 * @param ruleType - バリデーションルールタイプ
 * @param options - バリデーションオプション
 * @returns エラーメッセージ（エラーの場合）またはnull（有効な場合）
 *
 * @example
 * // 必須チェック
 * validate('', 'required', { message: '必須項目です' }) // '必須項目です'
 *
 * @example
 * // 最小文字数
 * validate('abc', 'minLength', { value: 5, message: '5文字以上で入力してください' }) // '5文字以上で入力してください'
 *
 * @example
 * // メール形式
 * validate('invalid', 'email', { message: '有効なメールアドレスを入力してください' }) // '有効なメールアドレスを入力してください'
 *
 * @example
 * // 有効な場合
 * validate('valid@example.com', 'email') // null
 */
export function validate(
  value: unknown,
  ruleType: ValidationRuleType,
  options?: ValidationOptions
): string | null {
  switch (ruleType) {
    case 'required':
      return validateRequired(value, options as BaseValidationOptions);
    case 'minLength':
      return validateMinLength(value, options as LengthValidationOptions);
    case 'maxLength':
      return validateMaxLength(value, options as LengthValidationOptions);
    case 'email':
      return validateEmail(value, options as BaseValidationOptions);
    case 'url':
      return validateUrl(value, options as BaseValidationOptions);
    case 'pattern':
      return validatePattern(value, options as PatternValidationOptions);
    case 'number':
      return validateNumber(value, options as BaseValidationOptions);
    case 'min':
      return validateMin(value, options as NumberValidationOptions);
    case 'max':
      return validateMax(value, options as NumberValidationOptions);
    case 'custom':
      return validateCustom(value, options as CustomValidationOptions);
    case 'maxFileSize':
      return validateMaxFileSize(value, options as FileSizeValidationOptions);
    default:
      // 型安全性のため、ここに到達することはないが、実行時の安全性のため
      const exhaustiveCheck: never = ruleType;
      throw new Error(`未知のバリデーションルールタイプ: ${exhaustiveCheck}`);
  }
}
