export function isQuerySafe(sql: string): { safe: boolean; reason?: string } {
  const trimmed = sql.trim();
  // Whitelist: must start with allowed clause (lazy: defensive, not over-engineered)
  const allowedStart = /^(SELECT|WITH|EXPLAIN)\b/i;
  if (!allowedStart.test(trimmed)) {
    return { safe: false, reason: 'Query must begin with SELECT, WITH, or EXPLAIN.' };
  }
  const normalized = sql.toUpperCase();
  const blocked = [
    'ATTACH', 'DETACH', 'LOAD', 'INSTALL', 'PRAGMA',
    'COPY ', 'EXPORT ', 'READ_CSV', 'READ_PARQUET', 'READ_JSON'
  ];
  for (const keyword of blocked) {
    if (normalized.includes(keyword)) {
      return { safe: false, reason: `Execution of ${keyword} is not permitted.` };
    }
  }
  return { safe: true };
}

export function safeStorageGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (Array.isArray(fallback)) return (Array.isArray(parsed) ? parsed : fallback) as T;
    if (typeof fallback === 'number') {
      const value = typeof parsed === 'number' ? parsed : typeof parsed === 'string' && parsed.trim() ? Number(parsed) : NaN;
      return (Number.isFinite(value) && value >= 0 ? value : fallback) as T;
    }
    if (fallback !== null && typeof parsed !== typeof fallback) return fallback;
    return parsed as T;
  } catch (e) {
    console.error(`Error parsing localStorage key ${key}`, e);
    return fallback;
  }
}

export function safeStorageSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error setting localStorage key ${key}`, e);
  }
}
