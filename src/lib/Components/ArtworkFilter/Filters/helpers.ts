import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { isNull, isUndefined, round as __round__ } from "lodash"

type Numeric = "*" | number
type Unit = "in" | "cm"

export interface Range {
  min: Numeric
  max: Numeric
}

const ONE_IN_TO_CM = 2.54
export const IS_USA = LegacyNativeModules.ARCocoaConstantsModule.CurrentLocale === "en_US"
export const LOCALIZED_UNIT: Unit = IS_USA ? "in" : "cm"

/**
 * Accepts a value and it's input unit type and returns a localized conversion (or leaves it alone)
 */
export const localizeDimension = (value: Numeric, unit: Unit): { value: Numeric; unit: Unit } => {
  // Localize for US (return inches)
  if (IS_USA && unit === "in") {
    return { value, unit: "in" }
  }

  if (IS_USA && unit === "cm") {
    return { value: cmToIn(value), unit: "in" }
  }

  // Localize for rest of world (return centimeters)
  if (unit === "in") {
    return { value: inToCm(value), unit: "cm" }
  }

  return { value, unit: "cm" }
}

export const cmToIn = (centimeters: Numeric) => {
  if (centimeters === "*") {
    return centimeters
  }

  return centimeters / ONE_IN_TO_CM
}

export const inToCm = (inches: Numeric) => {
  if (inches === "*") {
    return inches
  }

  // Values will always be in inches since that's what Gravity accepts.
  // Round off floating point precision errors.
  return round(inches * ONE_IN_TO_CM)
}

export const toIn = (value: Numeric, unit: Unit): Numeric => {
  if (unit === "cm") {
    return cmToIn(value)
  }

  return value
}

/**
 * Rounds to 2 decimal places
 * e.g. `round(0.9999999999999999)` => `1`;
 * `round(1.19499)` => `1.19`
 */
export const round = (value: Numeric) => {
  if (value === "*") {
    return value
  }

  return __round__(value, 2)
}

const enforceNumeric = (value: Numeric | undefined | null): Numeric => {
  if (value === "*") {
    return value
  }

  if (isUndefined(value) || isNull(value) || isNaN(value)) {
    return "*"
  }

  return value
}

/**
 * Accepts a string in the form: `"*-*"` | `"*-1"` | `"1-*"`
 * and returns a `Range`
 */
export const parseRange = (range: string): Range => {
  const [min, max] = range.split("-").map((s) => {
    if (s === "*") {
      return s
    }

    return parseFloat(s)
  })

  return { min: enforceNumeric(min), max: enforceNumeric(max) }
}

export const parseRangeByKeys = (
  range: string,
  keys?: {
    minKey?: string
    maxKey?: string
  }
): Record<string, Numeric> => {
  const minKey = keys?.minKey ?? "min"
  const maxKey = keys?.maxKey ?? "max"
  const { min, max } = parseRange(range)
  return {
    [minKey]: min,
    [maxKey]: max,
  }
}
