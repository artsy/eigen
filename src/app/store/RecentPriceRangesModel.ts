import { action, Action } from "easy-peasy"
import { GlobalStore } from "./GlobalStore"

export const MAX_SHOWN_RECENT_PRICE_RANGES = 3

export interface RecentPriceRangesModel {
  recentPriceRanges: string[]
  addNewPriceRange: Action<this, string>
  clearAllPriceRanges: Action<this>
}

export const getRecentPriceRangesModel = (): RecentPriceRangesModel => ({
  recentPriceRanges: [],
  addNewPriceRange: action((state, newPriceRange) => {
    const hasSamePriceRange = state.recentPriceRanges.find(
      (priceRange) => priceRange === newPriceRange
    )

    if (hasSamePriceRange) {
      return
    }

    const prevPriceRanges = state.recentPriceRanges.slice(0, MAX_SHOWN_RECENT_PRICE_RANGES - 1)
    state.recentPriceRanges = [newPriceRange, ...prevPriceRanges]
  }),
  clearAllPriceRanges: action((state) => {
    state.recentPriceRanges = []
  }),
})

export const useRecentPriceRanges = () => {
  return GlobalStore.useAppState((state) => {
    return state.recentPriceRanges.recentPriceRanges
  })
}
