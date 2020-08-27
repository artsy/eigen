/**
 * A map of the font families and their settings
 */
export const fontFamily = {
  sans: {
    regular: {
      normal: "Unica77LL-Regular",
      italic: "Unica77LL-Italic",
    },
    medium: {
      normal: "Unica77LL-Medium",
      italic: "Unica77LL-MediumItalic",
    },
    semibold: {
      normal: null,
      italic: null,
    },
  },
  serif: {
    regular: {
      normal: "ReactNativeAGaramondPro-Regular",
      italic: "ReactNativeAGaramondPro-Italic",
    },
    medium: {
      normal: null,
      italic: null,
    },
    semibold: {
      normal: "ReactNativeAGaramondPro-Semibold",
      italic: null,
    },
  },
}

export type FontFamily = typeof fontFamily
