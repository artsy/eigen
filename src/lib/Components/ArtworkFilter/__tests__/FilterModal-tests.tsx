import { FilterModalTestsQuery } from "__generated__/FilterModalTestsQuery.graphql"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import {
  AnimatedArtworkFilterButton,
  ApplyButton,
  ArtworkFilterNavigator,
  ArtworkFilterOptionsScreen,
  ClearAllButton,
  CloseIconContainer,
  CurrentOption,
  FilterModalMode,
} from "lib/Components/ArtworkFilter"
import { Aggregations, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { TouchableRow } from "lib/Components/TouchableRow"
import { CollectionFixture } from "lib/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { CollectionArtworksFragmentContainer } from "lib/Scenes/Collection/Screens/CollectionArtworks"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers, TestWrappers } from "lib/tests/renderWithWrappers"
import { Sans } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { extractText } from "../../../tests/extractText"
import { closeModalMock, getEssentialProps, MockFilterScreen, navigateMock } from "../__tests__/FilterTestHelper"

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
}

afterEach(() => {
  jest.resetAllMocks()
})

const MockFilterModalNavigator = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => {
  return (
    <TestWrappers>
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <ArtworkFilterNavigator
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          collection={CollectionFixture}
          exitModal={exitModalMock}
          closeModal={closeModalMock}
          mode={FilterModalMode.ArtistArtworks}
          id="abc123"
          slug="some-artist"
          isFilterArtworksModalVisible
        />
      </ArtworkFiltersStoreProvider>
    </TestWrappers>
  )
}

describe("Filter modal navigation flow", () => {
  it("allows users to navigate forward to sort screen from filter screen", () => {
    const filterScreen = renderWithWrappers(
      <ArtworkFiltersStoreProvider>
        <ArtworkFilterOptionsScreen
          {...getEssentialProps({
            mode: FilterModalMode.Collection,
          })}
        />
      </ArtworkFiltersStoreProvider>
    )

    // the first row item takes users to the Medium navigation route
    const instance = filterScreen.root.findAllByType(TouchableRow)[0]

    act(() => instance.props.onPress())
    expect(navigateMock).toBeCalledWith("SortOptionsScreen")
  })

  it("allows users to navigate forward to medium screen from filter screen", () => {
    const filterScreen = renderWithWrappers(
      <ArtworkFiltersStoreProvider initialData={initialState}>
        <ArtworkFilterOptionsScreen
          {...getEssentialProps({
            mode: FilterModalMode.Collection,
          })}
        />
      </ArtworkFiltersStoreProvider>
    )
    // the second row item takes users to the Medium navigation route
    const instance = filterScreen.root.findAllByType(TouchableRow)[1]

    act(() => instance.props.onPress())

    expect(navigateMock).toBeCalledWith("AdditionalGeneIDsOptionsScreen")
  })

  it("allows users to exit filter modal screen when selecting close icon", () => {
    const filterScreen = mount(<MockFilterModalNavigator />)

    filterScreen.find(CloseIconContainer).props().onPress()
    expect(closeModalMock).toHaveBeenCalled()
  })
})

describe("Filter modal states", () => {
  it("displays the currently selected sort option on the filter screen", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [{ displayText: "Price (low to high)", paramName: FilterParamName.sort }],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterScreen = mount(<MockFilterScreen initialState={injectedState} />)
    expect(filterScreen.find(CurrentOption).at(0).text()).toEqual("Price (low to high)")
  })

  it("displays the currently selected medium option on the filter screen", () => {
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
    }

    const filterScreen = mount(<MockFilterScreen initialState={injectedState} />)

    expect(filterScreen.find(CurrentOption).at(1).text()).toEqual("Performance Art")
  })

  it("displays the filter screen apply button correctly when no filters are selected", () => {
    const filterScreen = mount(<MockFilterModalNavigator />)

    expect(filterScreen.find(ApplyButton).props().disabled).toEqual(true)
  })

  it("displays the filter screen apply button correctly when filters are selected", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [{ displayText: "Price (low to high)", paramName: FilterParamName.sort }],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterScreen = renderWithWrappers(<MockFilterModalNavigator initialData={injectedState} />)

    expect(filterScreen.root.findByType(ApplyButton).props.disabled).toEqual(false)
  })

  it("displays default filters on the Filter modal", () => {
    const filterScreen = mount(<MockFilterScreen initialState={initialState} />)

    expect(filterScreen.find(CurrentOption).at(0).text()).toEqual("Default")

    expect(filterScreen.find(CurrentOption).at(1).text()).toEqual("All")

    expect(filterScreen.find(CurrentOption).at(2).text()).toEqual("All")
  })

  it("displays selected filters on the Filter modal", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        { displayText: "Drawing", paramValue: ["drawing"], paramName: FilterParamName.additionalGeneIDs },
        { displayText: "Price (low to high)", paramName: FilterParamName.sort },
        { displayText: "$10,000-20,000", paramName: FilterParamName.priceRange },
        {
          displayText: "Bid",
          paramValue: true,
          paramName: FilterParamName.waysToBuyBid,
        },
        { displayText: "All", paramName: FilterParamName.timePeriod },
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
    }

    const filterScreen = renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    expect(extractText(filterScreen.root.findAllByType(CurrentOption)[0])).toEqual("Price (low to high)")
    expect(extractText(filterScreen.root.findAllByType(CurrentOption)[1])).toEqual("Drawing")
    expect(extractText(filterScreen.root.findAllByType(CurrentOption)[2])).toEqual("All")
    expect(extractText(filterScreen.root.findAllByType(CurrentOption)[3])).toEqual("$10,000-20,000")
    expect(extractText(filterScreen.root.findAllByType(CurrentOption)[4])).toEqual("Bid")
    expect(extractText(filterScreen.root.findAllByType(CurrentOption)[5])).toEqual("All")
    expect(filterScreen.root.findAllByType(CurrentOption)).toHaveLength(6)
  })
})

