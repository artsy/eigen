const BREAKPOINT = 700

export function calculateLayoutValues(width: number, sectionMargin: number) {
  const isPad = width > BREAKPOINT

  const sectionCount = isPad ? 3 : 2
  const sectionMargins = sectionMargin ?? 0 * (sectionCount - 1)
  const artworkPadding = 20
  const sectionDimension = (width - sectionMargins * sectionCount - artworkPadding) / sectionCount

  return {
    sectionCount,
    sectionDimension,
  }
}
