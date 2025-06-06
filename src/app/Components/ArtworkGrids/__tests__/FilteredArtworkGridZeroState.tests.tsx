import { fireEvent, getDefaultNormalizer } from "@testing-library/react-native"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  FilteredArtworkGridZeroState,
  ZeroStateProps,
} from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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

  it("displays correct text", () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    expect(
      getByText("No results found\nPlease try another search.", {
        normalizer: getDefaultNormalizer({
          collapseWhitespace: false,
        }),
      })
    ).toBeTruthy()
  })

  it(`displays "Clear filters" button`, () => {
    const { queryAllByText } = renderWithWrappers(<TestWrapper />)
    expect(queryAllByText("Clear filters")[0]).toBeDefined()
  })

  it(`doesn't display "Clear filters" button when "hideClearButton" prop is passed`, () => {
    const { queryAllByText } = renderWithWrappers(<TestWrapper hideClearButton />)
    expect(queryAllByText("Clear filters")).toHaveLength(0)
  })

  it(`does not call "trackClear" callback on "Clear filters" button press if id is not passed`, () => {
    const { queryAllByText } = renderWithWrappers(
      <TestWrapper slug="test-slug" trackClear={trackClearMock} />
    )
    fireEvent(queryAllByText("Clear filters")[0], "press")
    expect(trackClearMock).not.toHaveBeenCalled()
  })

  it(`does not call "trackClear" callback on "Clear filters" button press if slug is not passed`, () => {
    const { queryAllByText } = renderWithWrappers(
      <TestWrapper id="test-id" trackClear={trackClearMock} />
    )
    fireEvent(queryAllByText("Clear filters")[0], "press")
    expect(trackClearMock).not.toHaveBeenCalled()
  })

  it(`calls "trackClear" callback with id and slug on "Clear filters" button press if both are passed`, () => {
    const { queryAllByText } = renderWithWrappers(
      <TestWrapper slug="test-slug" id="test-id" trackClear={trackClearMock} />
    )
    fireEvent(queryAllByText("Clear filters")[0], "press")
    expect(trackClearMock).toHaveBeenCalledWith("test-id", "test-slug")
  })
})
