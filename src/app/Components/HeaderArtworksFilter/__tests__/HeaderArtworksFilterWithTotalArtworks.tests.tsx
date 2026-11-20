import { screen } from "@testing-library/react-native"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { HeaderArtworksFilterWithTotalArtworks } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilterWithTotalArtworks"
import { useAnimatedValue } from "app/Scenes/Artwork/Components/ImageCarousel/useAnimatedValue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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
    return renderWithWrappers(
      <TestHeaderArtworksFilterWithTotalArtworks initialData={initialData} />
    )
  }

  it("renders artworks filter header with correct text", () => {
    getWrapper({
      initialData: {
        ...initialState,
        counts: {
          total: 12,
          followedArtists: null,
        },
      },
    })
    expect(screen.getByText("Showing 12 works")).toBeOnTheScreen()
    expect(screen.getByText("Sort & Filter")).toBeOnTheScreen()
  })

  it("doesn't render artworks filter header", () => {
    getWrapper({})
    expect(screen.queryByText(/Showing/)).not.toBeOnTheScreen()
    expect(screen.queryByText(/works/)).not.toBeOnTheScreen()
    expect(screen.queryByText(/Sort & Filter/)).not.toBeOnTheScreen()
  })
})
