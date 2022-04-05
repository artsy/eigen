import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { Metric } from "app/Scenes/Search/UserPrefsModel"
import { isNull, isUndefined, round as __round__ } from "lodash"

export type Numeric = "*" | number

export interface Range {
  min: Numeric
  max: Numeric
}

const ONE_IN_TO_CM = 2.54
// to be removed in favor of userPrefs.metric
export const IS_USA = LegacyNativeModules.ARCocoaConstantsModule.CurrentLocale === "en_US"
export const LOCALIZED_UNIT: Metric = IS_USA ? "in" : "cm"

/**
 * Accepts a value and it's input unit type and returns a localized conversion (or leaves it alone)
 */
export const localizeDimension = (value: Numeric, unit: Metric) => {
  if (unit === "cm") {
    return inToCm(value)
  }

  return round(value)
}

export const cmToIn = (centimeters: Numeric) => {
  if (centimeters === "*") {
    return centimeters
  }

  return centimeters / ONE_IN_TO_CM
}

export const inToCm = (inches: Numeric, shouldRound: boolean = true) => {
  if (inches === "*") {
    return inches
  }

  const centimeters = inches * ONE_IN_TO_CM

  if (shouldRound) {
    // Round off floating point precision errors.
    return round(centimeters)
  }

  return centimeters
}

export const toIn = (value: Numeric, unit: Metric): Numeric => {
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

export const parsePriceRangeLabel = (min: Numeric, max: Numeric) => {
  let parsedMin = "$0"
  let parsedMax = "+"

  if (min !== "*") {
    parsedMin = `$${min.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
  }
  if (max !== "*") {
    parsedMax = `–${max.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
  }

  return `${parsedMin}${parsedMax}`
}
