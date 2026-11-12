import { PixelRatio } from "react-native"

/** Neighbouring cards are shrunk and dimmed; both ease in as a card moves towards the center. */
export const SIDE_CARD_SCALE = 0.82
export const SIDE_CARD_DIM_OPACITY = 0.25

const CARD_WIDTH_RATIO = 268 / 370

/** Visible gap between the centered card and its shrunk neighbours: `space(1)` */
const VISIBLE_CARD_GAP = 10

export const getCityGuideCardWidth = (screenWidth: number) =>
  PixelRatio.roundToNearestPixel(screenWidth * CARD_WIDTH_RATIO)

/**
 * Distance between two cards' centers, which is also the snap interval. Half the centered card,
 * plus half a shrunk neighbour, plus the gap, so the gap you see is exactly `VISIBLE_CARD_GAP`.
 * That's less than a card's width: the list items overlap slightly, which never shows since a
 * neighbour is always shrunk.
 */
export const getCityGuideItemWidth = (screenWidth: number) => {
  const cardWidth = getCityGuideCardWidth(screenWidth)

  return PixelRatio.roundToNearestPixel((cardWidth * (1 + SIDE_CARD_SCALE)) / 2 + VISIBLE_CARD_GAP)
}

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
