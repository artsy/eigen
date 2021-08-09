import _ from "lodash"
import { usePaletteFlagStore } from "palette/PaletteFlag"
import React from "react"

export * from "./tokens"

// TextV3
import { Text as TextV3, TextProps as TextV3Props } from "./TextV3"
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

export const Serif: React.FC<SerifV1Props> = (props) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)
  if (allowV3) {
    return <TextV3 {...transformSerifPropsToV3(props)} />
  }
  return <SerifV1 {...props} />
}

const transformSerifPropsToV3 = (props: SerifV1Props): TextV3Props => {
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

  if (weight === "semibold") {
    newProps.weight = "medium"
  }

  return {
    ...newProps,
    size: sizeMap[actualSize],
  }
}

export const Sans: React.FC<SansV1Props> = (props) => {
  const allowV3 = usePaletteFlagStore((state) => state.allowV3)
  if (allowV3) {
    return <TextV3 {...transformSansPropsToV3(props)} />
  }
  return <SansV1 {...props} />
}

const transformSansPropsToV3 = (props: SansV1Props): TextV3Props => {
  const { size, weight, ...newProps } = _.cloneDeep(props)

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
    newProps.weight = "medium"
  }

  return {
    ...newProps,
    size: sizeMap[actualSize],
  }
}
