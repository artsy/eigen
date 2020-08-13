import { FontFamily } from "./"

const sansFallback = "'Helvetica Neue', Helvetica, Arial, sans-serif"

/**
 * A map of the font families and their settings
 */
export const fontFamily: FontFamily = {
  sans: {
    regular: `Unica77LLWebRegular, ${sansFallback}`,
    italic: {
      fontFamily: `Unica77LLWebItalic, ${sansFallback}`,
      fontStyle: "italic",
    },
    medium: {
      fontFamily: `Unica77LLWebMedium, ${sansFallback}`,
      fontWeight: 500,
    },
    mediumItalic: {
      fontFamily: `Unica77LLWebMediumItalic, ${sansFallback}`,
      fontWeight: 500,
      fontStyle: "italic",
    },
  },
  serif: {
    regular:
      "'Adobe Garamond W08', 'adobe-garamond-pro', 'AGaramondPro-Regular', 'Times New Roman', Times, serif",
    italic: {
      fontFamily:
        "'Adobe Garamond W08', 'adobe-garamond-pro', 'AGaramondPro-Regular', 'Times New Roman', Times, serif",
      fontStyle: "italic",
    },
    semibold: {
      fontFamily:
        "'Adobe Garamond W08', 'adobe-garamond-pro', 'AGaramondPro-Regular', 'Times New Roman', Times, serif",
      fontWeight: 600,
    },
  },
  display: {
    regular:
      "'ITC Avant Garde Gothic W04','AvantGardeGothicITCW01D 731075', AvantGardeGothicITCW01Dm, Helvetica, sans-serif",
  },
}
