/**
 * Helper function to limit array of strings for shorter displays
 * @param list array of strings to chech for the limit
 * @param limit number of elements to keep
 */

export const limitWithCount = (list: string[] | null, limit: number) => {
  if (!list || list.length < 1) {
    return []
  }
  if (!limit || list.length <= limit) {
    return list
  }
  const remainCount = list.length - limit
  const limited = list.slice(0, limit)
  limited.push(`+${remainCount} more`)
  return limited
}
