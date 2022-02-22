export function formatLargeNumber(number: number, decimalPlaces: number = 0) {
  if (number < 1000) {
    return number.toString()
  } else if (number < 1000000) {
    return `${(number / 1000).toFixed(decimalPlaces)}k`
  } else if (number < 1000000000) {
    return `${(number / 1000000).toFixed(decimalPlaces)}M`
  } else {
    return `${(number / 1000000000).toFixed(decimalPlaces)}B`
  }
}