describe("Clearing filters", () => {
  it("allows users to clear all filters when selecting clear all", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Price (low to high)",
          paramValue: "Price (low to high)",
          paramName: FilterParamName.sort,
        },
      ],
      appliedFilters: [{ displayText: "Recently Added", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Recently Added", paramName: FilterParamName.sort }],
      applyFilters: false,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterScreen = renderWithWrappers(<MockFilterScreen initialState={injectedState} />)

    expect(extractText(filterScreen.root.findAllByType(CurrentOption)[0])).toEqual("Price (low to high)")

    filterScreen.root.findByType(ClearAllButton).props.onPress()

    expect(extractText(filterScreen.root.findAllByType(CurrentOption)[0])).toEqual("Default")
  })

  it("enables the apply button when clearing all if no other options are selected", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [],
      appliedFilters: [{ displayText: "Recently added", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Recently added", paramName: FilterParamName.sort }],
      applyFilters: false,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterModal = mount(<MockFilterModalNavigator initialData={injectedState} />)

    expect(filterModal.find(CurrentOption).at(0).text()).toEqual("Recently added")
    expect(filterModal.find(ApplyButton).props().disabled).toEqual(true)

    filterModal.find(ClearAllButton).at(0).props().onPress()

    filterModal.update()

    expect(filterModal.find(CurrentOption).at(0).text()).toEqual("Default")
    expect(filterModal.find(CurrentOption).at(1).text()).toEqual("All")
    expect(filterModal.find(ApplyButton).at(0).props().disabled).toEqual(false)
  })

  it("the apply button shows the number of currently selected filters and its count resets after filters are applied", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        { displayText: "Price (high to low)", paramName: FilterParamName.sort },
        { displayText: "Works on paper", paramName: FilterParamName.medium },
      ],
      appliedFilters: [{ displayText: "Recently added", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Recently added", paramName: FilterParamName.sort }],
      applyFilters: true,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterModal = mount(<MockFilterModalNavigator initialData={injectedState} />)
    const applyButton = filterModal.find(ApplyButton)

    expect(applyButton.text()).toContain("Apply (2)")

    applyButton.props().onPress()

    // After applying, we reset the selectedFilters
    expect(applyButton.text()).toContain("Apply")
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
            <TestWrappers>
              <ArtworkFiltersStoreProvider initialData={initialData}>
                <CollectionArtworksFragmentContainer collection={props.marketingCollection} scrollToTop={jest.fn()} />
              </ArtworkFiltersStoreProvider>
            </TestWrappers>
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  it.skip("calls the relay method to refetch artworks when a filter is applied", async () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [{ displayText: "Price (high to low)", paramName: FilterParamName.sort }],
      appliedFilters: [{ displayText: "Price (high to low)", paramName: FilterParamName.sort }],
      previouslyAppliedFilters: [{ displayText: "Price (high to low)", paramName: FilterParamName.sort }],
      applyFilters: true,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    renderWithWrappers(<TestRenderer initialData={injectedState} />)

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
        "dimensionRange": "*-*",
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
        { displayText: "Works on paper", paramName: FilterParamName.medium, paramValue: "work-on-paper" },
      ],
      appliedFilters: [
        { displayText: "Recently added", paramName: FilterParamName.sort, paramValue: "-decayed_merch" },
      ],
      previouslyAppliedFilters: [
        { displayText: "Recently added", paramName: FilterParamName.sort, paramValue: "-decayed_merch" },
      ],
      applyFilters: true,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const filterModal = renderWithWrappers(<MockFilterModalNavigator initialData={injectedState} />)

    mockEnvironmentPayload(env)

    const applyButton = filterModal.root.findByType(ApplyButton)

    applyButton.props.onPress()
    expect(trackEvent).toHaveBeenCalledWith({
      action_type: "commercialFilterParamsChanged",
      changed: {
        medium: "work-on-paper",
      },
      context_screen: "Artist",
      context_screen_owner_id: "abc123",
      context_screen_owner_slug: "some-artist",
      context_screen_owner_type: "Artist",
      current: {
        acquireable: false,
        atAuction: false,
        dimensionRange: "*-*",
        estimateRange: "",
        includeArtworksByFollowedArtists: false,
        inquireableOnly: false,
        medium: "*",
        offerable: false,
        priceRange: "*-*",
        sort: "-decayed_merch",
      },
    })
  })
})

describe("AnimatedArtworkFilterButton", () => {
  it("Shows Sort & Filter when no text prop is available", () => {
    const tree = renderWithWrappers(
      <ArtworkFiltersStoreProvider>
        <AnimatedArtworkFilterButton isVisible onPress={jest.fn()} />
      </ArtworkFiltersStoreProvider>
    )

    expect(tree.root.findAllByType(Sans)[0].props.children).toEqual("Sort & Filter")
  })

  it("Shows text when text prop is available", () => {
    const tree = renderWithWrappers(
      <ArtworkFiltersStoreProvider>
        <AnimatedArtworkFilterButton text="Filter Text" isVisible onPress={jest.fn()} />
      </ArtworkFiltersStoreProvider>
    )

    expect(tree.root.findAllByType(Sans)[0].props.children).toEqual("Filter Text")
  })
})
