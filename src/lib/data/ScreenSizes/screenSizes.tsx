import { SansSize, SerifSize } from "@artsy/palette"

type FontSize = SansSize & SerifSize

export const dimensions = (size: number) => ({
  small: {
    cityFontSize: "4" as FontSize,
    logoFontSize: "2" as FontSize,
    lineHeight: size / 14,
  },
  standard: {
    cityFontSize: "8" as FontSize,
    logoFontSize: "3" as FontSize,
    lineHeight: size / 12,
  },
  large: {
    cityFontSize: "8" as FontSize,
    logoFontSize: "3" as FontSize,
    lineHeight: size / 11,
  },
})

export const screen = (size: number) => {
  if (size < 667) {
    return "small"
  }
  if (size > 568 && size <= 812) {
    return "standard"
  }
  return "large"
}

/**
 * The following components have slightly different sizing dimensions based on the iPhone model
 * This file passes in the correct values based on the screen size
 *
 * Large:
 * iPhone XS Max/iphone XR: screenSize = 896
 *
 * Small:
 * iphone SE/iphone 5s: screenSize = 568
 *
 * Standard:
 * iPhone X/iphone XS: screenSize = 812
 * iPhone 6/iPhone 6 Plus/iPhone 6s/iPhone 6s Plus/iPhone 7/iphone 8/iphone 8 Plus: screenSize = 667
 *
 */
