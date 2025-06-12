import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { HeaderArtworksFilterWithTotalArtworks } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilterWithTotalArtworks"
import { useAnimatedValue } from "app/Scenes/Artwork/Components/ImageCarousel/useAnimatedValue"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

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
    showFilterArtworksModal: false,
    sizeMetric: "cm",
  }

  const TestHeaderArtworksFilterWithTotalArtworks = ({
    initialData,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    const animationValue = useAnimatedValue(0)
    return (
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialData,
        }}
      >
        <HeaderArtworksFilterWithTotalArtworks animationValue={animationValue} onPress={onPress} />
      </ArtworkFiltersStoreProvider>
    )
  }

  const getWrapper = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => {
    const tree = renderWithWrappersLEGACY(
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
