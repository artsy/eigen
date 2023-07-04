import { DEFAULT_RANGE } from "app/Components/PriceRange/constants"
import { PriceRange } from "app/Components/PriceRange/types"

export const parseSliderRange = (range: PriceRange): number[] => {
  return range.map((value, index) => {
    if (value === "*") {
      return DEFAULT_RANGE[index]
    }

    return value as number
  })
}
