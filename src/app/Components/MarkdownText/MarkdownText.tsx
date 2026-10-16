import { Color, TextProps, useTheme } from "@artsy/palette-mobile"
import { openMarkdownLink } from "app/utils/markdown/openMarkdownLink"
import React, { useMemo } from "react"
import { ViewProps } from "react-native"
import { EnrichedMarkdownText, MarkdownStyle, Md4cFlags } from "react-native-enriched-markdown"

type TextVariant = NonNullable<TextProps["variant"]>
type TextAlign = "auto" | "left" | "right" | "center" | "justify"
type Theme = ReturnType<typeof useTheme>

export interface MarkdownTextProps extends Pick<ViewProps, "testID" | "accessibilityLabel"> {
  markdown: string
  /** Palette text variant used for paragraphs and lists. */
  variant?: TextVariant
  /** Color of plain paragraph text. */
  color?: Color
  /**
   * Color of bold, italic, headings, lists and code. Defaults to `onBackgroundHigh`, matching
   * simple-markdown where those nodes rendered a nested palette `Text` that reset the color.
   */
  emphasisColor?: Color
  /** Defaults to `mono100`, matching palette `LinkText`. */
  linkColor?: Color
  textAlign?: TextAlign
  /** Clamp the rendered markdown. Note: on Android links are not tappable while clamped. */
  numberOfLines?: number
  presentLinksModally?: boolean
}

// Images and raw HTML are not rendered by our markdown components (the simple-markdown rules
// return null for images), so strip them before handing the content to the native renderer.
const IMAGE_REGEX = /!\[[^\]]*\]\([^)]*\)/g

// - hardSoftBreaks: simple-markdown rendered single newlines as line breaks, keep that behaviour
// - latexMath: content like "$1,000 - $2,000" must not be parsed as inline math
const MD4C_FLAGS: Md4cFlags = { hardSoftBreaks: true, latexMath: false }

export const sanitizeMarkdown = (markdown: string) => markdown.replace(IMAGE_REGEX, "")

export const buildMarkdownStyle = (
  { theme, color: colorFn, space }: Theme,
  {
    variant = "sm",
    color = "onBackgroundHigh",
    emphasisColor = "onBackgroundHigh",
    linkColor = "mono100",
    textAlign,
  }: Pick<MarkdownTextProps, "variant" | "color" | "emphasisColor" | "linkColor" | "textAlign">
): MarkdownStyle => {
  const { fonts, textTreatments } = theme
  const textColor = colorFn(color)
  const accentColor = colorFn(emphasisColor)
  const body = textTreatments[variant]
  // Headings ignore `textAlign`: simple-markdown only aligned paragraphs, headings stayed left
  const heading = (headingVariant: TextVariant) => ({
    fontFamily: fonts.sans.regular,
    fontSize: textTreatments[headingVariant].fontSize,
    lineHeight: textTreatments[headingVariant].lineHeight,
    color: accentColor,
    marginTop: 0,
    marginBottom: space(1),
  })

  return {
    paragraph: {
      fontFamily: fonts.sans.regular,
      fontSize: body.fontSize,
      lineHeight: body.lineHeight,
      color: textColor,
      marginTop: 0,
      marginBottom: space(1),
      textAlign,
    },
    h1: heading("lg"),
    h2: heading("lg"),
    h3: heading("md"),
    h4: heading("md"),
    h5: heading("md"),
    h6: heading("md"),
    list: {
      fontFamily: fonts.sans.regular,
      fontSize: body.fontSize,
      lineHeight: body.lineHeight,
      color: accentColor,
      bulletColor: accentColor,
      markerColor: accentColor,
      marginTop: 0,
      marginBottom: space(1),
    },
    blockquote: {
      fontFamily: fonts.sans.regular,
      fontSize: body.fontSize,
      lineHeight: body.lineHeight,
      color: textColor,
      borderColor: colorFn("mono10"),
      borderWidth: 2,
      gapWidth: space(1),
      backgroundColor: "transparent",
    },
    link: {
      fontFamily: fonts.sans.regular,
      color: colorFn(linkColor),
      underline: true,
    },
    strong: { fontFamily: fonts.sans.medium, fontWeight: "normal", color: accentColor },
    em: { fontFamily: fonts.sans.italic, fontStyle: "normal", color: accentColor },
    code: {
      fontFamily: fonts.sans.regular,
      fontSize: body.fontSize,
      color: accentColor,
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
    codeBlock: {
      fontFamily: fonts.sans.regular,
      fontSize: body.fontSize,
      lineHeight: body.lineHeight,
      color: accentColor,
      backgroundColor: "transparent",
      borderColor: "transparent",
      padding: 0,
    },
    thematicBreak: {
      color: colorFn("mono10"),
      height: 1,
      marginTop: 0,
      marginBottom: space(2),
    },
  }
}

/**
 * Renders markdown as native text using react-native-enriched-markdown.
 * Replacement for `renderMarkdown` / `<Markdown>` (simple-markdown), rolled out across all call sites
 * behind the `AREnableEnrichedMarkdown` feature flag.
 */
export const MarkdownText: React.FC<MarkdownTextProps> = ({
  markdown,
  variant,
  color,
  emphasisColor,
  linkColor,
  textAlign,
  numberOfLines,
  presentLinksModally = false,
  ...rest
}) => {
  const theme = useTheme()

  const markdownStyle = useMemo(
    () => buildMarkdownStyle(theme, { variant, color, emphasisColor, linkColor, textAlign }),
    [theme, variant, color, emphasisColor, linkColor, textAlign]
  )

  return (
    <EnrichedMarkdownText
      markdown={sanitizeMarkdown(markdown)}
      markdownStyle={markdownStyle}
      md4cFlags={MD4C_FLAGS}
      numberOfLines={numberOfLines}
      onLinkPress={({ url }) => openMarkdownLink(url, { modal: presentLinksModally })}
      {...rest}
    />
  )
}
