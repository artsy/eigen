import _ from "lodash"
import { usePaletteFlagStore } from "palette/PaletteFlag"
import React from "react"
// import { Text as TextV3, TextProps as TextV3Props } from "./Text"

export * from "./tokens"

// TextV3
import { Text as TextV3, TextProps as TextV3Props } from "./TextV3"
export { TextV3Props, TextV3 }

// TextV2
export { Text as TextV2, TextProps as TextV2Props } from "./Text"

// TextV1
export { _maxWidth } from "./Typography-v1"
export { Sans as SansV1, SansProps as SansV1Props } from "./Sans"
import { Serif as SerifV1, SerifProps as SerifV1Props } from "./Serif"
export { SerifV1, SerifV1Props }

export { Text as Sans, TextProps as SansProps } from "./Text"
export { TextProps as SerifProps } from "./Text"
import { SerifProps } from "./Serif"

export const Serif: React.FC<SerifProps> = (props) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)
  if (allowV3) {
    return <TextV3 {...transformPropsToV3(props)} />
  }
  return <SerifV1 {...props} />
}

const transformPropsToV3 = (props: SerifProps): TextV3Props => {
  const { size, weight, ...newProps } = _.cloneDeep(props)

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

  //   weight?: null | "regular" | "semibold"

  return {
    ...newProps,
    size: sizeMap[actualSize],
  }
  // const sizeMap: { [key: string]: ButtonSize } = {
  //   small: "small",
  //   medium: "small",
  //   large: "large",
  // }

  // const variantMap: { [key: string]: ButtonVariant } = {
  //   primaryBlack: "fillDark",
  //   primaryWhite: "fillLight",
  //   secondaryGray: "fillGray",
  //   secondaryOutline: "outline",
  //   secondaryOutlineWarning: "outline",
  //   noOutline: "text",
  // }

  // const size = props.size && sizeMap[props.size]
  // const variant = props.variant && variantMap[props.variant]

  // return { ...props, size, variant } as ButtonPropsV3
}
