export const dimensions = size => ({
  small: {
    cityFontSize: "4",
    logoFontSize: "2",
    lineHeight: size / 14,
  },
  standard: {
    cityFontSize: "8",
    logoFontSize: "3",
    lineHeight: size / 12,
  },
  large: {
    cityFontSize: "8",
    logoFontSize: "3",
    lineHeight: size / 11,
  },
})

export const screen = size => {
  if (size < 667) {
    return "small"
  }
  if (size > 568 && size <= 812) {
    return "standard"
  }
  if (size > 812) {
    return "large"
  }
}

/**
 * The following components have slightly different sizing dimensions based on the iPhone model
 * This file passes in the correct values based on the screen size
 *
 * iPhone XS Max/iphone XR: screenSize = 896
 *
 * <Serif mt={2} size="8" lineHeight={screenSize / 11}>
 * <Sans size="3" weight="medium" ml={2} mt={2}>
 *
 * iphone SE/iphone 5s: screenSize = 568
 *
 * <Serif mt={2} size="8" lineHeight={screenSize / 14}>
 * <Sans size="2" weight="medium" ml={2} mt={2}>
 *
 *  iPhone X/iphone XS: screenSize = 812
 * iPhone 6/iPhone 6 Plus/iPhone 6s/iPhone 6s Plus/iPhone 7/iphone 8/iphone 8 Plus: screenSize = 667
 *
 * <Serif mt={2} size="8" lineHeight={screenSize /12}>
 * <Sans size="3" weight="medium" ml={2} mt={2}>
 *
 */
