import _ from "lodash"
import React from "react"

export * from "./helpers"

export * from "./Text"
export * from "./LinkText"

import { Text, TextProps } from "./Text"

// TextV1
export { _maxWidth } from "./Typography-v1"
import { Sans as SansV1, SansProps as SansV1Props } from "./Sans"
export { SansV1, SansV1Props, SansV1Props as SansProps }
import { Serif as SerifV1, SerifProps as SerifV1Props } from "./Serif"
export { SerifV1, SerifV1Props, SerifV1Props as SerifProps }

// TODO-PALETTE-V3 remove all `garamond` references from the app

// V1 handler

/**
 * @deprecated Deprecated. Use `Text` instead.
 * Mapping:
 * 1: xs, 2: xs, 3: sm, 3t: sm, 4: md, 4t: md, 5: md, 5t: md, 6: lg, 8: lg, 10: xl, 12: xxl
 */
export const Serif: React.FC<SerifV1Props> = (props) => {
  // TODO-PALETTE-V3 remove this and replace all usages with the mapping. also remove Serif files.
  return <Text {...transformSerifPropsToV3(props)} />
}

const transformSerifPropsToV3 = (props: SerifV1Props): TextProps => {
  const { size, weight, ...newProps } = _.clone(props)

  const actualSize = _.isArray(size) ? size[0] : size
  const sizeMap: Record<
    "1" | "2" | "3" | "3t" | "4" | "4t" | "5" | "5t" | "6" | "8" | "10" | "12",
    TextProps["variant"]
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
    ;(newProps as TextProps).weight = "medium"
  }

  return {
    ...newProps,
    variant: sizeMap[actualSize],
  }
}

/**
 * Deprecated. Use `TextV3` instead.
 * Mapping:
 * 0: xs, 1: xs, 2: xs, 3: sm, 3t: sm, 4: md, 4t: md, 5: md, 5t: md, 6: lg, 8: lg, 10: xl, 12: xxl, 14: xxl, 16: xxl
 */
export const Sans: React.FC<SansV1Props> = (props) => {
  // TODO-PALETTE-V3 remove this and replace all usages with the mapping. also remove Sans files.
  return <Text {...transformSansPropsToV3(props)} />
}

const transformSansPropsToV3 = (props: SansV1Props): TextProps => {
  const { size, weight, ...newProps } = _.clone(props)

  const actualSize = _.isArray(size) ? size[0] : size
  const sizeMap: Record<
    "0" | "1" | "2" | "3" | "3t" | "4" | "4t" | "5" | "5t" | "6" | "8" | "10" | "12" | "14" | "16",
    TextProps["variant"]
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
    ;(newProps as TextProps).weight = "medium"
  }

  return {
    ...newProps,
    variant: sizeMap[actualSize],
  }
}
