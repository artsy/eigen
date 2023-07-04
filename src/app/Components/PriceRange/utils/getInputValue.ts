import { PriceRange } from "app/Components/PriceRange/types"

export const getInputValue = (value: PriceRange[number]) => {
  return value === "*" || value === 0 ? "" : value.toString()
}
