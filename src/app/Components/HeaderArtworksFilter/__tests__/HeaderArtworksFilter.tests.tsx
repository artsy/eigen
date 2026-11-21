import { fireEvent, screen } from "@testing-library/react-native"
import {
  FilterProps,
  HeaderArtworksFilter,
} from "app/Components/HeaderArtworksFilter/HeaderArtworksFilter"
import { useAnimatedValue } from "app/Scenes/Artwork/Components/ImageCarousel/useAnimatedValue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("HeaderArtworksFilter", () => {
  const onPress = jest.fn()

  const MockHeaderArtworksFilter = (props: Partial<FilterProps>) => {
    const animationValue = useAnimatedValue(0)
    return (
      <HeaderArtworksFilter
        total={120}
        animationValue={animationValue}
        onPress={onPress}
        {...props}
      />
    )
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<MockHeaderArtworksFilter />)

    expect(screen.getByTestId("HeaderArtworksFilter")).toBeOnTheScreen()
  })

  it("renders top separator", () => {
    renderWithWrappers(<MockHeaderArtworksFilter />)
    expect(screen.getAllByTestId("header-artworks-filter-separator")).toHaveLength(1)
  })

  it("should show correct artworks count", () => {
    renderWithWrappers(<MockHeaderArtworksFilter />)
    expect(screen.getByText("Showing 120 works")).toBeOnTheScreen()
  })

  it("should call `onPress` when `sort & filter` button is pressed", () => {
    renderWithWrappers(<MockHeaderArtworksFilter />)
    fireEvent.press(screen.getByText("Sort & Filter"))
    expect(onPress).toBeCalled()
  })

  describe("without animation", () => {
    it("doesn't render top separator", () => {
      renderWithWrappers(<MockHeaderArtworksFilter animationValue={undefined} />)
      expect(screen.queryByTestId("header-artworks-filter-separator")).not.toBeOnTheScreen()
    })
  })
})
