import { Sans, Theme } from "@artsy/palette"
import { ArrowLeftIconContainer, SortOptionsScreen } from "lib/Components/ArtworkFilterOptions/SortOptions"
import { FakeNavigator as MockNavigator } from "lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { CloseIconContainer, FilterHeader, FilterOptions, TouchableOptionListItemRow } from "lib/Components/FilterModal"
import React from "react"
import { act, create } from "react-test-renderer"

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
    const filterListItem = filterScreen.root.findByType(TouchableOptionListItemRow)

    act(() => filterListItem.props.onPress())

    filterScreen = mockNavigator.nextStep()

    const getNextScreenTitle = component => component.root.findByType(Sans).props.children

    expect(getNextScreenTitle(filterScreen)).toEqual("Sort")
  })

  it("allows users to navigate back to filter screen from sort screen ", () => {
    const sortScreen = create(
      <Theme>
        <SortOptionsScreen navigator={mockNavigator as any} />
      </Theme>
    )

    const filterScreen = create(
      <Theme>
        <FilterOptions closeModal={jest.fn()} navigator={mockNavigator as any} />
      </Theme>
    )

    const sortBackNavigationItem = sortScreen.root.findByType(ArrowLeftIconContainer)

    act(() => sortBackNavigationItem.props.onPress())

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

    const closeModalIcon = filterScreen.root.findByType(CloseIconContainer)

    act(() => closeModalIcon.props.onPress())

    expect(modalClosed).toHaveBeenCalled()
  })
})
