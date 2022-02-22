import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { useAnimatedValue } from "lib/Scenes/Artwork/Components/ImageCarousel/useAnimatedValue"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { HeaderArtworksFilterWithTotalArtworks } from "./HeaderArtworksFilterWithTotalArtworks"

describe("HeaderArtworksFilterWithTotalArtworks", () => {
  const onPress = jest.fn()

  const initialState: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [],
    filterType: "artwork",
    counts: {
      total: null,
      followedArtists: null,
    },
  }

  const TestHeaderArtworksFilterWithTotalArtworks = ({
    initialData,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    const animationValue = useAnimatedValue(0)
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <HeaderArtworksFilterWithTotalArtworks animationValue={animationValue} onPress={onPress} />
      </ArtworkFiltersStoreProvider>
    )
  }

  const getWrapper = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => {
    const tree = renderWithWrappers(
      <TestHeaderArtworksFilterWithTotalArtworks initialData={initialData} />
    )
    return tree
  }

  it("renders artworks filter header with correct text", () => {
    const wrapper = getWrapper({
      initialData: {
        ...initialState,
        counts: {
          total: 12,
          followedArtists: null,
        },
      },
    })
    const text = extractText(wrapper.root)
    expect(text).toContain("Showing 12 works")
    expect(text).toContain("Sort & Filter")
  })

  it("doesn't render artworks filter header", () => {
    const wrapper = getWrapper({})
    const text = extractText(wrapper.root)
    expect(text).not.toContain("Showing")
    expect(text).not.toContain("works")
    expect(text).not.toContain("Sort & Filter")
  })
})
