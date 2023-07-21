import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  format,
  formatDistance,
  formatRelative,
} from 'date-fns'

export * from './authToken'

export function parseDate(date: Date): string {
  if (date === null) return ''

  const now = new Date()

  if (differenceInDays(now, date) <= 7) {
    let parsedDate = formatRelative(date, now).replace(/^\w/, (v) => v.toUpperCase())
    if (differenceInHours(now, date) <= 6) {
      const relString = formatDistance(date, now, { addSuffix: true }).replace(/^\w/, (v) =>
        v.toUpperCase(),
      )
      parsedDate += ` (${relString})`
    }

    return parsedDate
  } else if (differenceInMonths(now, date) <= 12) return format(date, 'MMM do, yyyy')
  else return format(date, 'dd-MM-yyyy')
}

export async function delay(timeout: number, callback?: () => void | Promise<void>): Promise<void> {
  return new Promise((res) =>
    setTimeout(async () => {
      if (callback) await callback()
      res()
    }, timeout),
  )
}
