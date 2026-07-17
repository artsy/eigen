export function createEmptyColumns<T>(columnCount: number): T[][] {
  return Array.from({ length: columnCount }, () => [])
}

/**
 * Deals newItems into columns one at a time, starting at
 * targets[startOffset % targets.length]. Pass targetColumnIndexes to
 * restrict distribution to a subset (e.g. only columns actually near the
 * viewport) rather than diluting every fetch across columns nobody's
 * looking at yet; omit it to target every column.
 *
 * startOffset matters whenever a single call's newItems is smaller than
 * targets.length (e.g. a 5-artwork page spread across 8 columns): without
 * it, every call starts back at targets[0], so columns at an index beyond
 * the typical page size never receive anything from any call, ever. Pass a
 * value that advances by newItems.length between calls (e.g. a ref the
 * caller increments) so which columns get the "short end" rotates instead
 * of always landing on the same ones.
 */
export function distributeRoundRobin<T>(
  columns: T[][],
  newItems: T[],
  targetColumnIndexes?: number[],
  startOffset = 0
): T[][] {
  if (newItems.length === 0) {
    return columns
  }

  const targets = targetColumnIndexes ?? columns.map((_, index) => index)

  if (targets.length === 0) {
    return columns
  }

  const nextColumns = columns.map((column) => [...column])

  newItems.forEach((item, index) => {
    const columnIndex = targets[(startOffset + index) % targets.length]
    nextColumns[columnIndex].push(item)
  })

  return nextColumns
}
