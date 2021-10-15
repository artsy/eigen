import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text, TouchableHighlightColor } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { ArtistSeriesFilterHeader } from "../ArtistSeriesFilterHeaders"

describe("ArtistSeriesFilterHeader", () => {
  const onPress = jest.fn()
  const initialState: ArtworkFiltersState = {
    aggregations: [],
    appliedFilters: [],
    applyFilters: false,
    counts: {
      total: 100,
      followedArtists: null,
    },
    filterType: "artwork",
    previouslyAppliedFilters: [],
    selectedFilters: [],
  }

  const MockArtistSeriesFilterHeaderScreen = () => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialState}>
        <ArtistSeriesFilterHeader onFilterArtworksPress={onPress} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<MockArtistSeriesFilterHeaderScreen />)
  })

  it("should show correct artworks count", () => {
    const tree = renderWithWrappers(<MockArtistSeriesFilterHeaderScreen />)

    expect(extractText(tree.root.findAllByType(Text)[0])).toEqual("Showing 100 works")
  })

  it("should call `onFilterArtworksPress` when `sort & filter` button is pressed", () => {
    const tree = renderWithWrappers(<MockArtistSeriesFilterHeaderScreen />)
    act(() => tree.root.findByType(TouchableHighlightColor).props.onPress())

    expect(onPress).toBeCalled()
  })
})
