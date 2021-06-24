import { useAnimatedValue } from "lib/Scenes/Artwork/Components/ImageCarousel/useAnimatedValue"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text, TouchableHighlightColor } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { FilterProps, HeaderArtworksFilter } from "../HeaderArtworksFilter"

describe("HeaderArtworksFilter", () => {
  const onPress = jest.fn()

  const MockHeaderArtworksFilter = (props: FilterProps | {}) => {
    const animationValue = useAnimatedValue(0)
    return <HeaderArtworksFilter total={120} animationValue={animationValue} onPress={onPress} {...props} />
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<MockHeaderArtworksFilter />)
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
})
