import { determineFontSizes } from "./determineFontSizes"

import { themeProps } from "../../Theme"

describe("determineFontSizes", () => {
  it("returns a single fontSize and lineHeight if string is passed in", () => {
    const result = determineFontSizes("sans", "2")

    expect(result).toEqual({
      fontSize: `${themeProps.typeSizes.sans[2].fontSize}`,
      lineHeight: `${themeProps.typeSizes.sans[2].lineHeight}`,
    })
  })

  it("returns multiple fontSizes and lineHeights if array is passed in", () => {
    const result = determineFontSizes("sans", ["2", "4"])

    expect(result).toEqual({
      fontSize: [
        `${themeProps.typeSizes.sans[2].fontSize}`,
        `${themeProps.typeSizes.sans[4].fontSize}`,
      ],
      lineHeight: [
        `${themeProps.typeSizes.sans[2].lineHeight}`,
        `${themeProps.typeSizes.sans[4].lineHeight}`,
      ],
    })
  })
})
