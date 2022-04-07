import { fireEvent, within } from "@testing-library/react-native"
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
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { CollectionFixture } from "app/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { CollectionArtworksFragmentContainer } from "app/Scenes/Collection/Screens/CollectionArtworks"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { Theme } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import {
  closeModalMock,
  getEssentialProps,
  MockFilterScreen,
  navigateMock,
} from "./FilterTestHelper"

const exitModalMock = jest.fn()
const trackEvent = jest.fn()

jest.unmock("react-relay")

beforeEach(() => {
  ;(useTracking as jest.Mock).mockImplementation(() => {
    return {
      trackEvent,
    }
  })
})

const mockAggregations: Aggregations = [
  {
    slice: "MEDIUM",
    counts: [
      {
        name: "Sculpture",
        count: 277,
        value: "sculpture",
      },
      {
        name: "Work on Paper",
        count: 149,
        value: "work-on-paper",
      },
      {
        name: "Painting",
        count: 145,
        value: "painting",
      },
      {
        name: "Drawing",
        count: 83,
        value: "drawing",
      },
    ],
  },
  {
    slice: "PRICE_RANGE",
    counts: [
      {
        name: "for Sale",
        count: 2028,
        value: "*-*",
      },
      {
        name: "between $10,000 & $50,000",
        count: 598,
        value: "10000-50000",
      },
      {
        name: "between $1,000 & $5,000",
        count: 544,
        value: "1000-5000",
      },
      {
        name: "Under $1,000",
        count: 393,
        value: "*-1000",
      },
      {
        name: "between $5,000 & $10,000",
        count: 251,
        value: "5000-10000",
      },
      {
        name: "over $50,000",
        count: 233,
        value: "50000-*",
      },
    ],
  },
  {
    slice: "MAJOR_PERIOD",
    counts: [
      {
        name: "Late 19th Century",
        count: 6,
        value: "Late 19th Century",
      },
      {
        name: "2010",
        count: 10,
        value: "2010",
      },
      {
        name: "2000",
        count: 4,
        value: "2000",
      },
      {
        name: "1990",
        count: 20,
        value: "1990",
      },
      {
        name: "1980",
        count: 46,
        value: "1980",
      },
      {
        name: "1970",
        count: 524,
        value: "1970",
      },
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
  sizeMetric: "cm",
}

afterEach(() => {
  jest.resetAllMocks()
})

const MockFilterModalNavigator = ({
  initialData = initialState,
  shouldShowCreateAlertButton,
}: {
  initialData?: ArtworkFiltersState
  shouldShowCreateAlertButton?: boolean
}) => (
  <GlobalStoreProvider>
    <Theme>
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <ArtworkFilterNavigator
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          collection={CollectionFixture}
          exitModal={exitModalMock}
          closeModal={closeModalMock}
          mode={FilterModalMode.ArtistArtworks}
          id="abc123"
          slug="some-artist"
          visible
          shouldShowCreateAlertButton={shouldShowCreateAlertButton}
        />
      </ArtworkFiltersStoreProvider>
    </Theme>
  </GlobalStoreProvider>
)

describe("Filter modal navigation flow", () => {
  it("allows users to navigate forward to sort screen from filter screen", () => {
    const { getByText } = renderWithWrappersTL(
      <ArtworkFiltersStoreProvider>
        <ArtworkFilterOptionsScreen
          {...getEssentialProps({
            mode: FilterModalMode.Collection,
          })}
        />
      </ArtworkFiltersStoreProvider>
    )

    // the first row item takes users to the Sort navigation route
    fireEvent.press(getByText("Sort By"))

    expect(navigateMock).toBeCalledWith("SortOptionsScreen")
  })

  it("allows users to navigate forward to medium screen from filter screen", () => {
    const { getByText } = renderWithWrappersTL(
      <ArtworkFiltersStoreProvider initialData={initialState}>
        <ArtworkFilterOptionsScreen
          {...getEssentialProps({
            mode: FilterModalMode.Collection,
          })}
        />
      </ArtworkFiltersStoreProvider>
    )
    // the second row item takes users to the Medium navigation route
    fireEvent.press(getByText("Medium"))

    expect(navigateMock).toBeCalledWith("AdditionalGeneIDsOptionsScreen")
  })

  it("allows users to exit filter modal screen when selecting close icon", () => {
    const { getByA11yLabel } = renderWithWrappersTL(<MockFilterModalNavigator />)

    fireEvent.press(getByA11yLabel("Header back button"))

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
      sizeMetric: "cm",
    }

    const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={injectedState} />)

    expect(within(getByText("Sort By")).getByText("• 1")).toBeTruthy()
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
      sizeMetric: "cm",
    }

    const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={injectedState} />)

    expect(within(getByText("Medium")).getByText("• 1")).toBeTruthy()
  })

  it("displays the filter screen apply button correctly when no filters are selected", () => {
    const { getByText } = renderWithWrappersTL(<MockFilterModalNavigator />)

    expect(getByText("Show Results")).toBeDisabled()
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
      sizeMetric: "cm",
    }

    const { getByText } = renderWithWrappersTL(
      <MockFilterModalNavigator initialData={injectedState} />
    )

    expect(getByText("Show Results")).not.toBeDisabled()
  })

  it("does not display default filters numbers on the Filter modal", () => {
    const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={initialState} />)

    expect(getByText("Sort By")).toBeTruthy()
    expect(getByText("Rarity")).toBeTruthy()
    expect(getByText("Medium")).toBeTruthy()
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
      sizeMetric: "cm",
    }

    const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={injectedState} />)

    expect(within(getByText("Sort By")).getByText("• 1")).toBeTruthy()
    expect(getByText("Rarity")).toBeTruthy()
    expect(within(getByText("Medium")).getByText("• 1")).toBeTruthy()
    expect(within(getByText("Price")).getByText("• 1")).toBeTruthy()
    expect(within(getByText("Ways to Buy")).getByText("• 1")).toBeTruthy()
    expect(within(getByText("Time Period")).getByText("• 2")).toBeTruthy()
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
      sizeMetric: "cm",
    }

    const { getByText, queryByText } = renderWithWrappersTL(
      <MockFilterScreen initialState={injectedState} />
    )

    expect(within(getByText("Sort By")).getByText("• 1")).toBeTruthy()
    fireEvent.press(getByText("Clear All"))

    expect(getByText("Sort By")).toBeTruthy()
    expect(queryByText("• 1")).toBeFalsy()
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
      sizeMetric: "cm",
    }

    const { getByText } = renderWithWrappersTL(
      <MockFilterModalNavigator initialData={injectedState} />
    )

    expect(getByText("Show Results")).toBeDisabled()

    fireEvent.press(getByText("Clear All"))

    expect(getByText("Sort By")).toBeTruthy()
    expect(getByText("Rarity")).toBeTruthy()
  })
})

