// Inspired from https://github.com/styled-system/styled-system/blob/master/packages/space/src/index.js
// and customised for our needs.

import { isNumber, isObject, isString } from "lodash"
import { get, Scale } from "styled-system"

export const getCorrectPixelValue = (n: number | string | any, scale?: Scale) => {
  // if we give a number, we mean pixels, so no change required
  if (isNumber(n)) {
    return n
  }

  // if it's a string, go to our design system
  if (isString(n)) {
    if (n === "auto") {
      return n
    }

    if (n.endsWith("%")) {
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
