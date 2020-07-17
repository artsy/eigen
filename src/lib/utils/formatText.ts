export function formatText(number: number, label: string) {
  if (number === 1) {
    return `1 ${label}`
  } else if (number < 1000) {
    return `${number} ${label}s`
  } else if (number < 1000000) {
    return `${(number / 1000).toFixed(1)}k ${label}s`
  } else {
    return `${(number / 1000000).toFixed(1)}m ${label}s`
  }
}
