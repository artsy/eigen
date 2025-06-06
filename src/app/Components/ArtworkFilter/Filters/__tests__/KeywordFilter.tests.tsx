import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { KeywordFilter } from "app/Components/ArtworkFilter/Filters/KeywordFilter"
import { Input } from "app/Components/Input"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { debounce } from "lodash"

jest.mock("lodash/debounce", () => jest.fn())

describe("KeywordFilter", () => {
  beforeEach(() => {
    ;(debounce as jest.Mock).mockImplementation((funk) => {
      return funk
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it.skip("renders and filters when input changes", () => {
    const selectedTree = renderWithWrappersLEGACY(
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialFilterData,
        }}
      >
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
  showFilterArtworksModal: false,
  sizeMetric: "cm",
}
