import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text, TouchableHighlightColor } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { ArtworksFilterHeader } from "../FilterHeader"

describe("ArtistSeriesFilterHeader", () => {
  const onPress = jest.fn()

  it("renders without throwing an error", () => {
    renderWithWrappers(<ArtworksFilterHeader count={10} onFilterPress={onPress} />)
  })

  it("should show correct artworks count", () => {
    const tree = renderWithWrappers(<ArtworksFilterHeader count={100} onFilterPress={onPress} />)

    expect(extractText(tree.root.findAllByType(Text)[0])).toEqual("Showing 100 works")
  })

  it("should call `onFilterPress` when `sort & filter` button is pressed", () => {
    const tree = renderWithWrappers(<ArtworksFilterHeader count={10} onFilterPress={onPress} />)
    act(() => tree.root.findByType(TouchableHighlightColor).props.onPress())

    expect(onPress).toBeCalled()
  })
})
