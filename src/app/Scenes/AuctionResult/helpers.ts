import { AuctionResultListItem_auctionResult$data } from "__generated__/AuctionResultListItem_auctionResult.graphql"
import { DateTime } from "luxon"

type AuctionResultHelperNeededData = "currency" | "boughtIn" | "priceRealized" | "saleDate"
// This type just mirrors the types that come back from metaphysics.
export type AuctionResultHelperData = Pick<
  AuctionResultListItem_auctionResult$data,
  AuctionResultHelperNeededData
>

export const auctionResultHasPrice = (auctionResult: AuctionResultHelperData): boolean => {
  if (
    !auctionResult.priceRealized ||
    auctionResult.priceRealized.cents === null ||
    auctionResult.priceRealized.display === null ||
    auctionResult.currency === null
  ) {
    return false
  }

  if (auctionResult.priceRealized.cents === 0) {
    return false
  }

  return true
}

export const auctionResultText = (auctionResult: AuctionResultHelperData) => {
  if (auctionResult.boughtIn === true) {
    return "Bought in"
  }

  if (auctionResultHasPrice(auctionResult)) {
    return undefined
  }

  const now = DateTime.now()
  const isFromPastMonth = auctionResult.saleDate
    ? DateTime.fromISO(auctionResult.saleDate) > now.minus({ months: 1 })
    : false
  return isFromPastMonth ? "Awaiting results" : "Not available"
}
