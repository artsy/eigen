export const CITY_GUIDE_CARD_WIDTH = 248
export const CITY_GUIDE_CARD_HEIGHT = 186
const CARD_GAP = 12

/** Each item is a card plus its gap, so snapping to this interval centers one card at a time. */
export const CITY_GUIDE_ITEM_WIDTH = CITY_GUIDE_CARD_WIDTH + CARD_GAP

/** Neighbouring cards are shrunk and dimmed; both ease in as a card moves towards the center. */
export const SIDE_CARD_SCALE = 0.86
export const SIDE_CARD_DIM_OPACITY = 0.25

/** Looping a single card makes no sense; from two on, the rail wraps around. */
const MIN_CARDS_TO_LOOP = 2

/**
 * The "infinite" rail is the cards repeated this many times, starting in the middle copy. The list
 * is virtualized, so only the handful of items around the viewport are ever mounted, and reaching
 * either end would take ~100 swipes per card.
 */
const LOOP_COPIES = 200

export const canLoop = (count: number) => count >= MIN_CARDS_TO_LOOP

/** Number of items in the (virtual) list */
export const getLoopedLength = (count: number) => (canLoop(count) ? count * LOOP_COPIES : count)

/** Index of the first card in the middle copy, so there's room to swipe either way */
export const getInitialIndex = (count: number) => (canLoop(count) ? count * (LOOP_COPIES / 2) : 0)

/**
 * How many items `index` is away from the scroll `position` (both in item units). When looping,
 * a card's repeats count too, so card 0 is one item away from position 5 in a 6-card rail.
 */
export const distanceFromPosition = (
  position: number,
  index: number,
  count: number,
  loop: boolean
) => {
  "worklet"

  if (!loop) {
    return Math.abs(position - index)
  }

  const offset = (((position - index) % count) + count) % count

  return Math.min(offset, count - offset)
}
