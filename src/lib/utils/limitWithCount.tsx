/**
 * Helper function to limit array of strings for shorter displays
 * @param initial array of strings to chech for the limit
 * @param limit number of elements to keep
 */

export const limitWithCount = (initial: ReadonlyArray<string>, limit: number) => {
  if (!initial || initial.length < 1) {
    return []
  }
  if (!limit || initial.length <= limit) {
    return initial
  }
  const remainCount = initial.length - limit
  const limited = initial.slice(0, limit)
  limited.push(`+${remainCount} more`)
  return limited
}
