import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { buildSearchArtAssistantPrompt } from "app/Scenes/Search/utils/buildSearchArtAssistantPrompt"

describe("buildSearchArtAssistantPrompt", () => {
  it("returns an empty string when there is no query and no filters", () => {
    expect(buildSearchArtAssistantPrompt({ query: "  ", filters: [] })).toBe("")
  })

  it("uses only the query when there are no filters", () => {
    expect(buildSearchArtAssistantPrompt({ query: " abstract ", filters: [] })).toBe(
      'Find artworks for "abstract".'
    )
  })

  it("uses only the filters when there is no query", () => {
    expect(
      buildSearchArtAssistantPrompt({
        query: "",
        filters: [{ displayText: "Blue", paramName: FilterParamName.colors }],
      })
    ).toBe("Find artworks with these filters: Color: Blue.")
  })

  it("combines the query with several filters", () => {
    expect(
      buildSearchArtAssistantPrompt({
        query: "abstract",
        filters: [
          { displayText: "Blue, Red", paramName: FilterParamName.colors },
          { displayText: "Large (over 100cm)", paramName: FilterParamName.sizes },
        ],
      })
    ).toBe(
      'Find artworks for "abstract" with these filters: Color: Blue, Red; Size: Large (over 100cm).'
    )
  })

  it("groups filters that share a label", () => {
    expect(
      buildSearchArtAssistantPrompt({
        query: "",
        filters: [
          { displayText: "Buy now", paramName: FilterParamName.waysToBuyPurchase },
          { displayText: "Make offer", paramName: FilterParamName.waysToBuyMakeOffer },
        ],
      })
    ).toBe("Find artworks with these filters: Ways to Buy: Buy now, Make offer.")
  })

  it("keeps filters without a label as plain text", () => {
    expect(
      buildSearchArtAssistantPrompt({
        query: "",
        filters: [{ displayText: "Framed", paramName: FilterParamName.framed }],
      })
    ).toBe("Find artworks with these filters: Framed.")
  })
})
