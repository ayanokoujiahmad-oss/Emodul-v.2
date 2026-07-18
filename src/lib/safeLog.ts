// ============================================================
// SiberCerdas – Safe Logger
// ============================================================

type LogLevel = 'info' | 'warn' | 'error';

/**
 * Safely log messages. Never stringifies raw Firebase error objects – always
 * extracts .message / .code to avoid "[object Object]" or circular-ref issues.
 */
export function safeLog(level: LogLevel, message: string, err?: unknown): void {
  let detail = '';

  if (err !== undefined && err !== null) {
    if (err instanceof Error) {
      detail = err.message;
    } else if (typeof err === 'string') {
      detail = err;
    } else if (typeof err === 'object' && 'message' in (err as Record<string, unknown>)) {
      detail = String((err as Record<string, unknown>).message);
    } else {
      detail = '[non-serialisable error]';
    }
  }

  const fullMessage = detail ? `${message}: ${detail}` : message;

  switch (level) {
    case 'info':
      console.info(`[SiberCerdas] ${fullMessage}`);
      break;
    case 'warn':
      console.warn(`[SiberCerdas] ${fullMessage}`);
      break;
    case 'error':
      console.error(`[SiberCerdas] ${fullMessage}`);
      break;
  }
}
