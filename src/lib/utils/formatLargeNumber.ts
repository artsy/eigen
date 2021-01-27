export function formatLargeNumber(number: number, decimalPlaces: number = 0) {
  if (number < 1_000) {
    return number.toString()
  } else if (number < 1_000_000) {
    return `${(number / 1_000).toFixed(decimalPlaces)}k`
  } else if (number < 1_000_000_000) {
    return `${(number / 1_000_000).toFixed(decimalPlaces)}m`
  } else {
    return `${(number / 1_000_000_000).toFixed(decimalPlaces)}t`
  }
}
