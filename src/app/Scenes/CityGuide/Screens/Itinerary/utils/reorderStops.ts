/** Moves the item at `fromIndex` to `toIndex`, shifting everything between. Out-of-range or
 *  no-op indices return a copy of the original order, unchanged. */
export const moveStop = <T>(items: readonly T[], fromIndex: number, toIndex: number): T[] => {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    fromIndex >= items.length ||
    toIndex < 0 ||
    toIndex >= items.length
  ) {
    return items.slice()
  }

  const next = items.slice()
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)

  return next
}
