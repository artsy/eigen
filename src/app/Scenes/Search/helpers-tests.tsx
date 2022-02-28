import { ContextModule } from "@artsy/cohesion"
import { getContextModuleByPillName } from "./helpers"

describe("getContextModuleByPillName", () => {
  it("should return context modules", () => {
    expect(getContextModuleByPillName("Top")).toEqual(ContextModule.topTab)
    expect(getContextModuleByPillName("Artworks")).toEqual(ContextModule.artworksTab)
    expect(getContextModuleByPillName("Artist")).toEqual(ContextModule.artistsTab)
    expect(getContextModuleByPillName("Auction")).toEqual(ContextModule.auctionTab)
    expect(getContextModuleByPillName("Artist Series")).toEqual(ContextModule.artistSeriesTab)
    expect(getContextModuleByPillName("Fair")).toEqual(ContextModule.fairTab)
    expect(getContextModuleByPillName("Show")).toEqual(ContextModule.showTab)
    expect(getContextModuleByPillName("Gallery")).toEqual(ContextModule.galleryTab)
  })

  it("should return nothing if an unknown tab is passed", () => {
    expect(getContextModuleByPillName("Unknown")).toBeUndefined()
  })
})
