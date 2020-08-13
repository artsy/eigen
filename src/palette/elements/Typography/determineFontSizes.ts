import { themeProps } from "../../Theme"
import { FontFamily } from "./Typography"

/**
 * Determines which font sizes/line heights to use for typography.
 */
export function determineFontSizes(
  fontType: keyof FontFamily,
  size: string | string[]
) {
  if (!Array.isArray(size)) {
    const match = themeProps.typeSizes[fontType][size]
    return {
      fontSize: `${match.fontSize}`,
      lineHeight: `${match.lineHeight}`,
    }
  }

  return size
    .map(s => themeProps.typeSizes[fontType][s])
    .reduce(
      (accumulator, current) => {
        return {
          fontSize: [...accumulator.fontSize, `${current.fontSize}`],
          lineHeight: [...accumulator.lineHeight, `${current.lineHeight}`],
        }
      },
      { fontSize: [], lineHeight: [] }
    )
}
