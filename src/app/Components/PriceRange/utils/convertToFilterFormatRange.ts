import { DEFAULT_RANGE } from "app/Components/PriceRange/constants"
import { PriceRange } from "app/Components/PriceRange/types"

export const convertToFilterFormatRange = (range: number[]): PriceRange => {
  return range.map((value, index) => {
    if (value === DEFAULT_RANGE[index]) {
      return "*"
    }

    return value
  })
}
