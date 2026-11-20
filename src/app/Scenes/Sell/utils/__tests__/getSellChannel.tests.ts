import { getSellChannel } from "app/Scenes/Sell/utils/getSellChannel"

describe("getSellChannel", () => {
  it("describes an Artsy listing", () => {
    expect(getSellChannel("MARKETPLACE")).toEqual({
      kind: "MARKETPLACE",
      name: "Artsy Listing",
      actionLabel: "Start Listing",
    })
  })

  it("describes an Artnet auction", () => {
    expect(getSellChannel("AUCTION")).toEqual({
      kind: "AUCTION",
      name: "Artnet Auction",
      actionLabel: "Start Submission",
    })
  })
})
