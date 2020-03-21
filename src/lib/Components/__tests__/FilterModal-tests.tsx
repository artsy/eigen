import { CheckIcon, Sans, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import { CollectionFixture } from "lib/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { CollectionArtworks } from "lib/Scenes/Collection/Screens/CollectionArtworks"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { NativeModules } from "react-native"
import { graphql, RelayPaginationProp } from "react-relay"
import { act, create } from "react-test-renderer"
import * as renderer from "react-test-renderer"
import {
  ArrowLeftIconContainer,
  SortOptionListItemRow,
  SortOptionsScreen,
} from "../../../lib/Components/ArtworkFilterOptions/SortOptions"
import { FakeNavigator as MockNavigator } from "../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import {
  ApplyButton,
  ClearAllButton,
  CloseIconContainer,
  CurrentOption,
  FilterModalNavigator,
  FilterOptions,
  TouchableOptionListItemRow,
} from "../../../lib/Components/FilterModal"
import { ArtworkFilterContext, ArtworkFilterContextState, reducer } from "../../utils/ArtworkFiltersStore"

let mockNavigator: MockNavigator
let state: ArtworkFilterContextState
const closeModalMock = jest.fn()

jest.unmock("react-relay")

beforeEach(() => {
  mockNavigator = new MockNavigator()
  state = {
    selectedFilters: [],
    appliedFilters: [],
    applyFilters: false,
  }
  NativeModules.Emission = {
    options: {
      AROptionsFilterCollectionsArtworks: true,
    },
  }
})

afterEach(() => {
  jest.resetAllMocks()
})

const MockFilterModalNavigator = ({ initialState }) => {
  const [filterState, dispatch] = React.useReducer(reducer, initialState)

  return (
    <Theme>
      <ArtworkFilterContext.Provider
        value={{
          state: filterState,
          dispatch,
        }}
      >
        <FilterModalNavigator closeModal={closeModalMock} isFilterArtworksModalVisible />
      </ArtworkFilterContext.Provider>
    </Theme>
  )
}

const MockFilterScreen = ({ initialState }) => {
  const [filterState, dispatch] = React.useReducer(reducer, initialState)

  return (
    <Theme>
      <ArtworkFilterContext.Provider
        value={{
          state: filterState,
          dispatch,
        }}
      >
        <FilterOptions closeModal={closeModalMock} navigator={mockNavigator as any} />
      </ArtworkFilterContext.Provider>
    </Theme>
  )
}

const MockSortScreen = ({ initialState }) => {
  const [filterState, dispatch] = React.useReducer(reducer, initialState)

  return (
    <Theme>
      <ArtworkFilterContext.Provider
        value={{
          state: filterState,
          dispatch,
        }}
      >
        <SortOptionsScreen navigator={mockNavigator as any} />
      </ArtworkFilterContext.Provider>
    </Theme>
  )
}

