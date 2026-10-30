import { formatUSD, getListingPayout } from "app/Scenes/Sell/utils/getListingPayout"

describe("getListingPayout", () => {
  it("takes a 15% fee from the asking price", () => {
    expect(getListingPayout(3200)).toEqual({ fee: 480, payout: 2720 })
  })

  it("rounds the fee to whole dollars", () => {
    expect(getListingPayout(999)).toEqual({ fee: 150, payout: 849 })
  })

  it("takes no fee from a zero price", () => {
    expect(getListingPayout(0)).toEqual({ fee: 0, payout: 0 })
  })
})

describe("formatUSD", () => {
  it("adds the currency and thousands separators", () => {
    expect(formatUSD(2720)).toBe("US$2,720")
    expect(formatUSD(1250000)).toBe("US$1,250,000")
  })
})
