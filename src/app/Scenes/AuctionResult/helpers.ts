import { AuctionResultListItem_auctionResult$data } from "__generated__/AuctionResultListItem_auctionResult.graphql"
import moment from "moment"

type AuctionResultHelperNeededData = "currency" | "boughtIn" | "priceRealized" | "saleDate"
// This type just mirrors the types that come back from metaphysics.
export type AuctionResultHelperData = Pick<
  AuctionResultListItem_auctionResult$data,
  AuctionResultHelperNeededData
>

export const auctionResultHasPrice = (auctionResult: AuctionResultHelperData): boolean => {
  if (
    auctionResult.priceRealized === null ||
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

  const now = moment()
  const isFromPastMonth = auctionResult.saleDate
    ? moment(auctionResult.saleDate).isAfter(now.subtract(1, "month"))
    : false
  return isFromPastMonth ? "Awaiting results" : "Not available"
}
