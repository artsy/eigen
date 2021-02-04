import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

import { FilterModalTestsQuery } from "__generated__/FilterModalTestsQuery.graphql"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { CollectionFixture } from "lib/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { CollectionArtworksFragmentContainer } from "lib/Scenes/Collection/Screens/CollectionArtworks"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import {
  Aggregations,
  ArtworkFilterContext,
  ArtworkFilterContextState,
  reducer,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterParamName, InitialState } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Sans, Theme } from "palette"
import { useTracking } from "react-tracking"
import { closeModalMock, getEssentialProps, MockFilterScreen, navigateMock } from "../__tests__/FilterTestHelper"
import {
  AnimatedArtworkFilterButton,
  ApplyButton,
  ClearAllButton,
  CloseIconContainer,
  CurrentOption,
  FilterModalMode,
  FilterModalNavigator,
  FilterOptionsScreen,
  TouchableOptionListItemRow,
} from "../FilterModal"

let state: ArtworkFilterContextState
const exitModalMock = jest.fn()
const trackEvent = jest.fn()

jest.unmock("react-relay")

beforeEach(() => {
  ;(useTracking as jest.Mock).mockImplementation(() => {
    return {
      trackEvent,
    }
  })
  state = {
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
})

afterEach(() => {
  jest.resetAllMocks()
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

const MockFilterModalNavigator = ({ initialState }: InitialState) => {
  const [filterState, dispatch] = React.useReducer(reducer, initialState)

  return (
    <Theme>
      <ArtworkFilterContext.Provider
        value={{
          state: filterState,
          dispatch,
        }}
      >
        <FilterModalNavigator
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          collection={CollectionFixture}
          exitModal={exitModalMock}
          closeModal={closeModalMock}
          mode={FilterModalMode.ArtistArtworks}
          id="abc123"
          slug="some-artist"
          isFilterArtworksModalVisible
        />
      </ArtworkFilterContext.Provider>
    </Theme>
  )
}

describe("Filter modal navigation flow", () => {
  it("allows users to navigate forward to sort screen from filter screen", () => {
    const filterScreen = renderWithWrappers(
      <ArtworkFilterContext.Provider
        value={{
          state,
          dispatch: jest.fn(),
        }}
      >
        <FilterOptionsScreen
          {...getEssentialProps({
            mode: FilterModalMode.Collection,
          })}
        />
      </ArtworkFilterContext.Provider>
    )

    // the first row item takes users to the Medium navigation route
    const instance = filterScreen.root.findAllByType(TouchableOptionListItemRow)[0]

    act(() => instance.props.onPress())
    expect(navigateMock).toBeCalledWith("SortOptionsScreen")
  })

  it("allows users to navigate forward to medium screen from filter screen", () => {
    const filterScreen = renderWithWrappers(
      <ArtworkFilterContext.Provider
        value={{
          state,
          aggregations: mockAggregations,
          filterType: "artwork",
          counts: {
            total: null,
            followedArtists: null,
          },

          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          dispatch: null,
        }}
      >
        <FilterOptionsScreen
          {...getEssentialProps({
            mode: FilterModalMode.Collection,
          })}
        />
      </ArtworkFilterContext.Provider>
    )

    // the second row item takes users to the Medium navigation route
    const instance = filterScreen.root.findAllByType(TouchableOptionListItemRow)[1]

    act(() => instance.props.onPress())

    expect(navigateMock).toBeCalledWith("MediumOptionsScreen")
  })

  it("allows users to exit filter modal screen when selecting close icon", () => {
    const filterScreen = mount(<MockFilterScreen initialState={state} />)

    filterScreen.find(CloseIconContainer).props().onPress()
    expect(closeModalMock).toHaveBeenCalled()
  })
})

describe("Filter modal states", () => {
  it("displays the currently selected sort option on the filter screen", () => {
    state = {
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

    const filterScreen = mount(<MockFilterScreen initialState={state} />)
    expect(filterScreen.find(CurrentOption).at(0).text()).toEqual("Price (low to high)")
  })

  it("displays the currently selected medium option on the filter screen", () => {
    state = {
      selectedFilters: [{ displayText: "Performance art", paramName: FilterParamName.medium }],
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

    const filterScreen = mount(<MockFilterScreen initialState={state} />)
    expect(filterScreen.find(CurrentOption).at(1).text()).toEqual("Performance art")
  })

  it("displays the filter screen apply button correctly when no filters are selected", () => {
    const filterScreen = mount(<MockFilterModalNavigator initialState={state} />)

    expect(filterScreen.find(ApplyButton).props().disabled).toEqual(true)
  })

  it("displays the filter screen apply button correctly when filters are selected", () => {
    state = {
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

    const filterScreen = mount(<MockFilterModalNavigator initialState={state} />)

    expect(filterScreen.find(ApplyButton).props().disabled).toEqual(false)
  })

  it("displays default filters on the Filter modal", () => {
    const filterScreen = mount(<MockFilterScreen initialState={state} />)

    expect(filterScreen.find(CurrentOption).at(0).text()).toEqual("Default")

    expect(filterScreen.find(CurrentOption).at(1).text()).toEqual("All")

    expect(filterScreen.find(CurrentOption).at(2).text()).toEqual("All")
  })

  it("displays selected filters on the Filter modal", () => {
    state = {
      selectedFilters: [
        { displayText: "Drawing", paramName: FilterParamName.medium },
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

    const filterScreen = mount(<MockFilterScreen initialState={state} />)

    expect(filterScreen.find(CurrentOption).at(0).text()).toEqual("Price (low to high)")

    expect(filterScreen.find(CurrentOption).at(1).text()).toEqual("Drawing")

    expect(filterScreen.find(CurrentOption).at(2).text()).toEqual("All")

    expect(filterScreen.find(CurrentOption).at(3).text()).toEqual("$10,000-20,000")

    expect(filterScreen.find(CurrentOption).at(4).text()).toEqual("Bid")

    expect(filterScreen.find(CurrentOption).at(5).text()).toEqual("All")

    expect(filterScreen.find(CurrentOption)).toHaveLength(6)
  })
})

describe("Clearing filters", () => {
  it("allows users to clear all filters when selecting clear all", () => {
    state = {
      selectedFilters: [
        {
          displayText: "Price (low to high)",
          paramValue: "Price (low to high)",
          paramName: FilterParamName.sort,
        },
        {
          displayText: "Buy Now",
          paramValue: true,
          paramName: FilterParamName.waysToBuyBuy,
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

    const filterScreen = mount(<MockFilterScreen initialState={state} />)

    expect(filterScreen.find(CurrentOption).at(0).text()).toEqual("Price (low to high)")

    expect(filterScreen.find(CurrentOption).at(4).text()).toEqual("Buy Now")

    filterScreen.find(ClearAllButton).at(0).props().onPress()

    expect(filterScreen.find(CurrentOption).at(0).text()).toEqual("Default")

    expect(filterScreen.find(CurrentOption).at(4).text()).toEqual("All")
  })

  it("enables the apply button when clearing all if no other options are selected", () => {
    state = {
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

    const filterModal = mount(<MockFilterModalNavigator initialState={state} />)

    expect(filterModal.find(CurrentOption).at(0).text()).toEqual("Recently added")
    expect(filterModal.find(ApplyButton).props().disabled).toEqual(true)

    filterModal.find(ClearAllButton).at(0).props().onPress()

    filterModal.update()

    expect(filterModal.find(CurrentOption).at(0).text()).toEqual("Default")
    expect(filterModal.find(CurrentOption).at(1).text()).toEqual("All")
    expect(filterModal.find(ApplyButton).at(0).props().disabled).toEqual(false)
  })

  it("the apply button shows the number of currently selected filters and its count resets after filters are applied", () => {
    state = {
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

    const filterModal = mount(<MockFilterModalNavigator initialState={state} />)
    const applyButton = filterModal.find(ApplyButton)

    expect(applyButton.text()).toContain("Apply (2)")

    applyButton.props().onPress()

    // After applying, we reset the selectedFilters
    expect(applyButton.text()).toContain("Apply")
  })
})

describe("Applying filters on Artworks", () => {
  it("calls the relay method to refetch artworks when a filter is applied", async () => {
    state = {
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

    const env = createMockEnvironment()
    const TestRenderer = () => (
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
              <Theme>
                <ArtworkFilterContext.Provider
                  value={{
                    state,
                    dispatch: jest.fn(),
                  }}
                >
                  <CollectionArtworksFragmentContainer collection={props.marketingCollection} scrollToTop={jest.fn()} />
                </ArtworkFilterContext.Provider>
              </Theme>
            )
          } else if (error) {
            console.log(error)
          }
        }}
      />
    )
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          MarketingCollection: () => ({
            slug: "street-art-now",
          }),
        })
      )
    })
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toEqual(
      "CollectionArtworksInfiniteScrollGridQuery"
    )
    expect(env.mock.getMostRecentOperation().request.variables).toMatchInlineSnapshot(`
      Object {
        "acquireable": false,
        "atAuction": false,
        "attributionClass": null,
        "color": null,
        "count": 10,
        "cursor": null,
        "dimensionRange": "*-*",
        "id": "street-art-now",
        "inquireableOnly": false,
        "majorPeriods": null,
        "medium": "*",
        "offerable": false,
        "partnerID": null,
        "priceRange": "*-*",
        "sort": null,
      }
    `)
  })
  it("tracks changes in the filter state when a filter is applied", () => {
    state = {
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

    const filterModal = mount(<MockFilterModalNavigator initialState={state} />)
    const applyButton = filterModal.find(ApplyButton)

    applyButton.props().onPress()
    expect(trackEvent).toHaveBeenCalledWith({
      action_type: "commercial_filter_params_changed",
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
      <ArtworkFilterContext.Provider
        value={{
          state,
          dispatch: jest.fn(),
        }}
      >
        <AnimatedArtworkFilterButton isVisible onPress={jest.fn()} />
      </ArtworkFilterContext.Provider>
    )

    expect(tree.root.findAllByType(Sans)[0].props.children).toEqual("Sort & Filter")
  })

  it("Shows text when text prop is available", () => {
    const tree = renderWithWrappers(
      <ArtworkFilterContext.Provider
        value={{
          state,
          dispatch: jest.fn(),
        }}
      >
        <AnimatedArtworkFilterButton text="Filter Text" isVisible onPress={jest.fn()} />
      </ArtworkFilterContext.Provider>
    )

    expect(tree.root.findAllByType(Sans)[0].props.children).toEqual("Filter Text")
  })
})
