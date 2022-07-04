import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { ArtworksFilterHeader } from "./ArtworksFilterHeader"

describe("ArtistSeriesFilterHeader", () => {
  const onPress = jest.fn()

  it("renders without throwing an error and shows correct artworks count", () => {
    const { getByText } = renderWithWrappers(
      <ArtworksFilterHeader selectedFiltersCount={3} onFilterPress={onPress} />
    )

    expect(getByText("Sort & Filter")).toBeTruthy()
    expect(getByText("• 3")).toBeTruthy()
  })

  it("should call `onFilterPress` when `sort & filter` button is pressed", () => {
    const { getByText } = renderWithWrappers(
      <ArtworksFilterHeader selectedFiltersCount={3} onFilterPress={onPress} />
    )

    fireEvent.press(getByText("Sort & Filter"))
    expect(onPress).toBeCalled()
  })

  it("Should render the custom title text if passed as prop", () => {
    const { getByText } = renderWithWrappers(
      <ArtworksFilterHeader selectedFiltersCount={3} onFilterPress={onPress} title="Custom title" />
    )

    expect(getByText("Custom title")).toBeTruthy()
  })
})
