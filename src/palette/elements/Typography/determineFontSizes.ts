import { themeProps } from "../../Theme"
import { FontFamily } from "./Typography"

/**
 * Determines which font sizes/line heights to use for typography.
 */
export function determineFontSizes(fontType: keyof FontFamily, size: string | string[]) {
  if (!Array.isArray(size)) {
    // We use this weird `size as "2"` here to stop some type errors.
    // `themeProps.typeSizes` has keys `sans`, `serif`, `display`. Each has different keys in it.
    // For example `sans` has `0`, `1`, `2`, `3t`. `serif` `1`, `2`, `3t`.
    // Typescript can't figure out which ones exist in each, so it gets only the common ones,
    // so then `0` is giving a type error. So we picked `2` to be one the `as`, only because `2` exists in all
    // `sans`, `serif` and display`.
    // `determineFontSizes` is used in `Typography.tsx`. To reach that point, we use `Sans`, `Serif`, `Text`.
    // All these check for the right types for size, so we shouldn't get to a place where this function here
    // would return `match` as undefined.
    // TODO: fix this when we remove `Sans` and `Serif`? 🤔
    const match = themeProps.typeSizes[fontType][size as "2"]
    return {
      fontSize: `${match.fontSize}`,
      lineHeight: `${match.lineHeight}`,
    }
  }

  return size
    .map(s => themeProps.typeSizes[fontType][s as "2"]) // Check above for an explanation of `s as "2"`
    .reduce(
      (accumulator, current) => {
        return {
          fontSize: [...accumulator.fontSize, `${current.fontSize}`],
          lineHeight: [...accumulator.lineHeight, `${current.lineHeight}`],
        }
      },
      { fontSize: [] as string[], lineHeight: [] as string[] }
    )
}
