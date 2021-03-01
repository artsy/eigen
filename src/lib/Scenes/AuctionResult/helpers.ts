import moment from "moment"

export interface AuctionResultHelperData {
  currency: string | null
  boughtIn: boolean | null
  priceRealized: {
    display: string | null
    cents: number | null
  } | null
  saleDate: string | null
}

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
