import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { debounce } from "lodash"
import { Input } from "palette"
import React from "react"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "../ArtworkFilterStore"
import { KeywordFilter } from "./KeywordFilter"

jest.mock("lodash", () => ({
  ...jest.requireActual("lodash"),
  debounce: jest.fn(),
}))
jest.unmock("react-relay")

describe("KeywordFilter", () => {
  beforeEach(() => {
    ;(debounce as jest.Mock).mockImplementation((funk) => {
      return funk
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("renders and filters when input changes", () => {
    const selectedTree = renderWithWrappers(
      <ArtworkFiltersStoreProvider initialData={initialFilterData}>
        <KeywordFilter artistId="artist-id" artistSlug="artist-slug" />
      </ArtworkFiltersStoreProvider>
    )

    const input = selectedTree.root.findByType(Input)
    expect(input).toBeTruthy()

    input.props.onChangeText("test-query")

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action_type: "auctionResultsFilterParamsChanged",
      changed: '{"keyword":"test-query"}',
      context_module: "auctionResults",
      context_screen: "Artist",
      context_screen_owner_id: "artist-id",
      context_screen_owner_slug: "artist-slug",
      context_screen_owner_type: "Artist",
      current: '{"sort":"DATE_DESC","allowEmptyCreatedDates":true}',
    })
  })
})

const initialFilterData: ArtworkFiltersState = {
  selectedFilters: [],
  appliedFilters: [],
  previouslyAppliedFilters: [],
  applyFilters: false,
  aggregations: [],
  filterType: "auctionResult",
  counts: {
    total: null,
    followedArtists: null,
  },
  sizeMetric: "cm",
}
