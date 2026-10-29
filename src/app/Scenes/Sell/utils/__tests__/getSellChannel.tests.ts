import { getSellChannel } from "app/Scenes/Sell/utils/getSellChannel"

describe("getSellChannel", () => {
  it("picks an Artsy listing when the second-last hex digit is even", () => {
    expect(getSellChannel("id-a2")).toMatchObject({
      kind: "MARKETPLACE",
      name: "Artsy Listing",
      actionLabel: "Start Listing",
    })
  })

  it("picks an Artnet auction when the second-last hex digit is odd", () => {
    expect(getSellChannel("id-b4")).toMatchObject({
      kind: "AUCTION",
      name: "Artnet Auction",
      actionLabel: "Start Submission",
    })
  })
})