describe("Filter modal navigation flow", () => {
  it("allows users to navigate forward to sort screen from filter screen", () => {
    const filterScreen = create(
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state,
            dispatch: null,
          }}
        >
          <FilterOptions closeModal={jest.fn()} navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
    const instance = filterScreen.root.findByType(TouchableOptionListItemRow)

    act(() => instance.props.onPress())

    const nextRoute = mockNavigator.nextRoute()

    const nextScreen = renderer.create(
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state,
            dispatch: null,
          }}
        >
          {React.createElement(nextRoute.component, {
            ...nextRoute.passProps,
            nextScreen: true,
            navigator: MockNavigator,
            relay: {
              environment: null,
            },
          })}
        </ArtworkFilterContext.Provider>
      </Theme>
    )

    const getNextScreenTitle = component => component.root.findByType(Sans).props.children

    expect(getNextScreenTitle(nextScreen)).toEqual("Sort")
  })

  xit("allows users to navigate back to filter screen from sort screen ", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [],
      appliedFilters: [],
      applyFilters: false,
    }

    const filterScreen = mount(<MockFilterScreen initialState={initialState} />)

    filterScreen
      .find(TouchableOptionListItemRow)
      .at(0)
      .props()
      .onPress()

    expect(mockNavigator.nextRoute())
    const nextRoute = mockNavigator.nextRoute()
    mockNavigator.pop()

    const sortScreen = mount(
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state,
            dispatch: null,
          }}
        >
          {React.createElement(nextRoute.component, {
            ...nextRoute.passProps,
            nextScreen: true,
            navigator: MockNavigator,
            relay: {
              environment: null,
            },
          })}
        </ArtworkFilterContext.Provider>
      </Theme>
    )

    sortScreen
      .find(ArrowLeftIconContainer)
      .props()
      .onPress()
  })

  it("allows users to exit filter modal screen when selecting close icon", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [],
      appliedFilters: [],
      applyFilters: false,
    }

    const filterScreen = mount(<MockFilterScreen initialState={initialState} />)

    filterScreen
      .find(CloseIconContainer)
      .props()
      .onPress()
    expect(closeModalMock).toHaveBeenCalled()
  })

  it("only displays a check mark next to the currently selected sort option on the sort screen", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [{ filterType: "sort", value: "Price (high to low)" }],
      appliedFilters: [],
      applyFilters: false,
    }
    const sortScreen = mount(<MockSortScreen initialState={initialState} />)

    const selectedRow = sortScreen.find(SortOptionListItemRow).at(2)
    expect(selectedRow.text()).toEqual("Price (high to low)")
    expect(selectedRow.find(CheckIcon)).toHaveLength(1)
  })

  it("displays the currently selected sort option on the filter screen", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [{ filterType: "sort", value: "Price (low to high)" }],
      appliedFilters: [],
      applyFilters: false,
    }

    const filterScreen = mount(<MockFilterScreen initialState={initialState} />)
    expect(filterScreen.find(CurrentOption).text()).toEqual("Price (low to high)")
  })

  it("shows the default sort option on the filter screen", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [],
      appliedFilters: [],
      applyFilters: false,
    }

    const filterScreen = mount(<MockFilterScreen initialState={initialState} />)

    expect(filterScreen.find(CurrentOption).text()).toEqual("Default")
  })

  it("displays the filter screen apply button correctly when no filters are selected", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [],
      appliedFilters: [],
      applyFilters: false,
    }

    const filterScreen = mount(<MockFilterModalNavigator initialState={initialState} />)

    expect(filterScreen.find(ApplyButton).props().disabled).toEqual(true)
  })

  it("displays the filter screen apply button correctly when filters are selected", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [{ value: "Price (low to high)", filterType: "sort" }],
      appliedFilters: [],
      applyFilters: false,
    }

    const filterScreen = mount(<MockFilterModalNavigator initialState={initialState} />)

    expect(filterScreen.find(ApplyButton).props().disabled).toEqual(false)
  })
})

describe("Clearing filters", () => {
  it("allows users to clear all filters when selecting clear all", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [{ value: "Price (low to high)", filterType: "sort" }],
      appliedFilters: [{ value: "Recently added", filterType: "sort" }],
      applyFilters: false,
    }

    const filterScreen = mount(<MockFilterScreen initialState={initialState} />)

    expect(filterScreen.find(CurrentOption).text()).toEqual("Price (low to high)")

    filterScreen
      .find(ClearAllButton)
      .props()
      .onPress()

    expect(filterScreen.find(CurrentOption).text()).toEqual("Default")
  })

  it("the apply button shows the number of currently selected filters and its count resets after filters are applied", () => {
    const initialState: ArtworkFilterContextState = {
      selectedFilters: [{ value: "Price (high to low)", filterType: "sort" }],
      appliedFilters: [{ value: "Recently added", filterType: "sort" }],
      applyFilters: true,
    }

    const filterModal = mount(<MockFilterModalNavigator initialState={initialState} />)
    const applyButton = filterModal.find(ApplyButton)

    expect(applyButton.text()).toContain("Apply (1)")

    applyButton.props().onPress()

    expect(applyButton.text()).toContain("Apply")
  })
})

describe("Applying filters", () => {
  it("calls the relay method to refetch artworks when a filter is applied", async () => {
    const initialState: ArtworkFilterContextState = {
      selectedSortOption: "Price (high to low)",
      selectedFilters: [{ type: "Price (high to low)", filter: "sort" }],
      appliedFilters: [{ type: "Price (high to low)", filter: "sort" }],
      applyFilters: true,
    }

    const relayMock = {
      refetchConnection: jest.fn(),
      environment: {} as any,
      hasMore: jest.fn(),
      isLoading: jest.fn(),
      loadMore: jest.fn(),
      refetch: undefined,
    } as RelayPaginationProp

    const render = marketingCollection =>
      renderRelayTree({
        Component: () => {
          return (
            <Theme>
              <ArtworkFilterContext.Provider
                value={{
                  state: initialState,
                  dispatch: null,
                }}
              >
                <CollectionArtworks collection={{ ...marketingCollection }} relay={relayMock} />
              </ArtworkFilterContext.Provider>
            </Theme>
          )
        },
        query: graphql`
          query FilterModalTestsQuery @raw_response_type {
            marketingCollection(slug: "street-art-now") {
              ...CollectionArtworks_collection
            }
          }
        `,
        mockData: { marketingCollection },
      })

    render(CollectionFixture).then(() => {
      expect(relayMock.refetchConnection).toHaveBeenCalled()
    })
  })
})
