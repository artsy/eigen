import { CheckIcon, Sans, Theme } from "@artsy/palette"
import { head } from "lodash"
import React from "react"
import { act, create } from "react-test-renderer"
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

let mockNavigator: MockNavigator

beforeEach(() => {
  mockNavigator = new MockNavigator()
})

describe("Filter modal navigation flow", () => {
  it("allows users to navigate forward to sort screen from filter screen", () => {
    let filterScreen = create(
      <Theme>
        <FilterOptions closeModal={jest.fn()} navigator={mockNavigator as any} />
      </Theme>
    )
    const instance = filterScreen.root.findByType(TouchableOptionListItemRow)

    act(() => instance.props.onPress())

    filterScreen = mockNavigator.nextStep()

    const getNextScreenTitle = component => component.root.findByType(Sans).props.children

    expect(getNextScreenTitle(filterScreen)).toEqual("Sort")
  })

  it("allows users to navigate back to filter screen from sort screen ", () => {
    const sortScreen = create(
      <Theme>
        <SortOptionsScreen navigator={mockNavigator as any} updateSortOption={jest.fn()} />
      </Theme>
    )

    const filterScreen = create(
      <Theme>
        <FilterOptions closeModal={jest.fn()} navigator={mockNavigator as any} />
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
        <FilterOptions closeModal={modalClosed} navigator={mockNavigator as any} />
      </Theme>
    )

    const instance = filterScreen.root.findByType(CloseIconContainer)

    act(() => instance.props.onPress())

    expect(modalClosed).toHaveBeenCalled()
  })

  it("only displays a check mark next to the currently selected sort option on the sort screen", () => {
    const sortScreen = create(
      <Theme>
        <SortOptionsScreen navigator={mockNavigator as any} updateSortOption={jest.fn()} />
      </Theme>
    )

    const instance = sortScreen.root.findAllByType(SortOptionListItemRow)[2]
    act(() => instance.props.onPress())
    const checkMark = sortScreen.root.findAllByType(CheckIcon)

    let selectedRow = sortScreen.root.findAllByType(InnerOptionListItem)
    selectedRow = head(selectedRow.filter(x => x.props.children[0].props.children === "Price (high to low)")) as any

    // @ts-ignore
    expect(selectedRow.findAllByType(CheckIcon)).toHaveLength(1) // asserts the visible check mark is a child of the selected row item
    expect(checkMark).toHaveLength(1) // asserts only one check mark at a time is visible on the screen
  })

  it("displays the currently selected sort option on the filter screen", () => {
    const filterScreen = create(
      <Theme>
        <FilterOptions closeModal={jest.fn()} navigator={mockNavigator as any} />
      </Theme>
    )

    const instance = filterScreen.root.findByType(FilterOptions).instance

    instance.getSortSelection("Price (low to high)")

    const currentSortSelection = filterScreen.root.findByType(CurrentOption).props.children

    expect(currentSortSelection).toEqual("Price (low to high)")
  })

  it("displays the currently selected sort option on the filter screen", () => {
    const filterScreen = create(
      <Theme>
        <FilterOptions closeModal={jest.fn()} navigator={mockNavigator as any} />
      </Theme>
    )

    const instance = filterScreen.root.findByType(FilterOptions).instance

    instance.getSortSelection("Price (low to high)")

    const currentSortSelection = filterScreen.root.findByType(CurrentOption).props.children

    expect(currentSortSelection).toEqual("Price (low to high)")
  })

  it("shows the default sort option on the filter screen", () => {
    const filterScreen = create(
      <Theme>
        <FilterOptions closeModal={jest.fn()} navigator={mockNavigator as any} />
      </Theme>
    )

    const instance = filterScreen.root.findByType(CurrentOption).props.children
    expect(instance).toEqual("Default")
  })
})
