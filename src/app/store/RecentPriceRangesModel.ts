import { action, Action } from "easy-peasy"
import { GlobalStore } from "./GlobalStore"

export const MAX_SHOWN_RECENT_PRICE_RANGES = 3

export interface RecentPriceRangesModel {
  ranges: string[]
  addNewPriceRange: Action<this, string>
  clearAllPriceRanges: Action<this>
}

export const getRecentPriceRangesModel = (): RecentPriceRangesModel => ({
  ranges: [],
  addNewPriceRange: action((state, newPriceRange) => {
    const hasSamePriceRange = state.ranges.find((priceRange) => priceRange === newPriceRange)

    if (hasSamePriceRange) {
      return
    }

    const prevPriceRanges = state.ranges.slice(0, MAX_SHOWN_RECENT_PRICE_RANGES - 1)
    state.ranges = [newPriceRange, ...prevPriceRanges]
  }),
  clearAllPriceRanges: action((state) => {
    state.ranges = []
  }),
})

export const useRecentPriceRanges = () => {
  return GlobalStore.useAppState((state) => {
    return state.recentPriceRanges.ranges
  })
}
