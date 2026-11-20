import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ArtistSeriesFilterHeader", () => {
  const onPress = jest.fn()

  it("renders without throwing an error and shows correct artworks count", async () => {
    await renderWithWrappers(
      <ArtworksFilterHeader selectedFiltersCount={3} onFilterPress={onPress} />
    )

    expect(screen.getByText("Sort & Filter")).toBeOnTheScreen()
    expect(screen.getByText("• 3")).toBeOnTheScreen()
  })

  it("should call `onFilterPress` when `sort & filter` button is pressed", async () => {
    await renderWithWrappers(
      <ArtworksFilterHeader selectedFiltersCount={3} onFilterPress={onPress} />
    )

    await fireEvent.press(screen.getByText("Sort & Filter"))
    expect(onPress).toBeCalled()
  })

  it("Should render the custom title text if passed as prop", async () => {
    await renderWithWrappers(
      <ArtworksFilterHeader selectedFiltersCount={3} onFilterPress={onPress} title="Custom title" />
    )

    expect(screen.getByText("Custom title")).toBeOnTheScreen()
  })
})
