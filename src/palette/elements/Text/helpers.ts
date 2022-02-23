import { NoUndefined } from "app/utils/types"
import { useTheme } from "palette"
import { isThemeV3 } from "palette/Theme"
import { TextStyle } from "react-native"
import { TextProps } from "."

export const useFontFamilyFor = ({
  italic,
  weight,
}: {
  italic: TextProps["italic"]
  weight: TextProps["weight"]
}) => {
  const { theme } = useTheme()
  if (!isThemeV3(theme)) {
    return "no-font"
  }
  const { fonts } = theme

  if (italic && weight === "medium") {
    return fonts.sans.mediumItalic
  }

  if (italic) {
    return fonts.sans.italic
  }

  if (weight === "medium") {
    return fonts.sans.medium
  }

  return fonts.sans.regular
}

/**
 * Use this function within Palette and other "atom" components like `Button`, `Pill`, etc.
 * This function returns a `TextStyle` that has a `fontSize` and `lineHeight` of the same number.
 * This is to make a `Text` behave correctly when it needs to be combined with others to make a UI component.
 * Don't use this function when some actual text needs to be displayed. Only use it when text needs to be part of a UI component.
 */
export const useTextStyleForPalette = (variant: NoUndefined<TextProps["variant"]>): TextStyle => {
  const { theme } = useTheme()

  const fontSizeAndLineHeight = theme.textTreatments[variant].fontSize

  return {
    fontSize: fontSizeAndLineHeight,
    lineHeight: fontSizeAndLineHeight,
  }
}
