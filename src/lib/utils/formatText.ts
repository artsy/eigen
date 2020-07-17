export function formatText(number: number, label: string, pluralLabel?: string) {
  const pluralized = pluralLabel || `${label}s`
  if (number === 1) {
    return `1 ${label}`
  } else if (number < 1000) {
    return `${number} ${pluralized}`
  } else if (number < 1000000) {
    return `${(number / 1000).toFixed(1)}k ${pluralized}`
  } else {
    return `${(number / 1000000).toFixed(1)}m ${pluralized}`
  }
}
