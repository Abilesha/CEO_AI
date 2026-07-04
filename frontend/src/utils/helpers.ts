/**
 * helpers.ts
 * ----------
 * General-purpose utility functions for the CEO AI frontend.
 */

/* ---- String Utilities ---- */

/** Capitalise the first letter of a string */
export function capitalise(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Convert a snake_case / kebab-case string to Title Case */
export function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => capitalise(word))
    .join(' ')
}

/** Truncate a string to a max length, appending ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength - 3)}...`
}

/** Generate a random alphanumeric ID */
export function generateId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length)
}

/* ---- Date & Time Utilities ---- */

/** Format an ISO date string to a human-readable date */
export function formatDate(
  isoString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
): string {
  try {
    return new Intl.DateTimeFormat('en-US', options).format(new Date(isoString))
  } catch {
    return isoString
  }
}

/** Format an ISO date string to relative time (e.g. "3 hours ago") */
export function timeAgo(isoString: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]

  for (const [interval, label] of intervals) {
    const count = Math.floor(seconds / interval)
    if (count >= 1) return `${count} ${label}${count !== 1 ? 's' : ''} ago`
  }

  return 'just now'
}

/* ---- Number Utilities ---- */

/** Format a number as compact notation (e.g. 1500 → "1.5K") */
export function formatCompact(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num)
}

/** Format a number as currency */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/* ---- Object Utilities ---- */

/** Pick specific keys from an object */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      if (key in obj) acc[key] = obj[key]
      return acc
    },
    {} as Pick<T, K>,
  )
}

/** Deep-clone a JSON-serialisable object */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/* ---- Async Utilities ---- */

/** Sleep for a given number of milliseconds */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/* ---- DOM Utilities ---- */

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** Check if the app is running in a browser (vs. SSR) */
export const isBrowser = typeof window !== 'undefined'
