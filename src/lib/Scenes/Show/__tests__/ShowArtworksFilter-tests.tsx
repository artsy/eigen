import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { useAnimatedValue } from "lib/Scenes/Artwork/Components/ImageCarousel/useAnimatedValue"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { ShowArtworksFilter } from "../Components/ShowArtworksFilter"

describe("Show", () => {
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

  const TestShowArtworksFilter = ({ initialData }: { initialData?: ArtworkFiltersState }) => {
    const animationValue = useAnimatedValue(0)
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <ShowArtworksFilter animationValue={animationValue} onPress={onPress} />
      </ArtworkFiltersStoreProvider>
    )
  }

  const getWrapper = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => {
    const tree = renderWithWrappers(<TestShowArtworksFilter initialData={initialData} />)
    return tree
  }

  it("renders show artworks filter header with correct text", () => {
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

  it("doesn't render show artworks filter header", () => {
    const wrapper = getWrapper({})

    const text = extractText(wrapper.root)
    expect(text).not.toContain("Showing")
    expect(text).not.toContain("works")
    expect(text).not.toContain("Sort & Filter")
  })
})
