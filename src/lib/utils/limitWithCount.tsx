/**
 * Helper function to limit array of strings for shorter displays
 * @param initial array of strings to chech for the limit
 * @param limit number of elements to keep
 *
 * @example
   ```tsx
   it("returns array of limit number of elements and count of the rest", () => {
    const initial = ["let", "there", "be", "light"]
    const limit = 2
    const limited = limitWithCount(initial, limit)
    expect(limited).toEqual(["let", "there", "+2 more"]) })
   ```
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
