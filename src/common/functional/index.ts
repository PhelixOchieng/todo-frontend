export * from './authToken'

import { formatRelative } from 'date-fns'

export function parseTime(date: Date): string {
  return formatRelative(date, new Date())
}

export async function delay(
  timeout: number,
  callback?: () => Promise<void> | void,
): Promise<void> {
  return new Promise((res) => {
    setTimeout(async () => {
      if (callback) await callback()
      res()
    }, timeout)
  })
}
