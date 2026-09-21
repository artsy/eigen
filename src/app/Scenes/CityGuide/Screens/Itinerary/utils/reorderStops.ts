/**
 * Pure reorder math for hold-and-drag within an itinerary section. Kept free of
 * gesture-handler/reanimated so it can be unit tested directly, and marked `"worklet"` where a
 * live drag preview also needs to call it from the UI thread (Reanimated's babel plugin
 * workletizes any function with the directive, so the same export works unchanged from a plain
 * Jest test and from a `useAnimatedStyle` callback in another file).
 */

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

/**
 * Which index a row being dragged should land at, given its neighbours' measured heights (not
 * uniform — a stop's card grows with a wrapped title) and how far its centre has moved from
 * where it started. Crosses a neighbour once the drag has covered half that neighbour's own
 * span (its height plus the gap between rows), matching the felt behaviour of dragging past a
 * row rather than merely touching it.
 */
export const dropIndex = (
  heights: readonly number[],
  fromIndex: number,
  offsetY: number,
  gap = 0
): number => {
  "worklet"

  if (heights.length === 0) return 0

  const clampedFrom = Math.min(Math.max(fromIndex, 0), heights.length - 1)

  if (offsetY === 0) return clampedFrom

  let index = clampedFrom

  if (offsetY > 0) {
    let remaining = offsetY

    while (index < heights.length - 1) {
      const nextSpan = heights[index + 1] + gap

      if (remaining < nextSpan / 2) break

      remaining -= nextSpan
      index += 1
    }
  } else {
    let remaining = -offsetY

    while (index > 0) {
      const previousSpan = heights[index - 1] + gap

      if (remaining < previousSpan / 2) break

      remaining -= previousSpan
      index -= 1
    }
  }

  return index
}

/**
 * How far (in px) each row other than the dragged one should shift out of the way, so the gap
 * it leaves behind — and the gap it opens up ahead of it — both track the drag live. Only the
 * rows strictly between `fromIndex` and `toIndex` (inclusive of `toIndex`) move; everything
 * else stays put.
 */
export const siblingShifts = (
  heights: readonly number[],
  fromIndex: number,
  toIndex: number,
  gap = 0
): number[] => {
  "worklet"

  const shifts = heights.map(() => 0)

  if (fromIndex === toIndex || fromIndex < 0 || fromIndex >= heights.length) {
    return shifts
  }

  const draggedSpan = heights[fromIndex] + gap

  if (fromIndex < toIndex) {
    for (let i = fromIndex + 1; i <= toIndex; i++) {
      shifts[i] = -draggedSpan
    }
  } else {
    for (let i = toIndex; i < fromIndex; i++) {
      shifts[i] = draggedSpan
    }
  }

  return shifts
}
