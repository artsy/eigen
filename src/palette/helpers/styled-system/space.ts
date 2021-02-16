// Inspired from https://github.com/styled-system/styled-system/blob/master/packages/space/src/index.js
// and customised for our needs.

import { compose, Config, styleFn, system } from "styled-system"
import { getCorrectPixelValue } from "./transforms"

const defaults = { space: [0, 4, 8, 16, 32, 64, 128, 256, 512] }

interface Configs {
  margin: Config
  padding: Config
}

const configs: Configs = {} as Configs

configs.margin = {
  margin: {
    property: "margin",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  marginTop: {
    property: "marginTop",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  marginRight: {
    property: "marginRight",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  marginBottom: {
    property: "marginBottom",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  marginLeft: {
    property: "marginLeft",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  marginX: {
    properties: ["marginLeft", "marginRight"],
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  marginY: {
    properties: ["marginTop", "marginBottom"],
    scale: "space",
    transform: getCorrectPixelValue,
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
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  paddingTop: {
    property: "paddingTop",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  paddingRight: {
    property: "paddingRight",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  paddingBottom: {
    property: "paddingBottom",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  paddingLeft: {
    property: "paddingLeft",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  paddingX: {
    properties: ["paddingLeft", "paddingRight"],
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  paddingY: {
    properties: ["paddingTop", "paddingBottom"],
    scale: "space",
    transform: getCorrectPixelValue,
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
