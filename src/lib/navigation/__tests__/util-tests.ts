import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { handleFairRouting, MatchResult } from "../util"

describe("#handleFairRouting", () => {
  it("routes to a new fair page if the option is enabled", () => {
    __appStoreTestUtils__?.injectEmissionOptions({ AROptionsNewFairPage: true })
    __appStoreTestUtils__?.injectState({
      native: { sessionState: { legacyFairSlugs: [] } },
    })

    const newFairMatch: MatchResult = {
      type: "match",
      module: "Fair",
      params: { fairID: "awesome-fair" },
    }

    expect(handleFairRouting(newFairMatch)).toEqual({
      type: "match",
      module: "Fair2",
      params: { fairID: "awesome-fair" },
    })
  })

  it("routes to an old fair page if the option is enabled and fair is part of slug list", () => {
    __appStoreTestUtils__?.injectEmissionOptions({ AROptionsNewFairPage: true })
    __appStoreTestUtils__?.injectState({
      native: { sessionState: { legacyFairSlugs: ["awesome-fair"] } },
    })

    const newFairMatch: MatchResult = {
      type: "match",
      module: "Fair",
      params: { fairID: "awesome-fair" },
    }

    expect(handleFairRouting(newFairMatch)).toEqual({
      type: "match",
      module: "Fair",
      params: { fairID: "awesome-fair" },
    })
  })

  it("returns same result if module is not part of fair list", () => {
    __appStoreTestUtils__?.injectEmissionOptions({ AROptionsNewFairPage: true })
    __appStoreTestUtils__?.injectState({
      native: { sessionState: { legacyFairSlugs: ["awesome-fair"] } },
    })

    const newFairMatch: any = {
      type: "match",
      module: "FairBlah",
      params: { fairID: "awesome-fair" },
    }

    expect(handleFairRouting(newFairMatch)).toEqual(newFairMatch)
  })

  it("returns same result if option is not enabled", () => {
    const newFairMatch: MatchResult = {
      type: "match",
      module: "FairArtworks",
      params: { fairID: "awesome-fair" },
    }

    expect(handleFairRouting(newFairMatch)).toEqual(newFairMatch)
  })
})
