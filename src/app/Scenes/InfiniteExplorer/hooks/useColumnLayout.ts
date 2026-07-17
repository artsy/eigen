import { useScreenDimensions } from "@artsy/palette-mobile"

// The viewport shows this many columns at rest; panning/zooming toward
// either edge can reveal up to EXTRA_COLUMNS_PER_SIDE more on that side.
// This is a bounded extension (not true infinite horizontal loading, which
// stays out of scope) — the canvas always has exactly TOTAL_COLUMN_COUNT
// column slots, most of them just start out empty.
export const VISIBLE_COLUMN_COUNT = 4
export const EXTRA_COLUMNS_PER_SIDE = 2
export const TOTAL_COLUMN_COUNT = VISIBLE_COLUMN_COUNT + EXTRA_COLUMNS_PER_SIDE * 2

export const useColumnWidth = () => {
  const { width } = useScreenDimensions()

  return width / VISIBLE_COLUMN_COUNT
}

// Caps each tile's height so at least this many fit in the viewport at rest
// without needing to pan down to see a full one — the vertical equivalent of
// VISIBLE_COLUMN_COUNT. Unlike columns (fixed width, so "4 across" is exact),
// artwork aspect ratios vary, so this is a per-tile maximum rather than a
// guarantee of exactly 4; most tiles end up shorter than the cap, so more
// than 4 rows are typically visible, but none exceed 1/4 of the screen.
export const VISIBLE_ROW_COUNT = 4

export const useMaxTileHeight = () => {
  const { height } = useScreenDimensions()

  return height / VISIBLE_ROW_COUNT
}
