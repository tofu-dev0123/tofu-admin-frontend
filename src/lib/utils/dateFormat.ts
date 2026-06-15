/**
 * 日付文字列を日本語形式に整形するユーティリティ関数
 * タイムゾーンを明示的にJST（Asia/Tokyo）に指定し、SSR/CSRで一貫した結果を保証
 */

const TIMEZONE_JST = 'Asia/Tokyo';
const LOCALE_JA = 'ja-JP';

/**
 * タイムゾーン情報がない日時文字列をUTCとして解釈
 * バックエンドがUTCで日時を保存し、タイムゾーン情報なしで返すため
 */
const parseAsUTC = (dateString: string): Date => {
  if (dateString.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateString)) {
    return new Date(dateString);
  }
  return new Date(dateString + 'Z');
};

/**
 * Intl.DateTimeFormatを使用して日付パーツを取得
 */
const getDateParts = (
  date: Date,
  options: Intl.DateTimeFormatOptions
): Record<Intl.DateTimeFormatPartTypes, string> => {
  const formatter = new Intl.DateTimeFormat(LOCALE_JA, {
    timeZone: TIMEZONE_JST,
    ...options,
  });
  const parts = formatter.formatToParts(date);
  return parts.reduce(
    (acc, part) => {
      acc[part.type] = part.value;
      return acc;
    },
    {} as Record<Intl.DateTimeFormatPartTypes, string>
  );
};

/**
 * ISO 8601形式の日付文字列をyyyy年mm月dd日 hh時mm分形式に変換
 * @param dateString - ISO 8601形式の日付文字列（例：'2024-01-10T09:00:00Z'）
 * @returns 整形された日付文字列（例：'2024年01月10日 18時00分'）※JST
 */
export const formatDateTime = (dateString: string): string => {
  const date = parseAsUTC(dateString);

  if (isNaN(date.getTime())) {
    return '日付エラー';
  }

  const parts = getDateParts(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${parts.year}年${parts.month}月${parts.day}日 ${parts.hour}時${parts.minute}分`;
};

/**
 * ISO 8601形式の日付文字列をyyyy年mm月dd日形式に変換
 * @param dateString - ISO 8601形式の日付文字列（例：'2024-01-10T09:00:00Z'）
 * @returns 整形された日付文字列（例：'2024年01月10日'）※JST
 */
export const formatDate = (dateString: string): string => {
  const date = parseAsUTC(dateString);

  if (isNaN(date.getTime())) {
    return '日付エラー';
  }

  const parts = getDateParts(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return `${parts.year}年${parts.month}月${parts.day}日`;
};