describe("Applying filters on Artworks", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
    mockEnvironmentPayload(env)
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
            <GlobalStoreProvider>
              <Theme>
                <ArtworkFiltersStoreProvider initialData={initialData}>
                  <CollectionArtworksFragmentContainer
                    collection={props.marketingCollection}
                    scrollToTop={jest.fn()}
                  />
                </ArtworkFiltersStoreProvider>
              </Theme>
            </GlobalStoreProvider>
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
      sizeMetric: "cm",
    }

    renderWithWrappersTL(<TestRenderer initialData={injectedState} />)

    mockEnvironmentPayload(env, {
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
      sizeMetric: "cm",
    }

    const { getByText } = renderWithWrappersTL(
      <MockFilterModalNavigator initialData={injectedState} />
    )

    mockEnvironmentPayload(env)

    fireEvent.press(getByText("Show Results"))

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
    const { getByText } = renderWithWrappersTL(
      <ArtworkFiltersStoreProvider>
        <AnimatedArtworkFilterButton isVisible onPress={jest.fn()} />
      </ArtworkFiltersStoreProvider>
    )

    expect(getByText("Sort & Filter")).toBeTruthy()
  })

  it("Shows text when text prop is available", () => {
    const { getByText } = renderWithWrappersTL(
      <ArtworkFiltersStoreProvider>
        <AnimatedArtworkFilterButton text="Filter Text" isVisible onPress={jest.fn()} />
      </ArtworkFiltersStoreProvider>
    )

    expect(getByText("Filter Text")).toBeTruthy()
  })
})

describe("Saved Search Flow", () => {
  it('should hide "Create Alert" button by default', () => {
    const { queryByText } = renderWithWrappersTL(<MockFilterModalNavigator />)

    expect(queryByText("Create Alert")).toBeFalsy()
  })

  it('should show "Create Alert" button when shouldShowCreateAlertButton prop is passed', () => {
    const { getByText } = renderWithWrappersTL(
      <MockFilterModalNavigator shouldShowCreateAlertButton />
    )

    expect(getByText("Create Alert")).toBeTruthy()
  })
})
