import { fireEvent, screen } from "@testing-library/react-native"
import { FilterModalTestsQuery } from "__generated__/FilterModalTestsQuery.graphql"
import {
  AnimatedArtworkFilterButton,
  ArtworkFilterNavigator,
  ArtworkFilterOptionsScreen,
  FilterModalMode,
} from "app/Components/ArtworkFilter"
import { Aggregations, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { CollectionArtworksFragmentContainer } from "app/Scenes/Collection/Screens/CollectionArtworks"
import { mockNavigate } from "app/utils/tests/navigationMocks"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { closeModalMock, getEssentialProps, MockFilterScreen } from "./FilterTestHelper"

const exitModalMock = jest.fn()
const trackEvent = jest.fn()

const mockAggregations: Aggregations = [
  {
    slice: "MEDIUM",
    counts: [
      { name: "Sculpture", count: 277, value: "sculpture" },
      { name: "Work on Paper", count: 149, value: "work-on-paper" },
      { name: "Painting", count: 145, value: "painting" },
      { name: "Drawing", count: 83, value: "drawing" },
    ],
  },
  {
    slice: "MAJOR_PERIOD",
    counts: [
      { name: "Late 19th Century", count: 6, value: "Late 19th Century" },
      { name: "2010", count: 10, value: "2010" },
      { name: "2000", count: 4, value: "2000" },
      { name: "1990", count: 20, value: "1990" },
      { name: "1980", count: 46, value: "1980" },
      { name: "1970", count: 524, value: "1970" },
    ],
  },
]

const initialState: ArtworkFiltersState = {
  selectedFilters: [],
  appliedFilters: [],
  previouslyAppliedFilters: [],
  applyFilters: false,
  aggregations: mockAggregations,
  filterType: "artwork",
  counts: {
    total: null,
    followedArtists: null,
  },
  showFilterArtworksModal: false,
  sizeMetric: "cm",
}

const MockFilterModalNavigator = ({
  initialData = initialState,
  shouldShowCreateAlertButton,
}: {
  initialData?: ArtworkFiltersState
  shouldShowCreateAlertButton?: boolean
}) => (
  <ArtworkFiltersStoreProvider
    runtimeModel={{
      ...getArtworkFiltersModel(),
      ...initialData,
    }}
  >
    <ArtworkFilterNavigator
      exitModal={exitModalMock}
      closeModal={closeModalMock}
      mode={FilterModalMode.ArtistArtworks}
      id="abc123"
      slug="some-artist"
      visible
      shouldShowCreateAlertButton={shouldShowCreateAlertButton}
    />
  </ArtworkFiltersStoreProvider>
)

describe("Filter modal", () => {
  it("should display filter when aggregation counts are NOT empty", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [
        {
          slice: "MEDIUM",
          counts: [{ name: "Sculpture", count: 277, value: "sculpture" }],
        },
        {
          slice: "MAJOR_PERIOD",
          counts: [{ name: "Late 19th Century", count: 6, value: "Late 19th Century" }],
        },
      ],
      filterType: "artwork",
      counts: { total: null, followedArtists: null },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockFilterModalNavigator initialData={injectedState} />)

    expect(screen.getByText("Medium")).toBeTruthy()
    expect(screen.getByText("Time Period")).toBeTruthy()
  })

  it("should hide filter when aggregation counts are empty", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [
        {
          slice: "MEDIUM",
          counts: [],
        },
        {
          slice: "MAJOR_PERIOD",
          counts: [{ name: "Late 19th Century", count: 6, value: "Late 19th Century" }],
        },
      ],
      filterType: "artwork",
      counts: { total: null, followedArtists: null },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockFilterModalNavigator initialData={injectedState} />)

    expect(screen.queryByText("Medium")).toBeFalsy()
    expect(screen.getByText("Time Period")).toBeTruthy()
  })
})

