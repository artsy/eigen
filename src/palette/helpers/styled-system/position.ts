// Inspired from https://github.com/styled-system/styled-system/blob/master/packages/position/src/index.js
// and customised for our needs.

import { Config, styleFn, system } from "styled-system"
import { getCorrectPixelValue } from "./transforms"

const defaults = { space: [0, 4, 8, 16, 32, 64, 128, 256, 512] }

const config: Config = {
  position: true,
  zIndex: {
    property: "zIndex",
    scale: "zIndices",
  },
  top: {
    property: "top",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  right: {
    property: "right",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  bottom: {
    property: "bottom",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
  left: {
    property: "left",
    scale: "space",
    transform: getCorrectPixelValue,
    defaultScale: defaults.space,
  },
}

export const palettePosition: styleFn = system(config)
