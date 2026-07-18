// ──────────────────────────────────────────────
// SiberCerdas – Safe Logger
// ──────────────────────────────────────────────

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Safely stringify any value, gracefully handling:
 * - Circular references
 * - BigInt values
 * - Undefined / Symbol values
 * - Non-serialisable Firebase internals
 */
export function safeStringify(obj: unknown, indent = 2): string {
  const seen = new WeakSet();

  const replacer = (_key: string, value: unknown): unknown => {
    // Handle BigInt
    if (typeof value === 'bigint') {
      return value.toString() + 'n';
    }

    // Handle functions
    if (typeof value === 'function') {
      return `[Function: ${value.name || 'anonymous'}]`;
    }

    // Handle symbols
    if (typeof value === 'symbol') {
      return value.toString();
    }

    // Handle circular references in objects
    if (value !== null && typeof value === 'object') {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);

      // Handle Error objects specially – they don't serialise by default
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack,
          ...(Object.keys(value).length > 0 ? { ...value } : {}),
        };
      }

      // Handle Date objects
      if (value instanceof Date) {
        return value.toISOString();
      }
    }

    return value;
  };

  try {
    return JSON.stringify(obj, replacer, indent);
  } catch {
    return String(obj);
  }
}

/**
 * Extract useful information from a Firebase (or any) error object.
 * Never stringifies the raw error – always returns a clean POJO.
 */
export function extractErrorInfo(err: unknown): {
  message: string;
  code?: string;
  name?: string;
  stack?: string;
} {
  if (err === null || err === undefined) {
    return { message: 'Unknown error (null/undefined)' };
  }

  if (typeof err === 'string') {
    return { message: err };
  }

  if (err instanceof Error) {
    const info: ReturnType<typeof extractErrorInfo> = {
      message: err.message,
      name: err.name,
      stack: err.stack,
    };

    // Firebase errors have a `.code` property
    if ('code' in err && typeof (err as { code: unknown }).code === 'string') {
      info.code = (err as { code: string }).code;
    }

    return info;
  }

  // Fallback for non-Error thrown values
  if (typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    return {
      message:
        typeof obj['message'] === 'string'
          ? obj['message']
          : safeStringify(obj),
      code: typeof obj['code'] === 'string' ? obj['code'] : undefined,
      name: typeof obj['name'] === 'string' ? obj['name'] : undefined,
    };
  }

  return { message: String(err) };
}

const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/** Minimum log level – change this during development / production */
let minLevel: LogLevel = 'debug';

export function setMinLogLevel(level: LogLevel): void {
  minLevel = level;
}

/**
 * Safe logging function that will never throw, even if called with
 * non-serialisable objects (Firebase snapshots, circular refs, etc.).
 *
 * @param level  - 'debug' | 'info' | 'warn' | 'error'
 * @param message - Human-readable message
 * @param data   - Optional data to attach
 */
export function safeLog(
  level: LogLevel,
  message: string,
  data?: unknown,
): void {
  if (levelPriority[level] < levelPriority[minLevel]) {
    return;
  }

  const timestamp = new Date().toISOString();
  const prefix = `[SiberCerdas ${timestamp}] [${level.toUpperCase()}]`;

  try {
    const consoleFn =
      level === 'error'
        ? console.error
        : level === 'warn'
          ? console.warn
          : level === 'debug'
            ? console.debug
            : console.log;

    if (data !== undefined) {
      // Try to display the data nicely; fall back to safeStringify
      if (typeof data === 'object' && data !== null) {
        try {
          consoleFn(prefix, message, data);
        } catch {
          consoleFn(prefix, message, safeStringify(data));
        }
      } else {
        consoleFn(prefix, message, data);
      }
    } else {
      consoleFn(prefix, message);
    }
  } catch {
    // Absolute last resort – console.log a flat string
    try {
      console.log(`${prefix} ${message} [data logging failed]`);
    } catch {
      // If even this fails, silently swallow – logging should never crash the app.
    }
  }
}
