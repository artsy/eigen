import { formatLargeNumber } from "./formatLargeNumber"

export function formatText(number: number, label: string, pluralLabel?: string) {
  const pluralized = pluralLabel || `${label}s`
  if (number === 1) {
    return `1 ${label}`
  } else {
    const formattedNumber = formatLargeNumber(number, 1)
    return `${formattedNumber} ${pluralized}`
  }
}
