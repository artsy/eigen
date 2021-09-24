import { useTheme } from "palette"
import { isThemeV3 } from "palette/Theme"
import { TextProps } from "."

export const useFontFamilyFor = ({ italic, weight }: { italic: TextProps["italic"]; weight: TextProps["weight"] }) => {
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
