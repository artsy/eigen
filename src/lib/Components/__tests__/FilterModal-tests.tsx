import { CheckIcon, Sans, Theme } from "@artsy/palette"
import { head } from "lodash"
import React from "react"
import { act, create } from "react-test-renderer"
import * as renderer from "react-test-renderer"
import {
  ArrowLeftIconContainer,
  InnerOptionListItem,
  SortOptionListItemRow,
  SortOptionsScreen,
} from "../../../lib/Components/ArtworkFilterOptions/SortOptions"
import { FakeNavigator as MockNavigator } from "../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import {
  CloseIconContainer,
  CurrentOption,
  FilterHeader,
  FilterOptions,
  TouchableOptionListItemRow,
} from "../../../lib/Components/FilterModal"
import { ArtworkFilterContext, ArtworkFilterContextState } from "../../utils/ArtworkFiltersStore"

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
    const sortScreen = create(
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: {
              selectedSortOption: "Price (high to low)",
              selectedFilters: [],
              appliedFilters: [],
            },
            dispatch: () => ({
              appliedFilters: [],
              selectedFilters: ["Price (high to low)"],
              selectedSortOption: "Price (high to low)",
            }),
          }}
        >
          <SortOptionsScreen navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )

    const instance = sortScreen.root.findAllByType(SortOptionListItemRow)[2]
    act(() => instance.props.onPress())
    const checkMark = sortScreen.root.findAllByType(CheckIcon)

    const selectedRow = sortScreen.root.findAllByType(InnerOptionListItem)
    const selection = head(selectedRow.filter(x => x.props.children[0].props.children === "Price (high to low)")) as any

    expect(selection.findAllByType(CheckIcon)).toHaveLength(1) // asserts the visible check mark is a child of the selected row item
    expect(checkMark).toHaveLength(1) // asserts only one check mark at a time is visible on the screen
  })

  it("displays the currently selected sort option on the filter screen", () => {
    const filterScreen = create(
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: {
              selectedSortOption: "Price (low to high)",
              selectedFilters: [],
              appliedFilters: [],
            },
            dispatch: () => ({
              appliedFilters: [],
              selectedFilters: ["Price (low to high)"],
              selectedSortOption: "Price (low to high)",
            }),
          }}
        >
          <FilterOptions closeModal={jest.fn()} navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )

    const currentSortSelection = filterScreen.root.findByType(CurrentOption).props.children

    expect(currentSortSelection).toEqual("Price (low to high)")
  })

  it("displays the currently selected sort option on the filter screen", () => {
    const filterScreen = create(
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: {
              selectedSortOption: "Price (low to high)",
              selectedFilters: [],
              appliedFilters: [],
            },
            dispatch: () => ({
              appliedFilters: [],
              selectedFilters: ["Price (low to high)"],
              selectedSortOption: "Price (low to high)",
            }),
          }}
        >
          <FilterOptions closeModal={jest.fn()} navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )

    const currentSortSelection = filterScreen.root.findByType(CurrentOption).props.children

    expect(currentSortSelection).toEqual("Price (low to high)")
  })

  it("shows the default sort option on the filter screen", () => {
    const filterScreen = create(
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state,
            dispatch: () => ({ appliedFilters: [], selectedFilters: [], selectedSortOption: "Default" }),
          }}
        >
          <FilterOptions closeModal={jest.fn()} navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )

    const instance = filterScreen.root.findByType(CurrentOption).props.children
    expect(instance).toEqual("Default")
  })
})
