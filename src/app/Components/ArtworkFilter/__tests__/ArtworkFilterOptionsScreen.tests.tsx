import {
  FilterModalMode,
  getStaticFilterOptionsByMode,
} from "app/Components/ArtworkFilter/ArtworkFilterOptionsScreen"

describe("getStaticFilterOptionsByMode", () => {
  it("only returns filters supported by auction results", () => {
    const filterTypes = getStaticFilterOptionsByMode(FilterModalMode.AuctionResults, []).map(
      (option) => option.filterType
    )

    expect(filterTypes.sort()).toEqual(["categories", "organizations", "sizes", "sort", "year"])
  })
})
