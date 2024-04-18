import { RequestForPriceEstimateBanner_artwork$data } from "__generated__/RequestForPriceEstimateBanner_artwork.graphql"
import { GlobalStore } from "app/store/GlobalStore"

export const usePriceEstimateRequested = (artwork: RequestForPriceEstimateBanner_artwork$data) => {
  const localRequestedPriceEstimates = GlobalStore.useAppState(
    (state) => state.requestedPriceEstimates.requestedPriceEstimates
  )

  const priceEstimateRequested =
    artwork.hasPriceEstimateRequest || !!localRequestedPriceEstimates[artwork.internalID]

  return priceEstimateRequested
}
