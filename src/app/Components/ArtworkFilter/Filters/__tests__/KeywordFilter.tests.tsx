import { fireEvent, screen } from "@testing-library/react-native"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { KeywordFilter } from "app/Components/ArtworkFilter/Filters/KeywordFilter"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { debounce } from "lodash"

jest.mock("lodash/debounce", () => jest.fn())

describe("KeywordFilter", () => {
  beforeEach(() => {
    ;(debounce as jest.Mock).mockImplementation((funk) => {
      // the component cancels the debounced handler on unmount
      return Object.assign(funk, { cancel: jest.fn() })
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("renders and filters when input changes", async () => {
    await renderWithWrappers(
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialFilterData,
        }}
      >
        <KeywordFilter artistId="artist-id" artistSlug="artist-slug" />
      </ArtworkFiltersStoreProvider>
    )

    const input = screen.getByPlaceholderText("Search by artwork title, series...")
    expect(input).toBeOnTheScreen()

    await fireEvent.changeText(input, "test-query")

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action_type: "auctionResultsFilterParamsChanged",
      changed: '{"keyword":"test-query"}',
      context_module: "auctionResults",
      context_screen: "Artist",
      context_screen_owner_id: "artist-id",
      context_screen_owner_slug: "artist-slug",
      context_screen_owner_type: "Artist",
      current: '{"allowEmptyCreatedDates":true,"sort":"DATE_DESC","state":"ALL"}',
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
  showFilterArtworksModal: false,
  sizeMetric: "cm",
}