describe("Filter modal navigation flow", () => {
  it("allows users to navigate forward to sort screen from filter screen", () => {
    renderWithWrappers(
      <ArtworkFiltersStoreProvider>
        <ArtworkFilterOptionsScreen
          {...getEssentialProps({
            mode: FilterModalMode.Collection,
          })}
        />
      </ArtworkFiltersStoreProvider>
    )

    // the first row item takes users to the Sort navigation route
    fireEvent.press(screen.getByText("Sort By"))

    expect(mockNavigate).toBeCalledWith("SortOptionsScreen")
  })

  it("allows users to navigate forward to medium screen from filter screen", () => {
    renderWithWrappers(
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialState,
        }}
      >
        <ArtworkFilterOptionsScreen
          {...getEssentialProps({
            mode: FilterModalMode.Collection,
          })}
        />
      </ArtworkFiltersStoreProvider>
    )
    // the second row item takes users to the Medium navigation route
    fireEvent.press(screen.getByText("Medium"))

    expect(mockNavigate).toBeCalledWith("AdditionalGeneIDsOptionsScreen")
  })

  it("allows users to exit filter modal screen when selecting close icon", () => {
    renderWithWrappers(<MockFilterModalNavigator />)

    fireEvent.press(screen.getByLabelText("Header back button"))

    expect(closeModalMock).toHaveBeenCalled()
  })
})

describe("Filter modal states", () => {
  it("displays the currently selected sort option number on the filter screen", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [{ displayText: "Price (Low to High)", paramName: FilterParamName.sort }],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    expect(screen.getByText("Sort By • 1")).toBeTruthy()
  })

  it("displays the currently selected medium option number on the filter screen", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Performance Art",
          paramValue: ["performance-art"],
          paramName: FilterParamName.additionalGeneIDs,
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    expect(screen.getByText("Medium • 1")).toBeTruthy()
  })

  it("displays the filter screen apply button correctly when no filters are selected", () => {
    renderWithWrappers(<MockFilterModalNavigator />)

    expect(screen.getByText("Show Results")).toBeDisabled()
  })

  it("displays the filter screen apply button correctly when filters are selected", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [{ displayText: "Price (Low to High)", paramName: FilterParamName.sort }],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockFilterModalNavigator initialData={injectedState} />)

    expect(screen.getByText("Show Results")).not.toBeDisabled()
  })

  it("does not display default filters numbers on the Filter modal", () => {
    renderWithWrappers(<MockFilterScreen initialState={initialState} />)

    expect(screen.getByText("Sort By")).toBeTruthy()
    expect(screen.getByText("Rarity")).toBeTruthy()
    expect(screen.getByText("Medium")).toBeTruthy()
  })

  it("displays selected filters on the Filter modal", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Drawing",
          paramValue: ["drawing"],
          paramName: FilterParamName.additionalGeneIDs,
        },
        { displayText: "Price (Low to High)", paramName: FilterParamName.sort },
        { displayText: "$10,000-20,000", paramName: FilterParamName.priceRange },
        {
          displayText: "Bid",
          paramValue: true,
          paramName: FilterParamName.waysToBuyBid,
        },
        {
          displayText: "All",
          paramValue: ["2020-Today", "1970-1979"],
          paramName: FilterParamName.timePeriod,
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    expect(screen.getByText("Sort By • 1")).toBeTruthy()
    expect(screen.getByText("Rarity")).toBeTruthy()
    expect(screen.getByText("Medium • 1")).toBeTruthy()
    expect(screen.getByText("Price • 1")).toBeTruthy()
    expect(screen.getByText("Ways to Buy • 1")).toBeTruthy()
    expect(screen.getByText("Time Period • 2")).toBeTruthy()
  })
})

describe("Clearing filters", () => {
  it("allows users to clear all filters when selecting clear all", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Price (Low to High)",
          paramValue: "Price (Low to High)",
          paramName: FilterParamName.sort,
        },
      ],
      appliedFilters: [{ displayText: "Recently Added", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [
        { displayText: "Recently Added", paramName: FilterParamName.sort },
      ],
      applyFilters: false,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    expect(screen.getByText("Sort By • 1")).toBeTruthy()
    fireEvent.press(screen.getByText("Clear All"))

    expect(screen.getByText("Sort By")).toBeTruthy()
    expect(screen.queryByText("• 1")).toBeFalsy()
  })

  it("exits the modal when clear all button is pressed", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [],
      appliedFilters: [{ displayText: "Recently Added", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [
        { displayText: "Recently Added", paramName: FilterParamName.sort },
      ],
      applyFilters: false,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockFilterModalNavigator initialData={injectedState} />)

    expect(screen.getByText("Show Results")).toBeDisabled()

    fireEvent.press(screen.getByText("Clear All"))

    expect(screen.getByText("Sort By")).toBeTruthy()
    expect(screen.getByText("Rarity")).toBeTruthy()
  })
})

