// Inspired from https://github.com/styled-system/styled-system/blob/master/packages/space/src/index.js
// and customised for our needs.

import { isNumber, isObject, isString } from "lodash"
import { compose, Config, get, Scale, styleFn, system } from "styled-system"

const defaults = { space: [0, 4, 8, 16, 32, 64, 128, 256, 512] }

const getMargin = (n: number | string | any, scale?: Scale) => {
  // if we give a number, we mean pixels, so no change required
  if (isNumber(n)) {
    return n
  }

  // if it's a string, go to our design system
  if (isString(n)) {
    if (n === "auto") {
      return n
    }

    const isNegative = n.startsWith("-")
    const absN = isNegative ? n.substring(1) : n

    const value = (() => {
      if (isObject(scale)) {
        return (scale as { [key: string]: any })[absN]
      }
      return get(scale, absN, absN)
    })()
    if (isNumber(value)) {
      return isNegative ? -value : value
    } else if (isString(value)) {
      return isNegative ? "-" + value : value
    }
  }

  // anything else
  return 0
}

interface Configs {
  margin: Config
  padding: Config
}

const configs: Configs = {} as Configs

configs.margin = {
  margin: {
    property: "margin",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  marginTop: {
    property: "marginTop",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  marginRight: {
    property: "marginRight",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  marginBottom: {
    property: "marginBottom",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  marginLeft: {
    property: "marginLeft",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  marginX: {
    properties: ["marginLeft", "marginRight"],
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  marginY: {
    properties: ["marginTop", "marginBottom"],
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
}
configs.margin.m = configs.margin.margin
configs.margin.mt = configs.margin.marginTop
configs.margin.mr = configs.margin.marginRight
configs.margin.mb = configs.margin.marginBottom
configs.margin.ml = configs.margin.marginLeft
configs.margin.mx = configs.margin.marginX
configs.margin.my = configs.margin.marginY

configs.padding = {
  padding: {
    property: "padding",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  paddingTop: {
    property: "paddingTop",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  paddingRight: {
    property: "paddingRight",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  paddingBottom: {
    property: "paddingBottom",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  paddingLeft: {
    property: "paddingLeft",
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  paddingX: {
    properties: ["paddingLeft", "paddingRight"],
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
  paddingY: {
    properties: ["paddingTop", "paddingBottom"],
    scale: "space",
    transform: getMargin,
    defaultScale: defaults.space,
  },
}

configs.padding.p = configs.padding.padding
configs.padding.pt = configs.padding.paddingTop
configs.padding.pr = configs.padding.paddingRight
configs.padding.pb = configs.padding.paddingBottom
configs.padding.pl = configs.padding.paddingLeft
configs.padding.px = configs.padding.paddingX
configs.padding.py = configs.padding.paddingY

export const paletteMargin = system(configs.margin)
export const paletePadding = system(configs.padding)

export const paletteSpace: styleFn = compose(paletteMargin, paletePadding)
