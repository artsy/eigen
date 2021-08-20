import _ from "lodash"
import { usePaletteFlagStore } from "palette/PaletteFlag"
import { ThemeV3 } from "palette/Theme"
import React from "react"

export * from "./helpers"

// TextV3
import { Text as TextV3, TextProps as TextV3Props } from "./Text"
export { TextV3, TextV3Props }

// TextV2
import { Text as TextV2, TextProps as TextV2Props } from "./TextV2"
export { TextV2, TextV2Props }

// TextV1
export { _maxWidth } from "./Typography-v1"
import { Sans as SansV1, SansProps as SansV1Props } from "./Sans"
export { SansV1, SansV1Props, SansV1Props as SansProps }
import { Serif as SerifV1, SerifProps as SerifV1Props } from "./Serif"
export { SerifV1, SerifV1Props, SerifV1Props as SerifProps }

// V1 handler

/**
 * Deprecated. Use `TextV3` instead.
 * Mapping:
 * 1: xs, 2: xs, 3: sm, 3t: sm, 4: md, 4t: md, 5: md, 5t: md, 6: lg, 8: lg, 10: xl, 12: xxl
 */
export const Serif: React.FC<SerifV1Props> = (props) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)
  if (allowV3) {
    return (
      <ThemeV3>
        <TextV3 {...transformSerifPropsToV3(props)} />
      </ThemeV3>
    )
  }
  return <SerifV1 {...props} />
}

const transformSerifPropsToV3 = (props: SerifV1Props): TextV3Props => {
  const { size, weight, ...newProps } = _.clone(props)

  const actualSize = _.isArray(size) ? size[0] : size
  const sizeMap: Record<
    "1" | "2" | "3" | "3t" | "4" | "4t" | "5" | "5t" | "6" | "8" | "10" | "12",
    TextV3Props["size"]
  > = {
    "1": "xs",
    "2": "xs",
    "3": "sm",
    "3t": "sm",
    "4": "md",
    "4t": "md",
    "5": "md",
    "5t": "md",
    "6": "lg",
    "8": "lg",
    "10": "xl",
    "12": "xxl",
  }

  if (weight === "semibold") {
    ;(newProps as TextV3Props).weight = "medium"
  }

  return {
    ...newProps,
    size: sizeMap[actualSize],
  }
}

/**
 * Deprecated. Use `TextV3` instead.
 * Mapping:
 * 0: xs, 1: xs, 2: xs, 3: sm, 3t: sm, 4: md, 4t: md, 5: md, 5t: md, 6: lg, 8: lg, 10: xl, 12: xxl, 14: xxl, 16: xxl
 */
export const Sans: React.FC<SansV1Props> = (props) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)
  if (allowV3) {
    return (
      <ThemeV3>
        <TextV3 {...transformSansPropsToV3(props)} />
      </ThemeV3>
    )
  }
  return <SansV1 {...props} />
}

const transformSansPropsToV3 = (props: SansV1Props): TextV3Props => {
  const { size, weight, ...newProps } = _.clone(props)

  const actualSize = _.isArray(size) ? size[0] : size
  const sizeMap: Record<
    "0" | "1" | "2" | "3" | "3t" | "4" | "4t" | "5" | "5t" | "6" | "8" | "10" | "12" | "14" | "16",
    TextV3Props["size"]
  > = {
    "0": "xs",
    "1": "xs",
    "2": "xs",
    "3": "sm",
    "3t": "sm",
    "4": "md",
    "4t": "md",
    "5": "md",
    "5t": "md",
    "6": "lg",
    "8": "lg",
    "10": "xl",
    "12": "xxl",
    "14": "xxl",
    "16": "xxl",
  }

  if (weight === "medium") {
    ;(newProps as TextV3Props).weight = "medium"
  }

  return {
    ...newProps,
    size: sizeMap[actualSize],
  }
}

// V2 handler

const isTextV2Props = (props: TextProps): props is TextV2Props => {
  if ((props as TextV2Props).variant !== undefined) {
    return true
  }

  if ((props as TextV3Props).size !== undefined) {
    return false
  }

  // if nothing is obviously v2 or v3, assume v2
  return true
}

export type TextProps = TextV2Props | TextV3Props

/**
 * Deprecated. Use `TextV3` instead.
 * Mapping:
 * largeTitle: lg, title: md, subtitle: md, text: sm, mediumText: sm, caption: xs, small: xs
 */
export const Text: React.FC<TextProps> = (props) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)
  if (allowV3) {
    if (isTextV2Props(props)) {
      return (
        <ThemeV3>
          <TextV3 {...transformTextV2PropsToV3(props)} />
        </ThemeV3>
      )
    } else {
      return (
        <ThemeV3>
          <TextV3 {...props} />
        </ThemeV3>
      )
    }
  }

  if (isTextV2Props(props)) {
    return <TextV2 {...props} />
  }
  throw new Error("TextV2 used with v3 props. Don't do that.")
}

const transformTextV2PropsToV3 = (props: TextV2Props): TextV3Props => {
  const { variant, ...newProps } = _.clone(props)

  const variantMap: Record<
    "small" | "largeTitle" | "title" | "subtitle" | "text" | "mediumText" | "caption",
    TextV3Props["size"]
  > = {
    largeTitle: "lg",
    title: "md",
    subtitle: "md",
    text: "sm",
    mediumText: "sm",
    caption: "xs",
    small: "xs",
  }

  return {
    ...newProps,
    size: variantMap[variant ?? "text"],
  }
}
