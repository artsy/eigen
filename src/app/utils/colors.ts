import { THEMES } from "@artsy/palette-mobile"

// Palette-mobile only ships theme-relative mono0-mono100; use these when a color must
// stay black/white regardless of the device's Dark Mode setting (never as a default).
export const ALWAYS_BLACK = THEMES.v3dark.colors.mono0
export const ALWAYS_WHITE = "white"
