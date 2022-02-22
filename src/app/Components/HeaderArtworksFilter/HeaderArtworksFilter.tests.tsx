import { useAnimatedValue } from "app/Scenes/Artwork/Components/ImageCarousel/useAnimatedValue"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Text, TouchableHighlightColor } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import {
  FilterProps,
  HeaderArtworksFilter,
  SeparatorWithSmoothOpacity,
} from "./HeaderArtworksFilter"

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
  })

  it("renders top separator", () => {
    const tree = renderWithWrappers(<MockHeaderArtworksFilter />)
    expect(tree.root.findAllByType(SeparatorWithSmoothOpacity)).toHaveLength(1)
  })

  it("should show correct artworks count", () => {
    const tree = renderWithWrappers(<MockHeaderArtworksFilter />)
    expect(extractText(tree.root.findAllByType(Text)[0])).toEqual("Showing 120 works")
  })

  it("should call `onPress` when `sort & filter` button is pressed", () => {
    const tree = renderWithWrappers(<MockHeaderArtworksFilter />)
    act(() => tree.root.findByType(TouchableHighlightColor).props.onPress())
    expect(onPress).toBeCalled()
  })

  describe("without animation", () => {
    it("doesn't render top separator", () => {
      const tree = renderWithWrappers(<MockHeaderArtworksFilter animationValue={undefined} />)
      expect(tree.root.findAllByType(SeparatorWithSmoothOpacity)).toHaveLength(0)
    })
  })
})
