import {
  auctionResultHasPrice,
  AuctionResultHelperData,
  auctionResultText,
} from "app/Scenes/AuctionResult/helpers"
import moment from "moment"

describe("auction result helpers", () => {
  it("works for existing price", () => {
    const auctionResultWithPrice: AuctionResultHelperData = {
      currency: "USD",
      saleDate: moment().toISOString(),
      priceRealized: { display: "one dollar", displayUSD: "one dollar", cents: 100 },
      boughtIn: false,
    }

    expect(auctionResultHasPrice(auctionResultWithPrice)).toBe(true)
    expect(auctionResultText(auctionResultWithPrice)).toBe(undefined)
  })

  it("works for awaiting results", () => {
    const auctionResultAwaitingResults: AuctionResultHelperData = {
      currency: "USD",
      saleDate: moment().subtract(2, "days").toISOString(),
      priceRealized: { display: "zero", displayUSD: "zero", cents: 0 },
      boughtIn: false,
    }

    expect(auctionResultHasPrice(auctionResultAwaitingResults)).toBe(false)
    expect(auctionResultText(auctionResultAwaitingResults)).toBe("Awaiting results")
  })

  it("works for bought in", () => {
    const auctionResultBoughtIn: AuctionResultHelperData = {
      currency: "USD",
      saleDate: moment().toISOString(),
      priceRealized: { display: "zero", displayUSD: "zero", cents: 0 },
      boughtIn: true,
    }

    expect(auctionResultHasPrice(auctionResultBoughtIn)).toBe(false)
    expect(auctionResultText(auctionResultBoughtIn)).toBe("Bought in")
  })

  it("works for not available", () => {
    const auctionResultNotAvailable: AuctionResultHelperData = {
      currency: "USD",
      saleDate: moment().subtract(3, "months").toISOString(),
      priceRealized: { display: "zero", displayUSD: "zero", cents: 0 },
      boughtIn: false,
    }

    expect(auctionResultHasPrice(auctionResultNotAvailable)).toBe(false)
    expect(auctionResultText(auctionResultNotAvailable)).toBe("Not available")
  })
})
