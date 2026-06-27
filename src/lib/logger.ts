type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isProduction = process.env.NODE_ENV === 'production';

// 本番では debug / info を抑制し、warn / error のみ出力する。
// 外部送信（Sentry 等）が必要になった場合はこの output 内で拡張する。
const enabled: Record<LogLevel, boolean> = {
  debug: !isProduction,
  info: !isProduction,
  warn: true,
  error: true,
};

function output(level: LogLevel, ...args: unknown[]) {
  if (!enabled[level]) return;
  console[level](...args);
}

/**
 * アプリ共通ロガー。console を直接呼ばずに常にこれを使う。
 */
export const logger = {
  debug: (...args: unknown[]) => output('debug', ...args),
  info: (...args: unknown[]) => output('info', ...args),
  warn: (...args: unknown[]) => output('warn', ...args),
  error: (...args: unknown[]) => output('error', ...args),
};