describe("Applying filters on Artworks", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
    resolveMostRecentRelayOperation(env)
  })

  const TestRenderer = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => (
    <QueryRenderer<FilterModalTestsQuery>
      environment={env}
      query={graphql`
        query FilterModalTestsQuery @raw_response_type @relay_test_operation {
          marketingCollection(slug: "street-art-now") {
            ...CollectionArtworks_collection
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.marketingCollection) {
          return (
            <ArtworkFiltersStoreProvider
              runtimeModel={{
                ...getArtworkFiltersModel(),
                ...initialData,
              }}
            >
              <CollectionArtworksFragmentContainer collection={props.marketingCollection} />
            </ArtworkFiltersStoreProvider>
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  it.skip("calls the relay method to refetch artworks when a filter is applied", async () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [{ displayText: "Price (High to Low)", paramName: FilterParamName.sort }],
      appliedFilters: [{ displayText: "Price (High to Low)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [
        { displayText: "Price (High to Low)", paramName: FilterParamName.sort },
      ],
      applyFilters: true,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<TestRenderer initialData={injectedState} />)

    resolveMostRecentRelayOperation(env, {
      MarketingCollection: () => ({
        slug: "street-art-now",
      }),
    })

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toEqual(
      "CollectionArtworksInfiniteScrollGridQuery"
    )
    expect(env.mock.getMostRecentOperation().request.variables).toMatchInlineSnapshot(`
      Object {
        "acquireable": false,
        "additionalGeneIDs": null,
        "atAuction": false,
        "attributionClass": null,
        "color": null,
        "colors": null,
        "count": 10,
        "cursor": null,
        "id": "street-art-now",
        "inquireableOnly": false,
        "majorPeriods": null,
        "offerable": false,
        "partnerID": null,
        "priceRange": "*-*",
        "sort": null,
      }
    `)
  })

  it.skip("tracks changes in the filter state when a filter is applied", async () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Works on Paper",
          paramName: FilterParamName.medium,
          paramValue: "work-on-paper",
        },
      ],
      appliedFilters: [
        {
          displayText: "Recently Added",
          paramName: FilterParamName.sort,
          paramValue: "-decayed_merch",
        },
      ],
      previouslyAppliedFilters: [
        {
          displayText: "Recently Added",
          paramName: FilterParamName.sort,
          paramValue: "-decayed_merch",
        },
      ],
      applyFilters: true,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
      showFilterArtworksModal: false,
      sizeMetric: "cm",
    }

    renderWithWrappers(<MockFilterModalNavigator initialData={injectedState} />)

    resolveMostRecentRelayOperation(env)

    fireEvent.press(screen.getByText("Show Results"))

    expect(trackEvent).toHaveBeenCalledWith({
      action_type: "commercialFilterParamsChanged",
      changed: JSON.stringify({
        medium: "work-on-paper",
      }),
      context_screen: "Artist",
      context_screen_owner_id: "abc123",
      context_screen_owner_slug: "some-artist",
      context_screen_owner_type: "Artist",
      current: JSON.stringify({
        acquireable: false,
        atAuction: false,
        estimateRange: "",
        includeArtworksByFollowedArtists: false,
        inquireableOnly: false,
        medium: "*",
        offerable: false,
        priceRange: "*-*",
        sort: "-decayed_merch",
      }),
    })
  })
})

describe("AnimatedArtworkFilterButton", () => {
  it("Shows Sort & Filter when no text prop is available", () => {
    renderWithWrappers(
      <ArtworkFiltersStoreProvider>
        <AnimatedArtworkFilterButton isVisible onPress={jest.fn()} />
      </ArtworkFiltersStoreProvider>
    )

    expect(screen.getByText("Sort & Filter")).toBeTruthy()
  })

  it("Shows text when text prop is available", () => {
    renderWithWrappers(
      <ArtworkFiltersStoreProvider>
        <AnimatedArtworkFilterButton text="Filter Text" isVisible onPress={jest.fn()} />
      </ArtworkFiltersStoreProvider>
    )

    expect(screen.getByText("Filter Text")).toBeTruthy()
  })

  describe("Saved Search Flow", () => {
    it('should hide "Create Alert" button by default', () => {
      renderWithWrappers(<MockFilterModalNavigator />)

      expect(screen.queryByText("Create Alert")).toBeFalsy()
    })
  })

  it('should show "Create Alert" button when shouldShowCreateAlertButton prop is passed', () => {
    renderWithWrappers(<MockFilterModalNavigator shouldShowCreateAlertButton />)

    expect(screen.getByText("Create Alert")).toBeTruthy()
  })
})
