import { fireEvent } from "@testing-library/react-native"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { FilteredArtworkGridZeroState, ZeroStateProps } from "./FilteredArtworkGridZeroState"

describe("FilteredArtworkGridZeroState", () => {
  const trackClearMock = jest.fn()

  const TestWrapper = (props: ZeroStateProps) => {
    return (
      <ArtworkFiltersStoreProvider>
        <FilteredArtworkGridZeroState {...props} />
      </ArtworkFiltersStoreProvider>
    )
  }

  beforeEach(() => {
    trackClearMock.mockClear()
  })

  it("display correct text when used for filter results", () => {
    const { getByText, queryAllByText } = renderWithWrappersTL(<TestWrapper resultsType="filter" />)
    expect(getByText("No results found\nPlease try another search.")).toBeDefined()
    expect(queryAllByText("No results were found.")).toHaveLength(0)
    expect(queryAllByText("Please try another search term.")).toHaveLength(0)
  })

  it("display correct text when used for search results", () => {
    const { getByText, queryAllByText } = renderWithWrappersTL(<TestWrapper resultsType="search" />)
    expect(getByText("No results were found.")).toBeDefined()
    expect(getByText("Please try another search term.")).toBeDefined()
    expect(queryAllByText("No results found\nPlease try another search.")).toHaveLength(0)
  })

  it(`displays "Clear filters" button`, () => {
    const { queryAllByText } = renderWithWrappersTL(<TestWrapper />)
    expect(queryAllByText("Clear filters")[0]).toBeDefined()
  })

  it(`doesn't display "Clear filters" button when "hideClearButton" prop is passed`, () => {
    const { queryAllByText } = renderWithWrappersTL(<TestWrapper hideClearButton />)
    expect(queryAllByText("Clear filters")).toHaveLength(0)
  })

  it(`does not call "trackClear" callback on "Clear filters" button press if id is not passed`, () => {
    const { queryAllByText } = renderWithWrappersTL(<TestWrapper slug="test-slug" trackClear={trackClearMock} />)
    fireEvent(queryAllByText("Clear filters")[0], "press")
    expect(trackClearMock).not.toHaveBeenCalled()
  })

  it(`does not call "trackClear" callback on "Clear filters" button press if slug is not passed`, () => {
    const { queryAllByText } = renderWithWrappersTL(<TestWrapper id="test-id" trackClear={trackClearMock} />)
    fireEvent(queryAllByText("Clear filters")[0], "press")
    expect(trackClearMock).not.toHaveBeenCalled()
  })

  it(`calls "trackClear" callback with id and slug on "Clear filters" button press if both are passed`, () => {
    const { queryAllByText } = renderWithWrappersTL(
      <TestWrapper slug="test-slug" id="test-id" trackClear={trackClearMock} />
    )
    fireEvent(queryAllByText("Clear filters")[0], "press")
    expect(trackClearMock).toHaveBeenCalledWith("test-id", "test-slug")
  })
})
