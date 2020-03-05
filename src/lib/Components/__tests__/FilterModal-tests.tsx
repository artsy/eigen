import { CheckIcon, Sans, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { act, create } from "react-test-renderer"
import * as renderer from "react-test-renderer"
import {
  ArrowLeftIconContainer,
  SortOptionListItemRow,
  SortOptionsScreen,
} from "../../../lib/Components/ArtworkFilterOptions/SortOptions"
import { FakeNavigator as MockNavigator } from "../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import {
  ClearAllButton,
  CloseIconContainer,
  CurrentOption,
  FilterHeader,
  FilterOptions,
  TouchableOptionListItemRow,
} from "../../../lib/Components/FilterModal"
import { ArtworkFilterContext, ArtworkFilterContextState, reducer } from "../../utils/ArtworkFiltersStore"

let mockNavigator: MockNavigator
let state: ArtworkFilterContextState

beforeEach(() => {
  mockNavigator = new MockNavigator()
  state = {
    selectedSortOption: "Default",
    selectedFilters: [],
    appliedFilters: [],
  }
})

const MockFilterScreen = ({ initialState }) => {
  const [clearFilterState, dispatch] = React.useReducer(reducer, initialState)

  return (
    <Theme>
      <ArtworkFilterContext.Provider
        value={{
          state: clearFilterState,
          dispatch,
        }}
      >
        <FilterOptions closeModal={jest.fn()} navigator={mockNavigator as any} />
      </ArtworkFilterContext.Provider>
    </Theme>
  )
}

const MockSortScreen = ({ initialState }) => {
  const [clearFilterState, dispatch] = React.useReducer(reducer, initialState)

  return (
    <Theme>
      <ArtworkFilterContext.Provider
        value={{
          state: clearFilterState,
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

  it("allows users to navigate back to filter screen from sort screen ", () => {
    const sortScreen = create(
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state,
            dispatch: null,
          }}
        >
          <SortOptionsScreen navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )

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

    const instance = sortScreen.root.findByType(ArrowLeftIconContainer)

    act(() => instance.props.onPress())

    mockNavigator.pop()

    const getPreviousScreenTitle = component => component.root.findByType(FilterHeader).props.children

    expect(getPreviousScreenTitle(filterScreen)).toEqual("Filter")
  })

  it("allows users to exit filter modal when selecting close icon", () => {
    const modalClosed = jest.fn()

    const filterScreen = create(
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state,
            dispatch: () => ({ appliedFilters: [], selectedFilters: [], selectedSortOption: "Default" }),
          }}
        >
          <FilterOptions closeModal={modalClosed} navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )

    const instance = filterScreen.root.findByType(CloseIconContainer)

    act(() => instance.props.onPress())

    expect(modalClosed).toHaveBeenCalled()
  })

  it("only displays a check mark next to the currently selected sort option on the sort screen", () => {
    const initialState: ArtworkFilterContextState = {
      selectedSortOption: "Price (high to low)",
      selectedFilters: [],
      appliedFilters: [],
    }
    const sortScreen = mount(<MockSortScreen initialState={initialState} />)

    const selectedRow = sortScreen.find(SortOptionListItemRow).at(2)

    const checkMark = selectedRow.find(CheckIcon)

    expect(checkMark).toHaveLength(1)
  })

  it("displays the currently selected sort option on the filter screen", () => {
    const initialState: ArtworkFilterContextState = {
      selectedSortOption: "Price (low to high)",
      selectedFilters: [],
      appliedFilters: [],
    }

    const filterScreen = mount(<MockFilterScreen initialState={initialState} />)

    expect(filterScreen.find(CurrentOption).text()).toEqual("Price (low to high)")
  })

  it("shows the default sort option on the filter screen", () => {
    const initialState: ArtworkFilterContextState = {
      selectedSortOption: "Default",
      selectedFilters: [],
      appliedFilters: [],
    }

    const filterScreen = mount(<MockFilterScreen initialState={initialState} />)

    expect(filterScreen.find(CurrentOption).text()).toEqual("Default")
  })
})

describe("Clearing filters", () => {
  it("allows users to clear all filters when selecting clear all", () => {
    const initialState: ArtworkFilterContextState = {
      selectedSortOption: "Price (low to high)",
      selectedFilters: [{ type: "Price (low to high)", filter: "sort" }],
      appliedFilters: [{ type: "Recently added", filter: "sort" }],
    }

    const filterScreen = mount(<MockFilterScreen initialState={initialState} />)

    expect(filterScreen.find(CurrentOption).text()).toEqual("Price (low to high)")

    filterScreen
      .find(ClearAllButton)
      .props()
      .onPress()

    expect(filterScreen.find(CurrentOption).text()).toEqual("Default")
  })
  it("when a user applies a filter that filter name shows in the default view", () => {})
  it("the apply button shows the number of currently selected filters", () => {})
  it("the apply button resets after filters are applied", () => {})
})
