import { Text, TouchableHighlightColor } from "@artsy/palette-mobile"
import {
  FilterProps,
  HeaderArtworksFilter,
  SeparatorWithSmoothOpacity,
} from "app/Components/HeaderArtworksFilter/HeaderArtworksFilter"
import { useAnimatedValue } from "app/Scenes/Artwork/Components/ImageCarousel/useAnimatedValue"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { act } from "react-test-renderer"

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
    renderWithWrappersLEGACY(<MockHeaderArtworksFilter />)
  })

  it("renders top separator", () => {
    const tree = renderWithWrappersLEGACY(<MockHeaderArtworksFilter />)
    expect(tree.root.findAllByType(SeparatorWithSmoothOpacity)).toHaveLength(1)
  })

  it("should show correct artworks count", () => {
    const tree = renderWithWrappersLEGACY(<MockHeaderArtworksFilter />)
    expect(extractText(tree.root.findAllByType(Text)[0])).toEqual("Showing 120 works")
  })

  it("should call `onPress` when `sort & filter` button is pressed", () => {
    const tree = renderWithWrappersLEGACY(<MockHeaderArtworksFilter />)
    act(() => tree.root.findByType(TouchableHighlightColor).props.onPress())
    expect(onPress).toBeCalled()
  })

  describe("without animation", () => {
    it("doesn't render top separator", () => {
      const tree = renderWithWrappersLEGACY(<MockHeaderArtworksFilter animationValue={undefined} />)
      expect(tree.root.findAllByType(SeparatorWithSmoothOpacity)).toHaveLength(0)
    })
  })
})
